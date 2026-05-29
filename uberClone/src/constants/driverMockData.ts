export type DailyEarning = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  amount: number;
  rides: number;
};

export const weeklyEarnings: DailyEarning[] = [
  { day: 'Mon', amount: 168000, rides: 8 },
  { day: 'Tue', amount: 124000, rides: 6 },
  { day: 'Wed', amount: 218000, rides: 11 },
  { day: 'Thu', amount: 116000, rides: 5 },
  { day: 'Fri', amount: 374000, rides: 17 },
  { day: 'Sat', amount: 268000, rides: 13 },
  { day: 'Sun', amount: 186000, rides: 9 },
];

export const driverStats = {
  acceptedPercent: 92,
  rating: 4.9,
  cancelledPercent: 3,
  activeRidesThisWeek: 60,
  activeRidesTarget: 70,
};
