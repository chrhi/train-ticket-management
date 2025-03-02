import { z } from "zod";

export const connectionSchema = z
  .object({
    fromStationId: z.string().min(1, "First station is required"),
    toStationId: z.string().min(1, "Second station is required"),
    distance: z.number().gt(0, "Distance must be greater than 0"),
    isActive: z.boolean(),
  })
  .refine((data) => data.fromStationId !== data.toStationId, {
    message: "First and second stations must be different",
    path: ["toStationId"],
  });
