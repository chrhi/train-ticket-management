import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { connectionSchema } from "@/lib/validators/connections";

export async function POST(req: NextRequest) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationResult = connectionSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const connection = await db.connection.create({
      data: validationResult.data,
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "CREATE_CONNECTION",
        details: `Created connection: ${connection.fromStationId} (${connection.toStationId})`,
        ipAddress: req.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(connection), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating station:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create station" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const connections = await db.connection.findMany({
      include: {
        toStation: {
          select: {
            name: true,
          },
        },
        fromStation: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log("this is the connection");

    console.log(connections);

    return new NextResponse(JSON.stringify(connections), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch stations" }),
      { status: 500 }
    );
  }
}
