"use server";

import { getAppBaseUrl } from "@/lib/utils";
import { User } from "@/types";

export async function getAdminsAction(): Promise<User[]> {
  try {
    const response = await fetch(`${getAppBaseUrl()}/api/auth/admins`, {
      cache: "no-store",
    });

    const data: User[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
}
