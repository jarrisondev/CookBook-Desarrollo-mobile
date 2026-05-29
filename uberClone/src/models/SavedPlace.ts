import { z } from 'zod';
import { timestampLike } from './User';

export const placeTypeSchema = z.enum(['home', 'work', 'recent', 'favorite']);

export const savedPlaceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(60),
  address: z.string().min(1).max(200),
  type: placeTypeSchema,
  lat: z.number().optional(),
  lng: z.number().optional(),
  createdAt: timestampLike.optional(),
});

export type SavedPlace = z.infer<typeof savedPlaceSchema>;
export type PlaceType = z.infer<typeof placeTypeSchema>;
