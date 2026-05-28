import { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLanguageSync } from '../i18n/useLanguageSync';
import { useThemeSync } from '../hooks/useThemeSync';
import { useIsDark } from '../hooks/useIsDark';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { EnableLocationScreen } from '../screens/auth/EnableLocationScreen';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  useLanguageSync();
  useThemeSync();
  const isDark = useIsDark();

  const navTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme : DefaultTheme).colors,
        background: isDark ? '#0F1115' : '#F5F6F8',
        card: isDark ? '#1F2937' : '#FFFFFF',
        text: isDark ? '#FFFFFF' : '#0F1115',
        border: isDark ? '#374151' : '#E5E7EB',
        primary: '#22C55E',
      },
    }),
    [isDark],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0F1115' : '#F5F6F8'}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? '#0F1115' : '#F5F6F8' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="EnableLocation" component={EnableLocationScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
