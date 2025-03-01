import { NextResponse } from "next/server";
import argon2 from "argon2";
import { createUserSchema } from "@/lib/validators/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, name, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await db.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id, // Recommended variant (combines security features)
      memoryCost: 2 ** 16, // 64 MB memory usage
      timeCost: 3, // Number of iterations
      parallelism: 1, // Number of threads
    });

    const newUser = await db.admin.create({
      data: {
        email,
        name,
        passwordHash,
        role: "admin",
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
