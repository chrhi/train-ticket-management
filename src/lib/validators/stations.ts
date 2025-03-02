import { z } from "zod";

export const stationSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  desc: z.string(),
  isActive: z.boolean(),
});

export const stationUpdateSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  desc: z.string().optional(),
  prev_station: z.string().optional(),
  next_station: z.string().optional(),
  prev_dest: z.number().int().optional(),
  next_dest: z.number().int().optional(),

  isActive: z.boolean().optional(),
});
