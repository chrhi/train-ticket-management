/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { StationStopSchema } from "@/lib/validators/station-stop";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stationStop = await db.stationStop.findUnique({
      where: { id },
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
    });

    if (!stationStop) {
      return new NextResponse(
        JSON.stringify({ error: "Station stop not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(stationStop), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching station stop:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch station stop" }),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    // Check if station stop exists
    const existingStationStop = await db.stationStop.findUnique({
      where: { id },
    });

    if (!existingStationStop) {
      return new NextResponse(
        JSON.stringify({ error: "Station stop not found" }),
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = StationStopSchema.partial().safeParse(body);

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

    // If changing trainScheduleId or stationId or stopOrder, check uniqueness constraints
    if (
      (data.trainScheduleId &&
        data.trainScheduleId !== existingStationStop.trainScheduleId) ||
      (data.stationId && data.stationId !== existingStationStop.stationId) ||
      (data.stopOrder && data.stopOrder !== existingStationStop.stopOrder)
    ) {
      // New trainScheduleId and stationId combo
      if (data.trainScheduleId && data.stationId) {
        const existingStop = await db.stationStop.findUnique({
          where: {
            trainScheduleId_stationId: {
              trainScheduleId: data.trainScheduleId,
              stationId: data.stationId,
            },
          },
        });

        if (existingStop && existingStop.id !== id) {
          return new NextResponse(
            JSON.stringify({
              error: "This station is already part of this train schedule",
            }),
            { status: 409 }
          );
        }
      }

      // New trainScheduleId and stopOrder combo
      if (data.trainScheduleId && data.stopOrder) {
        const existingStop = await db.stationStop.findUnique({
          where: {
            trainScheduleId_stopOrder: {
              trainScheduleId: data.trainScheduleId,
              stopOrder: data.stopOrder,
            },
          },
        });

        if (existingStop && existingStop.id !== id) {
          return new NextResponse(
            JSON.stringify({
              error: "This stop order is already taken for this train schedule",
            }),
            { status: 409 }
          );
        }
      }
    }

    // Convert string datetime to Date objects if provided
    const updateData: any = {
      ...data,
      arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : undefined,
      departureTime: data.departureTime
        ? new Date(data.departureTime)
        : undefined,
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedStationStop = await db.stationStop.update({
      where: { id: id },
      data: updateData,
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "UPDATE_STATION_STOP",
        details: `Updated station stop ID: ${updatedStationStop.id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(updatedStationStop), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating station stop:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update station stop" }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    // Check if station stop exists
    const stationStop = await db.stationStop.findUnique({
      where: { id },
    });

    if (!stationStop) {
      return new NextResponse(
        JSON.stringify({ error: "Station stop not found" }),
        { status: 404 }
      );
    }

    // Check if this stop is referenced by any tickets
    const tickets = await db.ticket.findMany({
      where: {
        OR: [{ originStopId: id }, { destinationStopId: id }],
      },
      take: 1,
    });

    if (tickets.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: "Cannot delete station stop that is referenced by tickets",
        }),
        { status: 409 }
      );
    }

    // Delete the station stop
    await db.stationStop.delete({
      where: { id },
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "DELETE_STATION_STOP",
        details: `Deleted station stop ID: ${id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting station stop:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete station stop" }),
      { status: 500 }
    );
  }
}
