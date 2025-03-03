import { z } from "zod";

export const StationStopSchema = z.object({
  trainScheduleId: z.string().cuid(),
  stationId: z.string().cuid(),
  arrivalTime: z.string().datetime().nullable().optional(),
  departureTime: z.string().datetime().nullable().optional(),
  stopOrder: z.number().int().positive(),
});

export type StationStopInput = z.infer<typeof StationStopSchema>;
