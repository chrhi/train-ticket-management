import { z } from "zod";

export const StationStopSchema = z
  .object({
    trainScheduleId: z.string().cuid(),
    stationId: z.string().cuid(),
    arrivalTimeHour: z.number().min(0).max(23).nullable(),
    arrivalTimeMinute: z.number().min(0).max(59).nullable(),
    departureTimeHour: z.number().min(0).max(23).nullable(),
    departureTimeMinute: z.number().min(0).max(59).nullable(),
    stopOrder: z.number().int().positive(),
  })
  .refine(
    (data) => data.arrivalTimeHour !== null || data.departureTimeHour !== null,
    { message: "At least one time (arrival or departure) must be set" }
  );

export type StationStopInput = z.infer<typeof StationStopSchema>;
