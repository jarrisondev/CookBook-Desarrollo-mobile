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
import { Car, Locate, Maximize2 } from 'lucide-react-native';
import { shadows } from '../theme';
import type { Coordinates } from '../hooks/useLocation';

export type MapMarker = {
  id: string;
  coordinate: Coordinates;
  title?: string;
  description?: string;
  pinColor?: string;
  /**
   * Visual style for the marker. `'car'` renders a circular badge with a
   * car icon (used to show the driver's live position). Default is the
   * platform pin.
   */
  kind?: 'pin' | 'car';
};

type EdgePadding = { top: number; right: number; bottom: number; left: number };

type Props = {
  initialCoordinates: Coordinates;
  zoom?: number;
  markers?: MapMarker[];
  routePolyline?: Coordinates[];
  showUserLocation?: boolean;
  showMyLocationButton?: boolean;
  myLocation?: Coordinates;
  /**
   * If provided, the camera animates to fit these coordinates (with
   * padding) whenever the list changes. Use this to keep both the
   * pickup and the dropoff visible while the route loads.
   */
  fitTo?: Coordinates[];
  /**
   * Overrides the camera padding used both for `fitToCoordinates` and
   * for the underlying `mapPadding` (which shifts the logical center,
   * the "my location" dot, and Google's attribution). Use this when a
   * bottom sheet is covering part of the map so the route stays
   * centered in the visible area.
   */
  edgePadding?: EdgePadding;
  className?: string;
} & Pick<RNMapViewProps, 'onMapReady' | 'onRegionChangeComplete'>;

const DEFAULT_EDGE_PADDING: EdgePadding = {
  top: 140,
  right: 60,
  bottom: 320,
  left: 60,
};

const carMarkerStyles = StyleSheet.create({
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F1115',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});

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

function coordsKey(coords?: Coordinates[]) {
  return (coords ?? [])
    .map((c) => `${c.latitude.toFixed(5)},${c.longitude.toFixed(5)}`)
    .join('|');
}

export function MapView({
  initialCoordinates,
  zoom,
  markers,
  routePolyline,
  showUserLocation = true,
  showMyLocationButton = true,
  myLocation,
  fitTo,
  edgePadding,
  onMapReady,
  onRegionChangeComplete,
}: Props) {
  const padding = edgePadding ?? DEFAULT_EDGE_PADDING;
  const mapRef = useRef<RNMapView | null>(null);
  const lastFollowedCoord = useRef<Coordinates | null>(null);
  const lastFitKey = useRef<string>('');
  const fitKey = coordsKey(fitTo);

  // When the real user location arrives (first time), animate the map to it.
  useEffect(() => {
    if (!myLocation) return;
    if (fitTo && fitTo.length >= 2) return; // fitTo wins over my-location auto-follow
    if (isSameCoord(lastFollowedCoord.current ?? undefined, myLocation)) return;
    lastFollowedCoord.current = myLocation;
    mapRef.current?.animateToRegion(coordsToRegion(myLocation, zoom), 500);
  }, [myLocation, zoom, fitTo]);

  // Fit to a set of coordinates (pickup + dropoff + polyline) so the whole
  // route is visible.
  useEffect(() => {
    if (!fitTo || fitTo.length < 2) return;
    if (fitKey === lastFitKey.current) return;
    lastFitKey.current = fitKey;
    // Wait a tick so the map has its size before fitting.
    const t = setTimeout(() => {
      mapRef.current?.fitToCoordinates(fitTo, {
        edgePadding: padding,
        animated: true,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [fitKey, fitTo, padding]);

  const centerOnUser = () => {
    if (!myLocation) return;
    mapRef.current?.animateToRegion(coordsToRegion(myLocation, zoom), 400);
  };

  const fitToRoute = () => {
    if (!fitTo || fitTo.length < 2) return;
    mapRef.current?.fitToCoordinates(fitTo, {
      edgePadding: padding,
      animated: true,
    });
  };

  const canFit = !!fitTo && fitTo.length >= 2;

  return (
    <View style={StyleSheet.absoluteFill}>
      <RNMapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFill}
        initialRegion={coordsToRegion(initialCoordinates, zoom)}
        mapPadding={padding}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        onMapReady={onMapReady}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {markers?.map((m) =>
          m.kind === 'car' ? (
            <Marker
              key={m.id}
              coordinate={m.coordinate}
              title={m.title}
              description={m.description}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={carMarkerStyles.bubble}>
                <Car size={20} color="#FFFFFF" strokeWidth={2.4} />
              </View>
            </Marker>
          ) : (
            <Marker
              key={m.id}
              coordinate={m.coordinate}
              title={m.title}
              description={m.description}
              pinColor={m.pinColor ?? '#22C55E'}
            />
          ),
        )}
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
          className="absolute right-5 w-12 h-12 rounded-full bg-surface dark:bg-dark-surface items-center justify-center"
          style={[shadows.card, { top: 100 }]}
        >
          <Locate size={22} color="#16A34A" />
        </Pressable>
      ) : null}

      {canFit ? (
        <Pressable
          onPress={fitToRoute}
          className="absolute right-5 w-12 h-12 rounded-full bg-surface dark:bg-dark-surface items-center justify-center"
          style={[shadows.card, { top: showMyLocationButton && myLocation ? 160 : 100 }]}
        >
          <Maximize2 size={20} color="#16A34A" />
        </Pressable>
      ) : null}
    </View>
  );
}
