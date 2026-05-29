import { z } from 'zod';
import { Timestamp } from '@firebase/firestore';

export const genderSchema = z.enum(['male', 'female', 'other']);
export const roleSchema = z.enum(['rider', 'driver']);
export const languageSchema = z.enum(['es', 'en']);

export const vehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  color: z.string().min(1),
  plate: z.string().min(1),
  year: z.number().int().min(1990).max(2100),
  seats: z.number().int().min(1).max(20),
  category: z.enum(['economic', 'xl', 'premium']),
});

export const timestampLike = z.union([
  z.instanceof(Timestamp),
  z.object({ seconds: z.number(), nanoseconds: z.number() }),
  z.null(),
]);

export const userSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1).max(50),
  phone: z.string().min(1),
  gender: genderSchema,
  role: roleSchema,
  photoUri: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  language: languageSchema.default('es'),
  level: z.string().default('Basic Level'),
  balance: z.number().default(0),
  rating: z.number().min(0).max(5).default(5),
  vehicle: vehicleSchema.optional(),
  createdAt: timestampLike.optional(),
  updatedAt: timestampLike.optional(),
});

export type User = z.infer<typeof userSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type Gender = z.infer<typeof genderSchema>;
export type UserRole = z.infer<typeof roleSchema>;
export type Language = z.infer<typeof languageSchema>;
