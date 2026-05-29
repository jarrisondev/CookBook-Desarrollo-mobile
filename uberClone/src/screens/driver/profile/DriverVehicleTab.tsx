import { ScrollView, Text, View } from 'react-native';
import { Car } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card, Divider } from '../../../components';
import { useAppSelector } from '../../../store';
import type { Vehicle } from '../../../models';

type VehicleRowKey =
  | 'vehicleBrand'
  | 'vehicleModel'
  | 'vehicleColor'
  | 'vehiclePlate'
  | 'vehicleYear'
  | 'vehicleSeats'
  | 'vehicleCategory';

function buildRows(vehicle: Vehicle): { key: VehicleRowKey; value: string }[] {
  return [
    { key: 'vehicleBrand', value: vehicle.brand },
    { key: 'vehicleModel', value: vehicle.model },
    { key: 'vehicleColor', value: vehicle.color },
    { key: 'vehiclePlate', value: vehicle.plate },
    { key: 'vehicleYear', value: String(vehicle.year) },
    { key: 'vehicleSeats', value: String(vehicle.seats) },
    { key: 'vehicleCategory', value: vehicle.category },
  ];
}

export function DriverVehicleTab() {
  const { t } = useTranslation();
  const vehicle = useAppSelector((s) => s.auth.user?.vehicle);

  return (
    <ScrollView
      className="flex-1 bg-bg dark:bg-dark-bg"
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-6">
        <View className="w-24 h-24 rounded-full bg-primary-100 items-center justify-center">
          <Car size={44} color="#16A34A" />
        </View>
        {vehicle ? (
          <>
            <Text className="text-ink-900 dark:text-white font-bold text-lg mt-3">
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text className="text-muted dark:text-ink-400 text-sm">{vehicle.plate}</Text>
          </>
        ) : (
          <Text className="text-muted dark:text-ink-400 text-sm mt-3 text-center">
            {t('driver.profile.noVehicle')}
          </Text>
        )}
      </View>

      {vehicle ? (
        <Card>
          {buildRows(vehicle).map((row, i, all) => (
            <View key={row.key}>
              <View className="flex-row justify-between py-3">
                <Text className="text-muted dark:text-ink-400">
                  {t(`driver.profile.${row.key}`)}
                </Text>
                <Text className="text-ink-900 dark:text-white font-semibold">
                  {row.value}
                </Text>
              </View>
              {i < all.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </Card>
      ) : null}
    </ScrollView>
  );
}
