import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { TrainLineSchema } from "@/lib/validators/train";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationResult = TrainLineSchema.safeParse(body);
    if (!validationResult.success) {
      console.log(validationResult.error.format());
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const { classes, ...trainLineData } = body;

    const trainLine = await db.trainLine.create({
      data: {
        ...trainLineData,
        ...(classes && {
          classes: {
            connect: classes.map((classId: string) => ({ id: classId })),
          },
        }),
      },
    });

    revalidatePath("/admin/train-routes");

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "CREATE_TRAIN_LINE",
        details: `Created train line: ${trainLine.name} (${trainLine.trainId})`,
        ipAddress: req.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(trainLine), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating train line:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create train line" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trainLines = await db.trainLine.findMany({
      include: {
        train: true,
        classes: true,
      },
    });

    return new NextResponse(JSON.stringify(trainLines), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching train lines:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch train lines" }),
      { status: 500 }
    );
  }
}
