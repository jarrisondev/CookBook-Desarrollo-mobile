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
