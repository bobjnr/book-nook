import { Plus } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BookCover } from '@/components/book/BookCover';
import { Rating } from '@/components/book/Rating';
import { Price } from '@/components/Price';
import type { Book } from '@/types/book';

type BookCardProps = {
  book: Book;
  onPress: (book: Book) => void;
  onAdd: (book: Book) => void;
};

function BookCardComponent({ book, onPress, onAdd }: BookCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${book.title}`}
      onPress={() => onPress(book)}
      className="mb-6 flex-1 rounded-3xl bg-white"
    >
      <BookCover uri={book.cover} width={150} height={220} rounded={18} />
      <View className="mt-3 gap-1 pr-2">
        <Text className="text-base font-extrabold text-slate-950" numberOfLines={2}>
          {book.title}
        </Text>
        <Text className="text-xs font-semibold text-slate-500" numberOfLines={1}>
          {book.author}
        </Text>
        <View className="mt-1 flex-row items-center justify-between">
          <View className="gap-1">
            <Price value={book.price} size="sm" />
            <Rating rating={book.rating} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${book.title} to cart`}
            onPress={(event) => {
              event.stopPropagation();
              onAdd(book);
            }}
            className="h-10 w-10 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50"
          >
            <Plus color="#F97316" size={18} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export const BookCard = memo(BookCardComponent);
