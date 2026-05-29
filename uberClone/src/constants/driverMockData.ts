export const mockDriverProfile = {
  fullName: 'Mahmud Hasan',
  email: 'mahmud.hasan@example.com',
  phone: '+57 311 555 1212',
  gender: 'male' as const,
  level: 'Pro Driver',
  rating: 4.9,
  totalRides: 1284,
  yearsActive: 3,
  balance: 564.78,
};

export const mockVehicle = {
  brand: 'Toyota',
  model: 'Corolla',
  color: 'White',
  plate: 'LON 9921',
  year: 2022,
  seats: 4,
  category: 'Economic',
};

export type DailyEarning = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  amount: number;
  rides: number;
};

export const weeklyEarnings: DailyEarning[] = [
  { day: 'Mon', amount: 56.4, rides: 8 },
  { day: 'Tue', amount: 41.2, rides: 6 },
  { day: 'Wed', amount: 72.5, rides: 11 },
  { day: 'Thu', amount: 38.8, rides: 5 },
  { day: 'Fri', amount: 124.6, rides: 17 },
  { day: 'Sat', amount: 89.3, rides: 13 },
  { day: 'Sun', amount: 62.0, rides: 9 },
];

export const driverStats = {
  acceptedPercent: 92,
  rating: 4.9,
  cancelledPercent: 3,
  activeRidesThisWeek: 60,
  activeRidesTarget: 70,
};

export type DriverTrip = {
  id: string;
  date: string;
  riderName: string;
  from: string;
  to: string;
  earnings: number;
  tip: number;
  rating: number;
  status: 'completed' | 'cancelled';
};

export const driverTripHistory: DriverTrip[] = [
  {
    id: 'd1',
    date: '2026-05-24T10:32:00Z',
    riderName: 'Jarrison Cano',
    from: 'St Paul Cathedral',
    to: 'Tower Bridge',
    earnings: 6.4,
    tip: 1.0,
    rating: 5,
    status: 'completed',
  },
  {
    id: 'd2',
    date: '2026-05-24T08:15:00Z',
    riderName: 'Sara Khan',
    from: 'Home',
    to: 'Office',
    earnings: 5.2,
    tip: 0,
    rating: 4,
    status: 'completed',
  },
  {
    id: 'd3',
    date: '2026-05-23T19:40:00Z',
    riderName: 'Liam Wright',
    from: 'Waterloo Station',
    to: 'Shoreditch',
    earnings: 11.3,
    tip: 2.0,
    rating: 5,
    status: 'completed',
  },
  {
    id: 'd4',
    date: '2026-05-23T11:20:00Z',
    riderName: 'Brad Smith',
    from: 'King’s Cross',
    to: 'Hyde Park',
    earnings: 14.8,
    tip: 0,
    rating: 5,
    status: 'cancelled',
  },
];

