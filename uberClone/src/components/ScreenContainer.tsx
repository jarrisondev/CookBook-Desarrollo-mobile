import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  className?: string;
};

export function ScreenContainer({
  children,
  scroll = false,
  padded = true,
  className = '',
}: Props) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dark-bg" edges={['top', 'left', 'right']}>
      <Wrapper
        className={`flex-1 ${padded ? 'px-5' : ''} ${className}`}
        contentContainerClassName={scroll ? 'pb-8' : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}
