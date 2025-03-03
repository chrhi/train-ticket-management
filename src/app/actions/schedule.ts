"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { TrainSchedule } from "@/types";

export async function getTrainSchedulesAction(): Promise<TrainSchedule[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/schedule`, {
      cache: "no-store",
    });

    const data: TrainSchedule[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
}
