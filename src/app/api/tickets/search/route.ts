/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const originId = url.searchParams.get("originId");
    const destinationId = url.searchParams.get("destinationId");
    const date = url.searchParams.get("date");
    const classId = url.searchParams.get("classId");

    if (!originId || !destinationId || !date) {
      return new NextResponse(
        JSON.stringify({
          error:
            "Missing required parameters: originId, destinationId, and date are required",
        }),
        { status: 400 }
      );
    }

    // Parse the journey date
    const journeyDate = new Date(date);
    if (isNaN(journeyDate.getTime())) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid date format" }),
        { status: 400 }
      );
    }

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = journeyDate.getDay();

    // Find all train schedules that operate on this day
    // and have station stops that include both origin and destination

    const availableSchedules = await db.trainSchedule.findMany({
      where: {
        OR: [
          { dayOfWeek: dayOfWeek }, // Specific day of week
          { dayOfWeek: null }, // Daily schedule
        ],
        stationStops: {
          some: {
            station: {
              id: originId,
            },
          },
        },
        AND: [
          {
            stationStops: {
              some: {
                station: {
                  id: destinationId,
                },
              },
            },
          },
        ],
      },
      include: {
        trainLine: {
          include: {
            train: true,
            classes: true,
          },
        },
        stationStops: {
          include: {
            station: true,
          },
          orderBy: {
            stopOrder: "asc",
          },
        },
      },
    });

    // Filter out schedules where destination comes before origin
    const validSchedules = availableSchedules.filter((schedule) => {
      const originStop = schedule.stationStops.find(
        (stop) => stop.stationId === originId
      );
      const destinationStop = schedule.stationStops.find(
        (stop) => stop.stationId === destinationId
      );

      if (!originStop || !destinationStop) return false;

      return originStop.stopOrder < destinationStop.stopOrder;
    });

    console.log(validSchedules);

    // Process the data to return relevant ticket information
    const availableTickets = await Promise.all(
      validSchedules.map(async (schedule) => {
        const originStop = schedule.stationStops.find(
          (stop) => stop.stationId === originId
        )!;
        const destinationStop = schedule.stationStops.find(
          (stop) => stop.stationId === destinationId
        )!;

        // Calculate total distance for pricing
        let totalDistance = 0;
        const currentStationId = originId;

        for (let i = originStop.stopOrder; i < destinationStop.stopOrder; i++) {
          const currentStop = schedule.stationStops.find(
            (stop) => stop.stopOrder === i
          );
          const nextStop = schedule.stationStops.find(
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

        // Get available classes and calculate prices
        const availableClasses = await Promise.all(
          schedule.trainLine.classes
            .filter((cls) => (classId ? cls.id === classId : true))
            .map(async (cls) => {
              return {
                id: cls.id,
                name: cls.name,
                price: cls.pricePerKm * totalDistance,
              };
            })
        );

        // Set the departure time to be a combination of the journey date and the departure time from the schedule
        const departureDateTime = new Date(journeyDate);
        const originalDepartureTime = new Date(originStop.departureTime!);
        departureDateTime.setHours(
          originalDepartureTime.getHours(),
          originalDepartureTime.getMinutes(),
          0,
          0
        );

        // Same for arrival time
        const arrivalDateTime = new Date(journeyDate);
        const originalArrivalTime = new Date(destinationStop.arrivalTime!);
        arrivalDateTime.setHours(
          originalArrivalTime.getHours(),
          originalArrivalTime.getMinutes(),
          0,
          0
        );

        // If arrival is before departure, it must be the next day
        if (arrivalDateTime < departureDateTime) {
          arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
        }

        return {
          scheduleId: schedule.id,
          trainNumber: schedule.trainLine.train.number,
          trainName: schedule.trainLine.train.name,
          trainLineName: schedule.trainLine.name,
          departureStation: originStop.station.name,
          departureTime: departureDateTime.toISOString(),
          arrivalStation: destinationStop.station.name,
          arrivalTime: arrivalDateTime.toISOString(),
          distance: totalDistance,
          availableClasses,
          originStopId: originStop.id,
          destinationStopId: destinationStop.id,
        };
      })
    );

    return new NextResponse(JSON.stringify(availableTickets), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching available tickets:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch available tickets" }),
      { status: 500 }
    );
  }
}
