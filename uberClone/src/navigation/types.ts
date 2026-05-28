export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  EnableLocation: undefined;
  Main: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  SearchDestination: undefined;
  VehicleSelect: { destination?: string } | undefined;
  RideTracking: undefined;
  TripInProgress: undefined;
  Payment: undefined;
  Rating: undefined;
  AddCard: undefined;
  TripDetail: { tripId: string };
  Settings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Wallet: undefined;
  History: undefined;
  Profile: undefined;
};

import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabScreenProps<T extends keyof BottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, T>,
  NativeStackScreenProps<MainStackParamList>
>;
