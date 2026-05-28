import { Text, View } from 'react-native';
import {
  Bell,
  ChevronLeft,
  CircleHelp,
  FileText,
  LogOut,
  Shield,
  Trash2,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Divider,
  IconButton,
  ListItem,
  ScreenContainer,
} from '../../../components';
import type { MainStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center mt-2">
        <IconButton
          icon={<ChevronLeft size={22} color="#0F1115" />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
        <Text className="text-ink-900 text-xl font-bold ml-2">Settings</Text>
      </View>

      <View className="mt-6 gap-2">
        <ListItem
          title="Notifications"
          subtitle="Push, email, and SMS"
          leftIcon={<Bell size={18} color="#0F1115" />}
          onPress={() => undefined}
        />
        <ListItem
          title="Privacy"
          subtitle="Manage data and visibility"
          leftIcon={<Shield size={18} color="#0F1115" />}
          onPress={() => undefined}
        />
        <ListItem
          title="Help center"
          subtitle="FAQs and support"
          leftIcon={<CircleHelp size={18} color="#0F1115" />}
          onPress={() => undefined}
        />
        <ListItem
          title="Terms & policies"
          subtitle="Read the legal docs"
          leftIcon={<FileText size={18} color="#0F1115" />}
          onPress={() => undefined}
        />
      </View>

      <Divider className="my-6" />

      <View className="gap-2">
        <ListItem
          title="Delete account"
          subtitle="Permanently remove your data"
          leftIcon={<Trash2 size={18} color="#EF4444" />}
          onPress={() => undefined}
        />
      </View>

      <View className="mt-8">
        <Button
          label="Log out"
          variant="secondary"
          leftIcon={<LogOut size={18} color="#0F1115" />}
          onPress={() => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' as never }] })}
        />
      </View>
    </ScreenContainer>
  );
}
