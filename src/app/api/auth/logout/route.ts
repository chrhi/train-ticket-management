import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    // Get the session ID from cookies
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      // Find the session to get user information for the audit log
      const session = await db.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      // Delete the session from the database
      if (session) {
        // Create audit log entry
        await db.auditLog.create({
          data: {
            userId: session.userId,
            action: "LOGOUT",
            details: "User logged out",
            ipAddress: request.headers.get("x-forwarded-for") || null,
          },
        });

        // Delete the session
        await db.session.delete({
          where: { id: sessionId },
        });
      }

      // Clear the session cookie
      cookieStore.set({
        name: "session_id",
        value: "",
        expires: new Date(0),
        path: "/",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
