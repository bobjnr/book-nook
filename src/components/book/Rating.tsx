import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';

type RatingProps = {
  rating: number;
  reviews?: number;
};

export function Rating({ rating, reviews }: RatingProps) {
  return (
    <View className="flex-row items-center gap-1">
      <Star color="#F59E0B" fill="#F59E0B" size={14} />
      <Text className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</Text>
      {reviews ? (
        <Text className="text-xs font-medium text-slate-500">
          ({reviews.toLocaleString()} reviews)
        </Text>
      ) : null}
    </View>
  );
}
