import type { UserRole } from '../models';

export type DemoAccount = {
  role: UserRole;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
};

export const demoAccounts: Record<UserRole, DemoAccount> = {
  rider: {
    role: 'rider',
    email: 'rider@demo.com',
    password: 'demo1234',
    fullName: 'Jarrison Cano',
    phone: '+57 300 000 0000',
    gender: 'male',
  },
  driver: {
    role: 'driver',
    email: 'driver@demo.com',
    password: 'demo1234',
    fullName: 'Mahmud Hasan',
    phone: '+57 311 555 1212',
    gender: 'male',
  },
};

export const demoVehicle = {
  brand: 'Toyota',
  model: 'Corolla',
  color: 'White',
  plate: 'LON 9921',
  year: 2022,
  seats: 4,
  category: 'economic' as const,
};
