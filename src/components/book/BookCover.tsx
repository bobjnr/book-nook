import { Image } from 'expo-image';
import { View } from 'react-native';

type BookCoverProps = {
  uri: string;
  width?: number;
  height?: number;
  rounded?: number;
};

export function BookCover({ uri, width = 116, height = 172, rounded = 14 }: BookCoverProps) {
  return (
    <View
      className="overflow-hidden bg-orange-50 shadow-sm"
      style={{ width, height, borderRadius: rounded }}
    >
      <Image
        accessibilityLabel="Book cover"
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={180}
        cachePolicy="memory-disk"
      />
    </View>
  );
}
