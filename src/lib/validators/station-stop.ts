import { z } from "zod";

export const StationStopSchema = z.object({
  trainScheduleId: z.string().cuid(),
  stationId: z.string().cuid(),
  arrivalTimeHour: z.number().min(0).max(23),
  arrivalTimeMinute: z.number().min(0).max(59),
  departureTimeHour: z.number().min(0).max(23),
  departureTimeMinute: z.number().min(0).max(59),
  stopOrder: z.number().int().positive(),
});

export type StationStopInput = z.infer<typeof StationStopSchema>;
