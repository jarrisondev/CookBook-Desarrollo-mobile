export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  EnableLocation: undefined;
  Main: undefined;
  Driver: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  SearchDestination: undefined;
  VehicleSelect: { destination?: string } | undefined;
  SearchingDriver: undefined;
  RideTracking: undefined;
  DriverArrived: undefined;
  TripInProgress: undefined;
  Payment: undefined;
  Rating: undefined;
  AddCard: undefined;
  TripDetail: { tripId: string };
  Settings: undefined;
};

export type DriverStackParamList = {
  DriverTabs: undefined;
  IncomingRide: undefined;
  DriverPickup: undefined;
  DriverWaiting: undefined;
  DriverInProgress: undefined;
  DriverCompleted: undefined;
  DriverStats: undefined;
  DriverSettings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Wallet: undefined;
  History: undefined;
  Profile: undefined;
};

export type DriverTabParamList = {
  DriverHome: undefined;
  Earnings: undefined;
  DriverHistory: undefined;
  DriverProfile: undefined;
};

import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabScreenProps<T extends keyof BottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, T>,
  NativeStackScreenProps<MainStackParamList>
>;

export type DriverTabScreenProps<T extends keyof DriverTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DriverTabParamList, T>,
  NativeStackScreenProps<DriverStackParamList>
>;
