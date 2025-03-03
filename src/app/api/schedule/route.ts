import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { TrainScheduleSchema } from "@/lib/validators/schedule";

export async function POST(req: NextRequest) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationResult = TrainScheduleSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const departureTime = new Date();
    departureTime.setHours(validationResult.data.hour);
    departureTime.setMinutes(validationResult.data.minute);
    departureTime.setSeconds(0);
    departureTime.setMilliseconds(0);

    const trainSchedule = await db.trainSchedule.create({
      data: {
        departureTime,
        dayOfWeek: validationResult.data.dayOfWeek,
        trainLineId: validationResult.data.trainLineId,
      },
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "CREATE_TRAIN_SCHEDULE",
        details: `Created train schedule for train line: ${trainSchedule.trainLineId} (${trainSchedule.id})`,
        ipAddress: req.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(trainSchedule), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating train schedule:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create train schedule" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trainSchedules = await db.trainSchedule.findMany({
      include: {
        trainLine: {
          include: {
            train: true,
            classes: true,
          },
        },
      },
      orderBy: { departureTime: "asc" },
    });

    return new NextResponse(JSON.stringify(trainSchedules), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching train schedules:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch train schedules" }),
      { status: 500 }
    );
  }
}
