import { cookies } from "next/headers";

import { db } from "./db";

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
