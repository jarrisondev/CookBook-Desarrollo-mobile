import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DriverBottomTabs } from './DriverBottomTabs';
import { IncomingRideScreen } from '../screens/driver/ride/IncomingRideScreen';
import { DriverPickupScreen } from '../screens/driver/ride/DriverPickupScreen';
import { DriverWaitingScreen } from '../screens/driver/ride/DriverWaitingScreen';
import { DriverInProgressScreen } from '../screens/driver/ride/DriverInProgressScreen';
import { DriverCompletedScreen } from '../screens/driver/ride/DriverCompletedScreen';
import { DriverSettingsScreen } from '../screens/driver/profile/DriverSettingsScreen';
import type { DriverStackParamList } from './types';

const Stack = createNativeStackNavigator<DriverStackParamList>();

export function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverBottomTabs} />
      <Stack.Screen
        name="IncomingRide"
        component={IncomingRideScreen}
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen name="DriverPickup" component={DriverPickupScreen} />
      <Stack.Screen name="DriverWaiting" component={DriverWaitingScreen} />
      <Stack.Screen name="DriverInProgress" component={DriverInProgressScreen} />
      <Stack.Screen name="DriverCompleted" component={DriverCompletedScreen} />
      <Stack.Screen name="DriverSettings" component={DriverSettingsScreen} />
    </Stack.Navigator>
  );
}
