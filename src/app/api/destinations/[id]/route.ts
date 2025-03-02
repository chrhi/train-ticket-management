import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, isAuthorized } from "@/lib/session";
import { stationSchema } from "@/lib/validators/stations";

// GET a single station by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const station = await db.station.findUnique({
      where: { id },
    });

    if (!station) {
      return new NextResponse(JSON.stringify({ error: "Station not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(station), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching station:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch station" }),
      { status: 500 }
    );
  }
}

// UPDATE a station by ID
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const { id } = await params;

    // Check if station exists
    const existingStation = await db.station.findUnique({
      where: { id },
    });

    if (!existingStation) {
      return new NextResponse(JSON.stringify({ error: "Station not found" }), {
        status: 404,
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = stationSchema.partial().safeParse(body);

    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    // Update station
    const updatedStation = await db.station.update({
      where: { id },
      data: validationResult.data,
    });

    // Create audit log
    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "UPDATE_STATION",
        details: `Updated station: ${updatedStation.name} (${updatedStation.id})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
      },
    });

    return new NextResponse(JSON.stringify(updatedStation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating station:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update station" }),
      { status: 500 }
    );
  }
}

// DELETE a station by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await isAuthorized();
  if (authError) return authError;

  try {
    const { id } = await params;

    // Check if station exists
    const existingStation = await db.station.findUnique({
      where: { id },
    });

    if (!existingStation) {
      return new NextResponse(JSON.stringify({ error: "Station not found" }), {
        status: 404,
      });
    }

    // Delete station
    await db.station.delete({
      where: { id },
    });

    // Create audit log
    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session!.user.id,
        action: "DELETE_STATION",
        details: `Deleted station: ${existingStation.name} (${existingStation.id})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting station:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete station" }),
      { status: 500 }
    );
  }
}
