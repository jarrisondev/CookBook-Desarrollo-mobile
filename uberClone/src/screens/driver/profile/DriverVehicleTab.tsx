import { ScrollView, Text, View } from 'react-native';
import { Car } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card, Divider } from '../../../components';
import { mockVehicle } from '../../../constants/driverMockData';

export function DriverVehicleTab() {
  const { t } = useTranslation();

  const rows = [
    { key: 'vehicleBrand' as const, value: mockVehicle.brand },
    { key: 'vehicleModel' as const, value: mockVehicle.model },
    { key: 'vehicleColor' as const, value: mockVehicle.color },
    { key: 'vehiclePlate' as const, value: mockVehicle.plate },
    { key: 'vehicleYear' as const, value: String(mockVehicle.year) },
    { key: 'vehicleSeats' as const, value: String(mockVehicle.seats) },
    { key: 'vehicleCategory' as const, value: mockVehicle.category },
  ];

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
        <Text className="text-ink-900 dark:text-white font-bold text-lg mt-3">
          {mockVehicle.brand} {mockVehicle.model}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm">{mockVehicle.plate}</Text>
      </View>

      <Card>
        {rows.map((row, i) => (
          <View key={row.key}>
            <View className="flex-row justify-between py-3">
              <Text className="text-muted dark:text-ink-400">
                {t(`driver.profile.${row.key}`)}
              </Text>
              <Text className="text-ink-900 dark:text-white font-semibold">
                {row.value}
              </Text>
            </View>
            {i < rows.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}
