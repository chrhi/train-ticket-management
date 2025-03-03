import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { TrainClassSchema } from "@/lib/validators/train";
import { revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const trainClass = await db.trainClass.findUnique({
      where: {
        id,
      },
      include: {
        trainLines: true,
        tickets: true,
      },
    });

    if (!trainClass) {
      return new NextResponse(
        JSON.stringify({ error: "Train class not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(trainClass), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching train class:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch train class" }),
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

    const validationResult = TrainClassSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const trainClass = await db.trainClass.update({
      where: {
        id,
      },
      data: validationResult.data,
    });

    revalidatePath("/admin/train-classes");

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "UPDATE_TRAIN_CLASS",
        details: `Updated train class: ${trainClass.id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(trainClass), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating train class:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update train class" }),
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
    const trainClass = await db.trainClass.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/train-classes");

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "DELETE_TRAIN_CLASS",
        details: `Deleted train class: ${trainClass.id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting train class:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete train class" }),
      { status: 500 }
    );
  }
}
