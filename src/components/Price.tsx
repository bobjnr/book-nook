import { StyleSheet, Text, View } from 'react-native';

import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/currency';

type PriceProps = {
  value: number;
  originalValue?: number;
  size?: 'sm' | 'md' | 'lg';
};

type StampSize = {
  outer: number;
  inner: number;
  mainText: number;
  centsText: number;
  lineWidth: number;
};

const stampSizes: Record<NonNullable<PriceProps['size']>, StampSize> = {
  sm: {
    outer: 48,
    inner: 40,
    mainText: 12,
    centsText: 8,
    lineWidth: 18,
  },
  md: {
    outer: 56,
    inner: 47,
    mainText: 14,
    centsText: 9,
    lineWidth: 22,
  },
  lg: {
    outer: 72,
    inner: 62,
    mainText: 19,
    centsText: 10,
    lineWidth: 28,
  },
};

function getPriceParts(value: number) {
  const totalCents = Math.round(value * 100);
  const dollars = Math.floor(totalCents / 100);
  const cents = String(Math.abs(totalCents % 100)).padStart(2, '0');

  return {
    dollars: `$${dollars}`,
    cents: `.${cents}`,
    label: formatCurrency(value),
  };
}

export function Price({ value, originalValue, size = 'md' }: PriceProps) {
  const stamp = stampSizes[size];
  const price = getPriceParts(value);

  return (
    <View className="flex-row items-center gap-2">
      <View
        className="items-center justify-center rounded-full bg-orange-50"
        style={[
          styles.outerStamp,
          {
            width: stamp.outer,
            height: stamp.outer,
            borderRadius: stamp.outer / 2,
          },
        ]}
      >
        <View
          className="items-center justify-center rounded-full"
          style={[
            styles.innerStamp,
            {
              width: stamp.inner,
              height: stamp.inner,
              borderRadius: stamp.inner / 2,
            },
          ]}
        >
          <Text
            accessibilityLabel={price.label}
            testID="price-value"
            className="text-center text-orange-800"
            style={[typography.labelBold, { fontSize: stamp.mainText, lineHeight: stamp.mainText + 2 }]}
          >
            {price.dollars}
          </Text>
          <View className="my-0.5 bg-orange-800" style={{ height: 1, width: stamp.lineWidth }} />
          <Text
            className="text-center text-orange-800"
            style={[typography.labelBold, { fontSize: stamp.centsText, lineHeight: stamp.centsText + 1 }]}
          >
            {price.cents}
          </Text>
        </View>
      </View>
      {originalValue ? (
        <Text className="text-xs text-slate-400 line-through" style={typography.label}>
          {formatCurrency(originalValue)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outerStamp: {
    borderWidth: 1,
    borderColor: '#9A3412',
  },
  innerStamp: {
    borderWidth: 1,
    borderColor: '#9A3412',
  },
});