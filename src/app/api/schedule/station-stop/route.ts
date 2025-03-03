/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { StationStopSchema } from "@/lib/validators/station-stop";

export async function POST(req: NextRequest) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationResult = StationStopSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    // Check if trainScheduleId exists
    const trainSchedule = await db.trainSchedule.findUnique({
      where: { id: validationResult.data.trainScheduleId },
    });

    if (!trainSchedule) {
      return new NextResponse(
        JSON.stringify({ error: "Train schedule not found" }),
        { status: 404 }
      );
    }

    // Check if station exists
    const station = await db.station.findUnique({
      where: { id: validationResult.data.stationId },
    });

    if (!station) {
      return new NextResponse(JSON.stringify({ error: "Station not found" }), {
        status: 404,
      });
    }

    // Check for uniqueness constraints
    const existingStopByStation = await db.stationStop.findUnique({
      where: {
        trainScheduleId_stationId: {
          trainScheduleId: validationResult.data.trainScheduleId,
          stationId: validationResult.data.stationId,
        },
      },
    });

    if (existingStopByStation) {
      return new NextResponse(
        JSON.stringify({
          error: "This station is already part of this train schedule",
        }),
        { status: 409 }
      );
    }

    const existingStopByOrder = await db.stationStop.findUnique({
      where: {
        trainScheduleId_stopOrder: {
          trainScheduleId: validationResult.data.trainScheduleId,
          stopOrder: validationResult.data.stopOrder,
        },
      },
    });

    if (existingStopByOrder) {
      return new NextResponse(
        JSON.stringify({
          error: "This stop order is already taken for this train schedule",
        }),
        { status: 409 }
      );
    }

    const stationStop = await db.stationStop.create({
      data: {
        trainScheduleId: validationResult.data.trainScheduleId,
        stationId: validationResult.data.stationId,
        arrivalTime: validationResult.data.arrivalTime
          ? new Date(validationResult.data.arrivalTime)
          : null,
        departureTime: validationResult.data.departureTime
          ? new Date(validationResult.data.departureTime)
          : null,
        stopOrder: validationResult.data.stopOrder,
      },
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "CREATE_STATION_STOP",
        details: `Created station stop for station: ${stationStop.stationId} on train schedule: ${stationStop.trainScheduleId}`,
        ipAddress: req.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(stationStop), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating station stop:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create station stop" }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const trainScheduleId = url.searchParams.get("trainScheduleId");
    const stationId = url.searchParams.get("stationId");

    // Build filter based on query parameters
    const where: any = {};
    if (trainScheduleId) {
      where.trainScheduleId = trainScheduleId;
    }
    if (stationId) {
      where.stationId = stationId;
    }

    const stationStops = await db.stationStop.findMany({
      where,
      include: {
        station: true,
        trainSchedule: {
          include: {
            trainLine: {
              include: {
                train: true,
              },
            },
          },
        },
      },
      orderBy: { stopOrder: "asc" },
    });

    return new NextResponse(JSON.stringify(stationStops), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching station stops:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch station stops" }),
      { status: 500 }
    );
  }
}
