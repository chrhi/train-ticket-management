import { z } from "zod";

export const trainSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  number: z.string(),
  isActive: z.boolean(),
});

export const TrainClassSchema = z.object({
  name: z.string(),
  pricePerKm: z.number().min(0, "Price must be a positive number"),
});

export const TrainLineSchema = z.object({
  name: z.string(),
  trainId: z.string(),
  isActive: z.boolean(),
});
