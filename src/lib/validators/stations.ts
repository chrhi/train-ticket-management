import { z } from "zod";

export const stationSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  desc: z.string(),
  isActive: z.boolean(),
});
