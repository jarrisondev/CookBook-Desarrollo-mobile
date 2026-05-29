import { Alert, Pressable, Text, View } from 'react-native';
import { CreditCard, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Divider,
  ListItem,
  ScreenContainer,
  SectionHeader,
} from '../../../components';
import { useIconColor } from '../../../hooks/useIconColor';
import { useUserCards } from '../../../hooks/useUserCards';
import { useAppSelector } from '../../../store';
import {
  deleteCard,
  setDefaultCard,
} from '../../../services/firebase/cards';
import type { StoredCard } from '../../../services/firebase/cards';
import { formatCurrency } from '../../../utils/format';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'Wallet'>;

export function WalletScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const user = useAppSelector((s) => s.auth.user);
  const { cards } = useUserCards();

  const openActions = (card: StoredCard) => {
    if (!user) return;
    const actions: Parameters<typeof Alert.alert>[2] = [
      { text: t('common.cancel'), style: 'cancel' },
    ];
    if (!card.default) {
      actions.push({
        text: t('wallet.makeDefault'),
        onPress: async () => {
          try {
            await setDefaultCard(user.uid, card.id);
          } catch {
            Alert.alert(t('wallet.title'), t('wallet.actionFailed'));
          }
        },
      });
    }
    actions.push({
      text: t('wallet.removeCard'),
      style: 'destructive',
      onPress: () => {
        Alert.alert(
          t('wallet.removeCard'),
          t('wallet.removeConfirm', { last4: card.last4 }),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('common.delete'),
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteCard(user.uid, card.id);
                } catch {
                  Alert.alert(t('wallet.title'), t('wallet.actionFailed'));
                }
              },
            },
          ],
        );
      },
    });
    Alert.alert(
      t('wallet.cardActions', { last4: card.last4 }),
      undefined,
      actions,
    );
  };

  return (
    <ScreenContainer scroll>
      <View className="mt-4">
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('wallet.title')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm mt-1">
          {t('wallet.subtitle')}
        </Text>
      </View>

      <View className="mt-6">
        <Card>
          <Text className="text-muted dark:text-ink-400 text-sm">
            {t('wallet.availableBalance')}
          </Text>
          <Text className="text-ink-900 dark:text-white text-4xl font-bold mt-1">
            {formatCurrency(user?.balance ?? 0)}
          </Text>
          <Divider className="my-4" />
          <View className="flex-row justify-between">
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('wallet.thisMonth')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
                {formatCurrency(124.5)}
              </Text>
            </View>
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('wallet.trips')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">18</Text>
            </View>
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('wallet.bonus')}
              </Text>
              <Text className="text-primary-600 font-bold mt-0.5">
                +{formatCurrency(12)}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View className="mt-8">
        <SectionHeader title={t('wallet.paymentMethods')} />
        {cards.length === 0 ? (
          <View className="items-center bg-surface dark:bg-dark-surface rounded-2xl px-4 py-8 mb-2">
            <Text className="text-muted dark:text-ink-400 text-sm text-center">
              {t('wallet.noCards')}
            </Text>
          </View>
        ) : (
          cards.map((card) => (
            <View key={card.id} className="mb-2">
              <ListItem
                title={`${card.brand.toUpperCase()} •••• ${card.last4}`}
                subtitle={`${t('payment.expires', { date: card.expires })}${
                  card.default ? ` · ${t('wallet.default')}` : ''
                }`}
                leftIcon={<CreditCard size={18} color={iconColor.primary} />}
                onPress={() => openActions(card)}
              />
            </View>
          ))
        )}

        <Pressable
          onPress={() => navigation.navigate('AddCard')}
          className="flex-row items-center justify-center bg-primary-50 rounded-2xl px-4 py-3.5 mt-2"
        >
          <Plus size={18} color="#16A34A" />
          <Text className="text-primary-700 font-semibold ml-2">
            {t('wallet.addNewCard')}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
