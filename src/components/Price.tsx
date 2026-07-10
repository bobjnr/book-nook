import { Text, View } from 'react-native';

import { formatCurrency } from '@/utils/currency';

type PriceProps = {
  value: number;
  originalValue?: number;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClassName = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function Price({ value, originalValue, size = 'md' }: PriceProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Text
        testID="price-value"
        className={`${sizeClassName[size]} font-extrabold text-slate-950`}
      >
        {formatCurrency(value)}
      </Text>
      {originalValue ? (
        <Text className="text-xs font-semibold text-slate-400 line-through">
          {formatCurrency(originalValue)}
        </Text>
      ) : null}
    </View>
  );
}
