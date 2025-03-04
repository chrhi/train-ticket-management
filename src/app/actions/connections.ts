/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { Connection } from "@/types";

export async function getConnectionsAction(): Promise<Connection[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/connections`, {
      cache: "no-store",
    });

    const data = await response.json();

    const EditedData: Connection[] = data.map(
      (item: {
        fromStation: { name: any };
        toStation: { name: any };
        distance: any;
        isActive: any;
      }) => {
        return {
          ...data,
          fromStation: item.fromStation?.name,
          toStation: item.toStation?.name,
          distance: item.distance,
          isActive: item.isActive,
        };
      }
    );

    console.log(EditedData);
    return EditedData;
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
