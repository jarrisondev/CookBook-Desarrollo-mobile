export type RideCategory = {
  id: 'economic' | 'xl' | 'premium';
  label: string;
  description: string;
  capacity: number;
  etaMin: number;
  price: number;
  emoji: string;
};

export const rideCategories: RideCategory[] = [
  {
    id: 'economic',
    label: 'Economic',
    description: 'Affordable rides for daily use',
    capacity: 4,
    etaMin: 4,
    price: 5.5,
    emoji: '🚗',
  },
  {
    id: 'xl',
    label: 'XL',
    description: 'Spacious rides for groups',
    capacity: 6,
    etaMin: 6,
    price: 8.9,
    emoji: '🚙',
  },
  {
    id: 'premium',
    label: 'Premium',
    description: 'High-end vehicles with top drivers',
    capacity: 4,
    etaMin: 5,
    price: 12.4,
    emoji: '🚘',
  },
];
