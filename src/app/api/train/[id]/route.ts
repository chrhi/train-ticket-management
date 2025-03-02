import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { trainSchema } from "@/lib/validators/train";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const train = await db.train.findUnique({
      where: {
        id: id,
      },
      include: {
        trainLines: true,
      },
    });

    if (!train) {
      return new NextResponse(JSON.stringify({ error: "Train not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(train), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching train:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch train" }),
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

    const validationResult = trainSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const train = await db.train.update({
      where: {
        id: id,
      },
      data: validationResult.data,
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "UPDATE_TRAIN",
        details: `Updated train: ${train.id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(JSON.stringify(train), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating train:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update train" }),
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
    const train = await db.train.delete({
      where: {
        id: id,
      },
    });

    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "DELETE_TRAIN",
        details: `Deleted train: ${train.id}`,
        ipAddress: request.headers.get("x-forwarded-for"),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting train:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete train" }),
      { status: 500 }
    );
  }
}
