import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabs } from './BottomTabs';
import { SearchDestinationScreen } from '../screens/ride/SearchDestinationScreen';
import { VehicleSelectScreen } from '../screens/ride/VehicleSelectScreen';
import { RideTrackingScreen } from '../screens/ride/RideTrackingScreen';
import { TripInProgressScreen } from '../screens/ride/TripInProgressScreen';
import { PaymentScreen } from '../screens/ride/PaymentScreen';
import { RatingScreen } from '../screens/ride/RatingScreen';
import { AddCardScreen } from '../screens/tabs/wallet/AddCardScreen';
import { TripDetailScreen } from '../screens/tabs/history/TripDetailScreen';
import { SettingsScreen } from '../screens/tabs/profile/SettingsScreen';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F6F8' } }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="SearchDestination" component={SearchDestinationScreen} />
      <Stack.Screen name="VehicleSelect" component={VehicleSelectScreen} />
      <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
      <Stack.Screen name="TripInProgress" component={TripInProgressScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="AddCard" component={AddCardScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
