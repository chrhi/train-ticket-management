import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const admins = await db.admin.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        active: true,
        // Excluding passwordHash for security
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}
