export type RideCategoryId = 'economic' | 'xl' | 'premium';

export type RideCategory = {
  id: RideCategoryId;
  label: string;
  description: string;
  capacity: number;
  /** Fixed amount charged at the start of the trip. */
  baseFare: number;
  /** Variable amount per kilometer travelled. */
  perKm: number;
  /** Variable amount per minute spent in the trip. */
  perMinute: number;
  /** Floor charged when distance/duration are very small. */
  minimumFare: number;
  /** Default ETA shown when we don't yet have a real Directions result. */
  defaultEtaMin: number;
};

export const rideCategories: RideCategory[] = [
  {
    id: 'economic',
    label: 'Economic',
    description: 'Affordable rides for daily use',
    capacity: 4,
    baseFare: 3000,
    perKm: 1500,
    perMinute: 200,
    minimumFare: 5500,
    defaultEtaMin: 4,
  },
  {
    id: 'xl',
    label: 'XL',
    description: 'Spacious rides for groups',
    capacity: 6,
    baseFare: 5000,
    perKm: 2200,
    perMinute: 300,
    minimumFare: 8500,
    defaultEtaMin: 6,
  },
  {
    id: 'premium',
    label: 'Premium',
    description: 'High-end vehicles with top drivers',
    capacity: 4,
    baseFare: 7000,
    perKm: 3000,
    perMinute: 400,
    minimumFare: 12000,
    defaultEtaMin: 5,
  },
];
