import { z } from "zod";

export const busRequestSchema = z.object({
  universityName: z.string().trim().min(2, "Enter the university name"),
  busesRequired: z.coerce.number().int().min(1, "At least 1 bus is required").max(5, "Only 5 buses are available"),
  requiredDate: z.string().min(1, "Select a date"),
  requiredTime: z.string().min(1, "Select a time"),
  purpose: z.string().trim().min(3, "Describe the purpose or event"),
  pickupLocation: z.string().trim().min(2, "Enter a pickup location"),
  notes: z.string().trim().optional(),
});
