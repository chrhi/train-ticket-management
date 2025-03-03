import { z } from "zod";

export const trainScheduleSchema = z.object({
  trainLineId: z.string(),
  dayOfWeek: z.string(),
  departureTime: z.string(),
});
