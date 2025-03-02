"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { TrainClass } from "@/types";

/**
 * Fetches all train classes from the API
 */
export async function getTrainClassesAction(): Promise<TrainClass[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/train-class`, {
      cache: "no-store",
    });

    const data: TrainClass[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching train classes:", error);
    return [];
  }
}

/**
 * Fetches a single train class by ID
 */
export async function getTrainClassByIdAction(
  id: string
): Promise<TrainClass | null> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/train-class/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data: TrainClass = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching train class with ID ${id}:`, error);
    return null;
  }
}
