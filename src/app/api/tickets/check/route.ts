import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const referenceNumber = url.searchParams.get("referenceNumber");
    const lastName = url.searchParams.get("lastName");

    // Validate required parameters
    if (!referenceNumber) {
      return new NextResponse(
        JSON.stringify({ error: "Reference number is required" }),
        { status: 400 }
      );
    }

    // Find the ticket by reference number
    const ticket = await db.ticket.findUnique({
      where: {
        referenceNumber: referenceNumber,
      },
      include: {
        trainSchedule: {
          include: {
            trainLine: {
              include: {
                train: true,
              },
            },
            stationStops: {
              include: {
                station: true,
              },
            },
          },
        },
        trainClass: true,
      },
    });

    // If ticket not found
    if (!ticket) {
      return new NextResponse(
        JSON.stringify({
          valid: false,
          message: "Ticket not found",
        }),
        { status: 404 }
      );
    }

    // If lastName is provided, validate it matches
    if (
      lastName &&
      !ticket.passengerName.toLowerCase().includes(lastName.toLowerCase())
    ) {
      return new NextResponse(
        JSON.stringify({
          valid: false,
          message: "Passenger name does not match",
        }),
        { status: 400 }
      );
    }

    // Check if ticket is still valid
    const now = new Date();
    const isExpired = now > ticket.validUntil;
    const isUsed = ticket.status === "used";
    const isCancelled =
      ticket.status === "cancelled" || ticket.status === "refunded";

    // Find the origin and destination stops
    const originStop = ticket.trainSchedule.stationStops.find(
      (stop) => stop.id === ticket.originStopId
    );
    const destinationStop = ticket.trainSchedule.stationStops.find(
      (stop) => stop.id === ticket.destinationStopId
    );

    if (!originStop || !destinationStop) {
      return new NextResponse(
        JSON.stringify({
          valid: false,
          message: "Invalid ticket data - missing station information",
        }),
        { status: 400 }
      );
    }

    // Construct the response
    const ticketStatus = {
      valid: !isExpired && !isUsed && !isCancelled && ticket.status === "valid",
      status: ticket.status,
      expired: isExpired,
      ticketDetails: {
        referenceNumber: ticket.referenceNumber,
        passengerName: ticket.passengerName,
        passengerEmail: ticket.passengerEmail,
        seatNumber: ticket.seatNumber,
        journeyDate: ticket.journeyDate,
        validUntil: ticket.validUntil,
        price: ticket.price,
        purchaseDate: ticket.purchaseDate,
        trainInfo: {
          trainNumber: ticket.trainSchedule.trainLine.train.number,
          trainName: ticket.trainSchedule.trainLine.train.name,
          trainLineName: ticket.trainSchedule.trainLine.name,
          className: ticket.trainClass.name,
        },
        journeyInfo: {
          departureStation: originStop.station.name,
          departureTime: originStop.departureTime,
          arrivalStation: destinationStop.station.name,
          arrivalTime: destinationStop.arrivalTime,
        },
      },
    };

    return new NextResponse(JSON.stringify(ticketStatus), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error validating ticket:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to validate ticket" }),
      { status: 500 }
    );
  }
}
