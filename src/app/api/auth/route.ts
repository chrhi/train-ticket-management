import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

// Session expiration time (24 hours)
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await argon2.verify(user.passwordHash, password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
    const sessionId = uuidv4();

    // Get IP and user agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");

    await db.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        details: "User logged in successfully",
        ipAddress: ipAddress || null,
      },
    });

    // Set session cookie
    cookieStore.set({
      name: "session_id",
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
