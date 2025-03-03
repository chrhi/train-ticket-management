"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { StationStop } from "@/types";

/**
 * Fetches all station stops from the API
 */
export async function getStationstopsAction(): Promise<StationStop[]> {
  try {
    const response = await fetch(
      `${getAppBaseUrl()}/api/schedule/station-stop`,
      {
        cache: "no-store",
      }
    );

    const data: StationStop[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching trains:", error);
    return [];
  }
}

/**
 * Fetches a single Station stop top by ID
 */
export async function getScheduleStopsByIdAction(
  id: string
): Promise<StationStop | null> {
  try {
    const response = await fetch(
      `${getAppBaseUrl()}/api/schedule/station-stop/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: StationStop = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching train with ID ${id}:`, error);
    return null;
  }
}
