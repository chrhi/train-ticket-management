"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { Destination } from "@/types";

export async function getDistinationsAction(): Promise<Destination[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/destinations`, {
      cache: "no-store",
    });

    const data: Destination[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching distinations :", error);
    return [];
  }
}

export async function getDestinationByIdAction(
  id: string
): Promise<Destination | null> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/destinations/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Error fetching destination: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data: Destination = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching destination with ID ${id}:`, error);
    return null;
  }
}
