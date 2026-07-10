import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { Bell, BookOpen, Heart, Menu, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { BookCard } from '@/components/book/BookCard';
import { Screen } from '@/components/Screen';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { fetchBooks } from '@/services/books';
import { useCartStore } from '@/store/cart-store';
import type { Book } from '@/types/book';

const PAGE_SIZE = 8;
const categories = [
  { label: 'Fiction', icon: BookOpen },
  { label: 'Non-Fiction', icon: Menu },
  { label: 'Mystery', icon: Search },
  { label: 'Romance', icon: Heart },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const addBook = useCartStore((state) => state.addBook);
  const itemCount = useCartStore((state) => state.getItemCount());

  const booksQuery = useInfiniteQuery({
    queryKey: ['books', debouncedSearch],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchBooks({ page: pageParam, limit: PAGE_SIZE, search: debouncedSearch }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });

  const catalogBooks = useMemo(
    () => booksQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [booksQuery.data],
  );

  const featuredBooks = catalogBooks.slice(0, 3);

  const openBook = useCallback((book: Book) => {
    router.push(`/book/${book.id}`);
  }, []);

  const renderBook = useCallback(
    ({ item }: { item: Book }) => <BookCard book={item} onPress={openBook} onAdd={addBook} />,
    [addBook, openBook],
  );

  return (
    <Screen padded={false}>
      <View className="flex-1">
        <FlashList
          data={catalogBooks}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 112 }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (booksQuery.hasNextPage && !booksQuery.isFetchingNextPage) {
              booksQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.35}
          ListHeaderComponent={
            <View className="pb-5 pt-2">
              <View className="mb-7 flex-row items-center justify-between">
                <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">
                  <Menu color="#0F172A" size={21} />
                </Pressable>
                <Link href="/cart" asChild>
                  <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">
                    <ShoppingBag color="#0F172A" size={20} />
                    {itemCount > 0 ? (
                      <View className="absolute -right-1 -top-1 min-w-5 items-center rounded-full bg-orange-500 px-1">
                        <Text className="text-[10px] font-extrabold text-white">{itemCount}</Text>
                      </View>
                    ) : null}
                  </Pressable>
                </Link>
              </View>

              <View className="mb-5 flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold text-slate-500">Hello, Reader</Text>
                  <Text className="text-3xl font-black text-slate-950">Book Nook</Text>
                </View>
                <Bell color="#0F172A" size={21} />
              </View>

              <View className="mb-6 h-14 flex-row items-center gap-3 rounded-2xl bg-slate-50 px-4">
                <Search color="#64748B" size={18} />
                <TextInput
                  accessibilityLabel="Search books"
                  className="flex-1 text-sm font-semibold text-slate-950"
                  placeholder="Search books, authors, genres..."
                  placeholderTextColor="#94A3B8"
                  value={search}
                  onChangeText={setSearch}
                />
                <SlidersHorizontal color="#0F172A" size={18} />
              </View>

              <View className="mb-7">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-extrabold text-slate-950">Categories</Text>
                  <Text className="text-xs font-bold text-orange-500">See all</Text>
                </View>
                <View className="flex-row justify-between gap-3">
                  {categories.map(({ label, icon: Icon }) => (
                    <View key={label} className="flex-1 items-center gap-2">
                      <View className="h-14 w-full items-center justify-center rounded-2xl bg-orange-50">
                        <Icon color="#F97316" size={20} />
                      </View>
                      <Text className="text-center text-[11px] font-bold text-slate-600">{label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {featuredBooks.length > 0 ? (
                <View className="mb-6">
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-lg font-extrabold text-slate-950">Featured Books</Text>
                    <Text className="text-xs font-bold text-orange-500">See all</Text>
                  </View>
                  <View className="flex-row gap-4">
                    {featuredBooks.map((book) => (
                      <View key={book.id} className="w-36">
                        <BookCard book={book} onPress={openBook} onAdd={addBook} />
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-extrabold text-slate-950">
                  {booksQuery.data?.pages[0]?.total ?? 0} results found
                </Text>
                {booksQuery.isLoading ? <ActivityIndicator color="#F97316" /> : null}
              </View>
              {booksQuery.isError ? (
                <Text className="mb-4 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
                  We could not load books. Please try again.
                </Text>
              ) : null}
            </View>
          }
          ListFooterComponent={
            booksQuery.isFetchingNextPage ? (
              <ActivityIndicator className="py-5" color="#F97316" />
            ) : null
          }
          ListEmptyComponent={
            !booksQuery.isLoading ? (
              <Text className="py-8 text-center font-semibold text-slate-500">
                No books match your search.
              </Text>
            ) : null
          }
        />
      </View>
    </Screen>
  );
}