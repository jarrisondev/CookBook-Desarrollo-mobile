import { z } from 'zod';
import { timestampLike } from './User';

export const rideStatusSchema = z.enum([
  'searching',
  'accepted',
  'arrived',
  'inProgress',
  'completed',
  'cancelled',
]);

export const rideCategorySchema = z.enum(['economic', 'xl', 'premium']);

export const paymentMethodSchema = z.enum(['cash', 'card', 'wallet']);

export const ridePointSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const optionalString = z
  .string()
  .nullish()
  .transform((v) => v ?? undefined);

const optionalNumber = z
  .number()
  .nullish()
  .transform((v) => v ?? undefined);

export const rideSchema = z.object({
  id: z.string().min(1),
  status: rideStatusSchema,

  riderId: z.string().min(1),
  riderName: z.string().min(1),
  riderPhone: optionalString,
  riderPhotoUri: optionalString,
  riderRating: optionalNumber,

  driverId: optionalString,
  driverName: optionalString,
  driverPhotoUri: optionalString,
  driverRating: optionalNumber,
  driverPlate: optionalString,
  driverCar: optionalString,

  pickup: ridePointSchema,
  dropoff: ridePointSchema,
  category: rideCategorySchema,

  fareEstimate: z.number().min(0),
  finalFare: optionalNumber,
  tip: optionalNumber,
  paymentMethod: paymentMethodSchema.default('cash'),
  bonusPercent: optionalNumber,

  distanceKm: optionalNumber,
  etaMin: optionalNumber,

  rating: optionalNumber,
  comment: optionalString,

  createdAt: timestampLike.optional(),
  acceptedAt: timestampLike.optional(),
  arrivedAt: timestampLike.optional(),
  startedAt: timestampLike.optional(),
  completedAt: timestampLike.optional(),
  cancelledAt: timestampLike.optional(),
});

export type Ride = z.infer<typeof rideSchema>;
export type RideStatus = z.infer<typeof rideStatusSchema>;
export type RideCategory = z.infer<typeof rideCategorySchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type RidePoint = z.infer<typeof ridePointSchema>;
