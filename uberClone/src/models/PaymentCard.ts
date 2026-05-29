import { z } from 'zod';

export const paymentCardSchema = z.object({
  id: z.string().min(1),
  brand: z.enum(['visa', 'mastercard']),
  last4: z.string().length(4).regex(/^\d{4}$/),
  holder: z.string().min(1),
  expires: z.string().regex(/^\d{2}\/\d{2}$/, 'Use MM/YY format'),
  default: z.boolean().optional(),
});

export type PaymentCard = z.infer<typeof paymentCardSchema>;
