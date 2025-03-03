// lib/validators/train.ts
import { z } from "zod";

// Assuming you already have these schemas
export const TrainSchema = z.object({
  name: z.string().min(1, "Train name is required"),
  number: z.string().min(1, "Train number is required"),
  isActive: z.boolean().default(true),
});

export const TrainClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  pricePerKm: z.number().positive("Price per km must be positive"),
});

// Updated Train Line schema to include classes
export const TrainLineSchema = z.object({
  name: z.string().min(1, "Line name is required"),
  trainId: z.string().min(1, "Train selection is required"),
  isActive: z.boolean().default(true),
  // Optional array of class IDs to connect
  classes: z.array(z.string()).optional(),
});

// Types for TypeScript
export type TrainInput = z.infer<typeof TrainSchema>;
export type TrainClassInput = z.infer<typeof TrainClassSchema>;
export type TrainLineInput = z.infer<typeof TrainLineSchema>;
