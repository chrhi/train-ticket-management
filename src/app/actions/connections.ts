"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { Connection } from "@/types";

export async function getConnectionsAction(): Promise<Connection[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/connections`, {
      cache: "no-store",
    });

    const data: Connection[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching distinations :", error);
    return [];
  }
}

export async function getConnectionByIdAction(
  id: string
): Promise<Connection | null> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/connections/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Error fetching destination: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data: Connection = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching destination with ID ${id}:`, error);
    return null;
  }
}
