import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

function generateReferenceNumber() {
  return nanoid(10).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "trainScheduleId",
      "trainClassId",
      "originStopId",
      "destinationStopId",
      "journeyDate",
      "passengerName",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return new NextResponse(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400 }
        );
      }
    }

    // Parse and validate journey date
    const journeyDate = new Date(body.journeyDate);
    if (isNaN(journeyDate.getTime())) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid journey date format" }),
        { status: 400 }
      );
    }

    // Verify the train schedule exists
    const trainSchedule = await db.trainSchedule.findUnique({
      where: { id: body.trainScheduleId },
      include: {
        trainLine: {
          include: {
            classes: true,
          },
        },
        stationStops: true,
      },
    });

    if (!trainSchedule) {
      return new NextResponse(
        JSON.stringify({ error: "Train schedule not found" }),
        { status: 404 }
      );
    }

    // Verify the train class exists and is valid for this train line
    const trainClass = trainSchedule.trainLine.classes.find(
      (c) => c.id === body.trainClassId
    );

    if (!trainClass) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid train class for this train line" }),
        { status: 400 }
      );
    }

    // Verify origin and destination stops exist for this schedule
    const originStop = trainSchedule.stationStops.find(
      (stop) => stop.id === body.originStopId
    );
    const destinationStop = trainSchedule.stationStops.find(
      (stop) => stop.id === body.destinationStopId
    );

    if (!originStop || !destinationStop) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid origin or destination stop" }),
        { status: 400 }
      );
    }

    // Ensure origin comes before destination
    if (originStop.stopOrder >= destinationStop.stopOrder) {
      return new NextResponse(
        JSON.stringify({ error: "Origin must come before destination" }),
        { status: 400 }
      );
    }

    // Calculate total distance for pricing
    let totalDistance = 0;

    for (let i = originStop.stopOrder; i < destinationStop.stopOrder; i++) {
      const currentStop = trainSchedule.stationStops.find(
        (stop) => stop.stopOrder === i
      );
      const nextStop = trainSchedule.stationStops.find(
        (stop) => stop.stopOrder === i + 1
      );

      if (currentStop && nextStop) {
        // Find connection between stations
        const connection = await db.connection.findUnique({
          where: {
            fromStationId_toStationId: {
              fromStationId: currentStop.stationId,
              toStationId: nextStop.stationId,
            },
          },
        });

        if (connection) {
          totalDistance += connection.distance;
        }
      }
    }

    // Calculate price
    const price = trainClass.pricePerKm * totalDistance;

    // Generate reference number
    const referenceNumber = generateReferenceNumber();

    // Set validity period (24 hours after the journey date)
    const validUntil = new Date(journeyDate);
    validUntil.setDate(validUntil.getDate() + 1);

    // Create the ticket
    const ticket = await db.ticket.create({
      data: {
        referenceNumber,
        trainScheduleId: body.trainScheduleId,
        trainClassId: body.trainClassId,
        originStopId: body.originStopId,
        destinationStopId: body.destinationStopId,
        journeyDate,
        passengerName: body.passengerName,
        passengerEmail: body.passengerEmail || null,
        seatNumber: body.seatNumber || null,
        status: "valid",
        price,
        validUntil,
      },
    });

    // Get full ticket details for response
    const ticketWithDetails = await db.ticket.findUnique({
      where: { id: ticket.id },
      include: {
        trainSchedule: {
          include: {
            trainLine: {
              include: {
                train: true,
              },
            },
          },
        },
        trainClass: true,
      },
    });

    return new NextResponse(JSON.stringify(ticketWithDetails), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create ticket" }),
      { status: 500 }
    );
  }
}
