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

export type SavedPlace = {
  id: string;
  label: string;
  address: string;
  type: 'home' | 'work' | 'recent';
};

export const savedPlaces: SavedPlace[] = [
  { id: '1', label: 'Home', address: '221B Baker St, London', type: 'home' },
  { id: '2', label: 'Office', address: '10 Downing St, London', type: 'work' },
  { id: '3', label: 'Carter Ln, London', address: 'Carter Ln, London', type: 'recent' },
  { id: '4', label: 'St Thomas, 19', address: 'London City', type: 'recent' },
];

export type Trip = {
  id: string;
  date: string;
  from: string;
  to: string;
  driverName: string;
  category: RideCategory['id'];
  price: number;
  status: 'completed' | 'cancelled';
};

export const tripHistory: Trip[] = [
  {
    id: 't1',
    date: '2026-05-24T10:32:00Z',
    from: 'St Paul Cathedral',
    to: 'Tower Bridge',
    driverName: 'Brad Smith',
    category: 'economic',
    price: 6.4,
    status: 'completed',
  },
  {
    id: 't2',
    date: '2026-05-22T18:15:00Z',
    from: 'King’s Cross',
    to: 'Hyde Park',
    driverName: 'John Doe',
    category: 'premium',
    price: 14.8,
    status: 'completed',
  },
  {
    id: 't3',
    date: '2026-05-20T08:05:00Z',
    from: 'Home',
    to: 'Office',
    driverName: 'Sara Khan',
    category: 'economic',
    price: 5.2,
    status: 'cancelled',
  },
  {
    id: 't4',
    date: '2026-05-15T20:40:00Z',
    from: 'Waterloo Station',
    to: 'Shoreditch',
    driverName: 'Liam Wright',
    category: 'xl',
    price: 11.3,
    status: 'completed',
  },
];

export type PaymentCard = {
  id: string;
  brand: 'visa' | 'mastercard';
  last4: string;
  holder: string;
  expires: string;
  default?: boolean;
};

export const paymentCards: PaymentCard[] = [
  {
    id: 'c1',
    brand: 'visa',
    last4: '4383',
    holder: 'Jarrison Cano',
    expires: '06/27',
    default: true,
  },
  {
    id: 'c2',
    brand: 'mastercard',
    last4: '5964',
    holder: 'Jarrison Cano',
    expires: '11/26',
  },
];

export const mockDriver = {
  name: 'Brad Smith',
  rating: 5.0,
  car: 'Toyota Corolla · White',
  plate: 'LON 9921',
  etaMin: 4,
  photoUri: undefined as string | undefined,
};

export const mockUser = {
  name: 'Jarrison Cano',
  email: 'jarrison.personal@gmail.com',
  phone: '+57 300 000 0000',
  gender: 'male' as 'male' | 'female' | 'other',
  language: 'en' as 'en' | 'es',
  balance: 564.78,
  level: 'Basic Level',
  photoUri: undefined as string | undefined,
};
