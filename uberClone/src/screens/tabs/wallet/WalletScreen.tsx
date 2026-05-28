import { Pressable, Text, View } from 'react-native';
import { CreditCard, Plus } from 'lucide-react-native';
import {
  Card,
  Divider,
  ListItem,
  ScreenContainer,
  SectionHeader,
} from '../../../components';
import { mockUser, paymentCards } from '../../../constants/mockData';
import { formatCurrency } from '../../../utils/format';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'Wallet'>;

export function WalletScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <View className="mt-4">
        <Text className="text-ink-900 text-2xl font-bold">Wallet</Text>
        <Text className="text-muted text-sm mt-1">Manage your balance and cards</Text>
      </View>

      <View className="mt-6">
        <Card>
          <Text className="text-muted text-sm">Available balance</Text>
          <Text className="text-ink-900 text-4xl font-bold mt-1">
            {formatCurrency(mockUser.balance)}
          </Text>
          <Divider className="my-4" />
          <View className="flex-row justify-between">
            <View>
              <Text className="text-muted text-xs">This month</Text>
              <Text className="text-ink-900 font-bold mt-0.5">{formatCurrency(124.5)}</Text>
            </View>
            <View>
              <Text className="text-muted text-xs">Trips</Text>
              <Text className="text-ink-900 font-bold mt-0.5">18</Text>
            </View>
            <View>
              <Text className="text-muted text-xs">Bonus</Text>
              <Text className="text-primary-600 font-bold mt-0.5">+{formatCurrency(12)}</Text>
            </View>
          </View>
        </Card>
      </View>

      <View className="mt-8">
        <SectionHeader title="Payment methods" actionLabel="See all" />
        {paymentCards.map((card) => (
          <View key={card.id} className="mb-2">
            <ListItem
              title={`${card.brand.toUpperCase()} •••• ${card.last4}`}
              subtitle={`Expires ${card.expires}${card.default ? ' · Default' : ''}`}
              leftIcon={<CreditCard size={18} color="#0F1115" />}
            />
          </View>
        ))}

        <Pressable
          onPress={() => navigation.navigate('AddCard')}
          className="flex-row items-center justify-center bg-primary-50 rounded-2xl px-4 py-3.5 mt-2"
        >
          <Plus size={18} color="#16A34A" />
          <Text className="text-primary-700 font-semibold ml-2">Add new card</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
