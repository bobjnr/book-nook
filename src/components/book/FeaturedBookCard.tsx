import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BookCover } from "@/components/book/BookCover";
import { Rating } from "@/components/book/Rating";
import { Price } from "@/components/Price";
import { typography } from "@/constants/typography";
import type { Book } from "@/types/book";

type FeaturedBookCardProps = {
  book: Book;
  onPress: (book: Book) => void;
};

function FeaturedBookCardComponent({ book, onPress }: FeaturedBookCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${book.title}`}
      onPress={() => onPress(book)}
      className="w-40"
    >
      <BookCover uri={book.cover} width={144} height={212} rounded={18} />
      <View className="mt-3 gap-1">
        <Text
          className="text-[15px] leading-5 text-slate-950"
          numberOfLines={2}
          style={[typography.title, styles.title]}
        >
          {book.title}
        </Text>
        <Text
          className="text-[11px] text-slate-500"
          numberOfLines={1}
          style={typography.label}
        >
          {book.author}
        </Text>
        <View className="mt-2 flex-row items-center justify-between">
          <Rating rating={book.rating} />
          <Price value={book.price} size="sm" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    minHeight: 40,
  },
});

export const FeaturedBookCard = memo(FeaturedBookCardComponent);
