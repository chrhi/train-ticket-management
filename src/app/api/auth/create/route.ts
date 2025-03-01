// app/api/admin/route.ts
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import { createUserSchema } from "@/lib/validators/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the input against the schema that includes confirm_password
    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Extract only the fields we need for the database
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

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the admin user
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
