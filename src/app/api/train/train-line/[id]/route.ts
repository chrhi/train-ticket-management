import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { TrainLineSchema } from "@/lib/validators/train";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const trainLine = await db.trainLine.findUnique({
      where: {
        id,
      },
      include: {
        train: true,
        classes: true,
        schedules: true,
      },
    });

    if (!trainLine) {
      return new NextResponse(
        JSON.stringify({ error: "Train line not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(trainLine), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching train line:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch train line" }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Extract classes from the request if provided
    const { classes, ...trainLineData } = body;

    // Validate the main train line data
    const validationResult = TrainLineSchema.partial().safeParse(trainLineData);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      ...validationResult.data,
    };

    // Handle classes relationship update if provided
    if (classes) {
      updateData.classes = {
        set: [], // First disconnect all existing classes
        connect: classes.map((classId: string) => ({ id: classId })),
      };
    }

    const trainLine = await db.trainLine.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        classes: true,
      },
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "UPDATE_TRAIN_LINE",
        details: `Updated train line: ${trainLine.id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(trainLine), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating train line:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update train line" }),
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
    // First disconnect relationships
    await db.trainLine.update({
      where: {
        id,
      },
      data: {
        classes: {
          set: [], // Disconnect all classes
        },
      },
    });

    // Then delete the train line
    const trainLine = await db.trainLine.delete({
      where: {
        id,
      },
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "DELETE_TRAIN_LINE",
        details: `Deleted train line: ${trainLine.id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting train line:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete train line" }),
      { status: 500 }
    );
  }
}
