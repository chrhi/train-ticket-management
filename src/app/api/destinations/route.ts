import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { stationSchema } from "@/lib/validators/stations";

export async function POST(req: NextRequest) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationResult = stationSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const station = await db.station.create({
      data: validationResult.data,
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "CREATE_STATION",
        details: `Created station: ${station.name} (${station.id})`,
        ipAddress: req.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(station), {
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

// Get all stations
export async function GET() {
  try {
    const stations = await db.station.findMany({
      orderBy: { name: "asc" },
    });

    return new NextResponse(JSON.stringify(stations), {
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
