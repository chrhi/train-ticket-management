// app/api/train-class/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { TrainClassSchema } from "@/lib/validators/train";

export async function POST(req: NextRequest) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationResult = TrainClassSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const trainClass = await db.trainClass.create({
      data: validationResult.data,
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "CREATE_TRAIN_CLASS",
        details: `Created train class: ${trainClass.name} (${trainClass.pricePerKm})`,
        ipAddress: req.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(trainClass), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating train class:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create train class" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trainClasses = await db.trainClass.findMany();

    return new NextResponse(JSON.stringify(trainClasses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching train classes:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch train classes" }),
      { status: 500 }
    );
  }
}
