/* eslint-disable react-hooks/immutability */
import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Share2, ShoppingBag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { BookCover } from '@/components/book/BookCover';
import { Rating } from '@/components/book/Rating';
import { Price } from '@/components/Price';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuantityStepper } from '@/components/QuantityStepper';
import { Screen } from '@/components/Screen';
import { fetchBookById } from '@/services/books';
import { useCartStore } from '@/store/cart-store';
import type { Book } from '@/types/book';

type LoadStatus = 'loading' | 'success' | 'error';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addBook = useCartStore((state) => state.addBook);
  const itemCount = useCartStore((state) => state.getItemCount());
  const flyingOpacity = useSharedValue(0);
  const flyingX = useSharedValue(0);
  const flyingY = useSharedValue(0);
  const flyingScale = useSharedValue(1);

  useEffect(() => {
    let isActive = true;

    async function loadBook() {
      if (!id) {
        return;
      }

      setStatus('loading');
      setError('');

      try {
        const selectedBook = await fetchBookById(id);

        if (isActive) {
          setBook(selectedBook);
          setStatus('success');
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'We could not load this book right now.',
          );
          setStatus('error');
        }
      }
    }

    loadBook();

    return () => {
      isActive = false;
    };
  }, [id]);

  const flyingStyle = useAnimatedStyle(() => ({
    opacity: flyingOpacity.value,
    transform: [
      { translateX: flyingX.value },
      { translateY: flyingY.value },
      { scale: flyingScale.value },
    ],
  }));

  function resetFlyingCover() {
    flyingX.value = 0;
    flyingY.value = 0;
    flyingScale.value = 1;
  }

  function handleAddToCart() {
    if (!book) {
      return;
    }

    for (let index = 0; index < quantity; index += 1) {
      addBook(book);
    }

    flyingOpacity.value = 1;
    flyingX.value = 0;
    flyingY.value = 0;
    flyingScale.value = 1;
    flyingX.value = withTiming(118, { duration: 520 });
    flyingY.value = withTiming(-310, { duration: 520 });
    flyingScale.value = withTiming(0.22, { duration: 520 });
    flyingOpacity.value = withDelay(
      360,
      withTiming(0, { duration: 180 }, () => {
        runOnJS(resetFlyingCover)();
      }),
    );
  }

  return (
    <Screen>
      <View className="mb-3 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
        >
          <ArrowLeft color="#0F172A" size={21} />
        </Pressable>
        <View className="flex-row items-center gap-3">
          <Share2 color="#0F172A" size={20} />
          <Heart color="#0F172A" size={20} />
          <Link href="/cart" asChild>
            <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
              <ShoppingBag color="#F97316" size={20} />
              {itemCount > 0 ? (
                <View className="absolute -right-1 -top-1 min-w-5 items-center rounded-full bg-orange-500 px-1">
                  <Text className="text-[10px] font-extrabold text-white">{itemCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </Link>
        </View>
      </View>

      {status === 'loading' ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color="#F97316" size="large" />
          <Text className="font-semibold text-slate-500">Loading book details...</Text>
        </View>
      ) : null}

      {status === 'error' ? (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-lg font-extrabold text-slate-950">Something went wrong</Text>
          <Text className="text-center font-semibold text-slate-500">{error}</Text>
          <PrimaryButton onPress={() => router.replace(`/book/${id}`)}>Try Again</PrimaryButton>
        </View>
      ) : null}

      {status === 'success' && book ? (
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 116 }}>
            <View className="items-center pt-3">
              <BookCover uri={book.cover} width={204} height={318} rounded={20} />
              <Animated.View
                pointerEvents="none"
                style={[
                  {
                    position: 'absolute',
                    top: 54,
                    width: 96,
                    height: 144,
                    borderRadius: 14,
                    overflow: 'hidden',
                  },
                  flyingStyle,
                ]}
              >
                <Image source={{ uri: book.cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              </Animated.View>
            </View>

            <View className="mt-7 gap-4">
              <View>
                <Text className="text-3xl font-black text-slate-950">{book.title}</Text>
                <Text className="mt-1 text-base font-semibold text-slate-500">{book.author}</Text>
              </View>

              <Rating rating={book.rating} reviews={book.reviews} />

              <View className="flex-row items-center gap-3">
                <Price value={book.price} originalValue={book.price + 4} size="lg" />
                <View className="rounded-lg bg-green-100 px-3 py-1">
                  <Text className="text-xs font-extrabold text-green-700">27% OFF</Text>
                </View>
              </View>

              <Text className="text-base font-medium leading-7 text-slate-600">{book.description}</Text>

              <View className="flex-row justify-between rounded-3xl bg-slate-50 px-5 py-4">
                <View className="items-center">
                  <Text className="text-sm font-extrabold text-slate-950">Paperback</Text>
                  <Text className="text-xs font-semibold text-slate-500">Format</Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm font-extrabold text-slate-950">208</Text>
                  <Text className="text-xs font-semibold text-slate-500">Pages</Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm font-extrabold text-slate-950">English</Text>
                  <Text className="text-xs font-semibold text-slate-500">Language</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-slate-100 bg-white pb-5 pt-4">
            <QuantityStepper
              quantity={quantity}
              onIncrease={() => setQuantity((value) => value + 1)}
              onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
            />
            <View className="flex-1">
              <PrimaryButton testID="add-to-cart-button" onPress={handleAddToCart}>
                Add to Cart
              </PrimaryButton>
            </View>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
