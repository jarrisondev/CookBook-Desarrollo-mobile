export type RideCategoryId = 'economic' | 'xl' | 'premium';

export type RideCategory = {
  id: RideCategoryId;
  label: string;
  description: string;
  capacity: number;
  etaMin: number;
  price: number;
};

export const rideCategories: RideCategory[] = [
  {
    id: 'economic',
    label: 'Economic',
    description: 'Affordable rides for daily use',
    capacity: 4,
    etaMin: 4,
    price: 5.5,
  },
  {
    id: 'xl',
    label: 'XL',
    description: 'Spacious rides for groups',
    capacity: 6,
    etaMin: 6,
    price: 8.9,
  },
  {
    id: 'premium',
    label: 'Premium',
    description: 'High-end vehicles with top drivers',
    capacity: 4,
    etaMin: 5,
    price: 12.4,
  },
];
