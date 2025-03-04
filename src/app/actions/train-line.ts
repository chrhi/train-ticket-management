"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { TrainLine } from "@/types";

/**
 * Fetches all train lines from the API
 */
export async function getTrainLinesAction(): Promise<TrainLine[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/train/train-line`, {
      cache: "no-store",
    });

    const data: TrainLine[] = await response.json();

    // i will deal with this later

    // const editedData : TrainLine[] = data.map(item => {
    //   return {
    //     ...data ,
    //     trainId : item.train
    //   }
    // })

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching train lines:", error);
    return [];
  }
}

/**
 * Fetches a single train line by ID
 */
export async function getTrainLineByIdAction(
  id: string
): Promise<TrainLine | null> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/train-line/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data: TrainLine = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching train line with ID ${id}:`, error);
    return null;
  }
}
