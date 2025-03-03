import { z } from "zod";

export const TrainScheduleSchema = z.object({
  trainLineId: z.string({
    required_error: "Please select a train line",
  }),
  // Make dayOfWeek nullable, where null means daily
  dayOfWeek: z.number().min(0).max(6).nullable(),
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
});
