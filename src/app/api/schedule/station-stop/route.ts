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

    const data = validationResult.data;

    // Check if trainScheduleId exists
    const trainSchedule = await db.trainSchedule.findUnique({
      where: { id: data.trainScheduleId },
    });

    if (!trainSchedule) {
      return new NextResponse(
        JSON.stringify({ error: "Train schedule not found" }),
        { status: 404 }
      );
    }

    // Check if station exists
    const station = await db.station.findUnique({
      where: { id: data.stationId },
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
          trainScheduleId: data.trainScheduleId,
          stationId: data.stationId,
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
          trainScheduleId: data.trainScheduleId,
          stopOrder: data.stopOrder,
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

    // Handle nullable times
    const departureTime =
      data.departureTimeHour !== null && data.departureTimeMinute !== null
        ? (() => {
            const time = new Date();
            time.setHours(data.departureTimeHour!);
            time.setMinutes(data.departureTimeMinute!);
            time.setSeconds(0);
            time.setMilliseconds(0);
            return time;
          })()
        : null;

    const arrivalTime =
      data.arrivalTimeHour !== null && data.arrivalTimeMinute !== null
        ? (() => {
            const time = new Date();
            time.setHours(data.arrivalTimeHour!);
            time.setMinutes(data.arrivalTimeMinute!);
            time.setSeconds(0);
            time.setMilliseconds(0);
            return time;
          })()
        : null;

    const stationStop = await db.stationStop.create({
      data: {
        trainScheduleId: data.trainScheduleId,
        stationId: data.stationId,
        arrivalTime,
        departureTime,
        stopOrder: data.stopOrder,
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

export async function GET() {
  try {
    const stationStops = await db.stationStop.findMany({
      include: {
        station: { select: { id: true, name: true } },
        trainSchedule: { select: { id: true } },
      },
      orderBy: { stopOrder: "asc" },
    });

    // Clean the response
    const formattedStops = stationStops.map((stop) => ({
      id: stop.id,
      stationName: stop.station.name,
      trainScheduleId: stop.trainSchedule.id,
      arrivalTime: stop.arrivalTime,
      departureTime: stop.departureTime,
      stopOrder: stop.stopOrder,
    }));

    return new NextResponse(JSON.stringify(formattedStops), {
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
