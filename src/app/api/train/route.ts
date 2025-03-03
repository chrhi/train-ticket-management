import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { trainSchema } from "@/lib/validators/train";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationResult = trainSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const train = await db.train.create({
      data: validationResult.data,
    });

    revalidatePath("/admin/train");

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "CREATE_TRAIN",
        details: `Created train: ${train.name} (${train.number})`,
        ipAddress: req.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(train), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating train:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create train" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trains = await db.train.findMany();

    return new NextResponse(JSON.stringify(trains), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching trains:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch trains" }),
      { status: 500 }
    );
  }
}
