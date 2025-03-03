import { cookies } from "next/headers";

import { db } from "./db";
import { NextResponse } from "next/server";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    // Find the session and include the user
    const session = await db.session.findUnique({
      where: {
        id: sessionId,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

export async function isAuthorized() {
  const session = await getSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Please login to continue" }),
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return new NextResponse(
      JSON.stringify({ error: "Forbidden: Admin access required" }),
      { status: 403 }
    );
  }

  return null;
}
