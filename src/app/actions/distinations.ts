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
