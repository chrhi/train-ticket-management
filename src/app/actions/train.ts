"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { Train } from "@/types";

/**
 * Fetches all trains from the API
 */
export async function getTrainsAction(): Promise<Train[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/train`, {
      cache: "no-store",
    });

    const data: Train[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching trains:", error);
    return [];
  }
}

/**
 * Fetches a single train by ID
 */
export async function getTrainByIdAction(id: string): Promise<Train | null> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/train/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data: Train = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching train with ID ${id}:`, error);
    return null;
  }
}
