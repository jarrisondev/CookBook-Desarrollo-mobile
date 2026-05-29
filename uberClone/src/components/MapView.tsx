import { useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import RNMapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import type {
  MapViewProps as RNMapViewProps,
  Region,
} from 'react-native-maps';
import { Locate } from 'lucide-react-native';
import { shadows } from '../theme';
import type { Coordinates } from '../hooks/useLocation';

export type MapMarker = {
  id: string;
  coordinate: Coordinates;
  title?: string;
  description?: string;
  pinColor?: string;
};

type Props = {
  initialCoordinates: Coordinates;
  zoom?: number;
  markers?: MapMarker[];
  routePolyline?: Coordinates[];
  showUserLocation?: boolean;
  showMyLocationButton?: boolean;
  myLocation?: Coordinates;
  className?: string;
} & Pick<RNMapViewProps, 'onMapReady' | 'onRegionChangeComplete'>;

function coordsToRegion(coord: Coordinates, zoom = 0.02): Region {
  return {
    latitude: coord.latitude,
    longitude: coord.longitude,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
  };
}

function isSameCoord(a?: Coordinates, b?: Coordinates) {
  if (!a || !b) return false;
  return (
    Math.abs(a.latitude - b.latitude) < 1e-6 &&
    Math.abs(a.longitude - b.longitude) < 1e-6
  );
}

export function MapView({
  initialCoordinates,
  zoom,
  markers,
  routePolyline,
  showUserLocation = true,
  showMyLocationButton = true,
  myLocation,
  onMapReady,
  onRegionChangeComplete,
}: Props) {
  const mapRef = useRef<RNMapView | null>(null);
  const lastFollowedCoord = useRef<Coordinates | null>(null);

  // When the real user location arrives (first time), animate the map to it.
  useEffect(() => {
    if (!myLocation) return;
    if (isSameCoord(lastFollowedCoord.current ?? undefined, myLocation)) return;
    lastFollowedCoord.current = myLocation;
    mapRef.current?.animateToRegion(coordsToRegion(myLocation, zoom), 500);
  }, [myLocation, zoom]);

  const centerOnUser = () => {
    if (!myLocation) return;
    mapRef.current?.animateToRegion(coordsToRegion(myLocation, zoom), 400);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <RNMapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFill}
        initialRegion={coordsToRegion(initialCoordinates, zoom)}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        onMapReady={onMapReady}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {markers?.map((m) => (
          <Marker
            key={m.id}
            coordinate={m.coordinate}
            title={m.title}
            description={m.description}
            pinColor={m.pinColor ?? '#22C55E'}
          />
        ))}
        {routePolyline && routePolyline.length > 1 ? (
          <Polyline
            coordinates={routePolyline}
            strokeColor="#22C55E"
            strokeWidth={5}
          />
        ) : null}
      </RNMapView>

      {showMyLocationButton && myLocation ? (
        <Pressable
          onPress={centerOnUser}
          className="absolute right-5 bottom-6 w-12 h-12 rounded-full bg-surface dark:bg-dark-surface items-center justify-center"
          style={shadows.card}
        >
          <Locate size={22} color="#16A34A" />
        </Pressable>
      ) : null}
    </View>
  );
}
