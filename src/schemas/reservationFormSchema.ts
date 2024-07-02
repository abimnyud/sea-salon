import { z } from "zod";

const reservationFormSchema = z.object({
  branchId: z.coerce.number(),
  treatmentId: z.coerce.number(),
  stylistId: z.string(),
  date: z.date(),
  time: z.string(),
});
export type ReservationForm = z.infer<typeof reservationFormSchema>;