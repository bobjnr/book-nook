import { Minus, Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type QuantityStepperProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function QuantityStepper({ quantity, onIncrease, onDecrease }: QuantityStepperProps) {
  return (
    <View className="h-10 flex-row items-center rounded-xl border border-slate-200 bg-white">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        className="h-10 w-10 items-center justify-center"
        onPress={onDecrease}
      >
        <Minus color="#0F172A" size={15} />
      </Pressable>
      <Text className="min-w-7 text-center text-sm font-extrabold text-slate-950">{quantity}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        className="h-10 w-10 items-center justify-center"
        onPress={onIncrease}
      >
        <Plus color="#0F172A" size={15} />
      </Pressable>
    </View>
  );
}
