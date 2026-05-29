import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type LocationStatus = 'loading' | 'granted' | 'denied' | 'unavailable';

const DEFAULT_LOCATION: Coordinates = {
  // Medellín plaza Botero as a friendly fallback
  latitude: 6.2476,
  longitude: -75.5658,
};

async function requestAndroidPermission(): Promise<boolean> {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permiso de ubicación',
        message: 'Necesitamos tu ubicación para mostrar el mapa y ofrecer viajes cercanos.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancelar',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

/**
 * Returns the user's current coordinates (one-shot) plus a permission status.
 * Falls back to a default location if permission is denied so the UI never
 * stays empty during a demo.
 */
export function useLocation() {
  const [coords, setCoords] = useState<Coordinates>(DEFAULT_LOCATION);
  const [status, setStatus] = useState<LocationStatus>('loading');
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    (async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await requestAndroidPermission();
          if (!granted) {
            setStatus('denied');
            return;
          }
        } else {
          Geolocation.requestAuthorization();
        }

        Geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setStatus('granted');
          },
          () => {
            setStatus('unavailable');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } catch {
        setStatus('unavailable');
      }
    })();
  }, []);

  return { coords, status, isGranted: status === 'granted' };
}
