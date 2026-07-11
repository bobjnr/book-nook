import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { Bell, Search, ShoppingBag } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { BottomNav } from '@/components/BottomNav';
import { BookCard } from '@/components/book/BookCard';
import { FeaturedBookCard } from '@/components/book/FeaturedBookCard';
import { Screen } from '@/components/Screen';
import { BookGridSkeleton } from '@/components/Skeleton';
import { typography } from '@/constants/typography';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { fetchBooks } from '@/services/books';
import { useCartStore } from '@/store/cart-store';
import type { Book } from '@/types/book';

const PAGE_SIZE = 8;
const GRID_HORIZONTAL_PADDING = 20;
const GRID_COLUMN_GAP = 16;
const categories = ['All', 'Fiction', 'Mystery', 'Romance'] as const;

export default function HomeScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const gridCardWidth = Math.min(
    178,
    Math.max(150, Math.floor((windowWidth - GRID_HORIZONTAL_PADDING * 2 - GRID_COLUMN_GAP) / 2)),
  );
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('All');
  const debouncedSearch = useDebouncedValue(search);
  const itemCount = useCartStore((state) => state.getItemCount());

  const booksQuery = useInfiniteQuery({
    queryKey: ['books', debouncedSearch, selectedCategory],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchBooks({
        page: pageParam,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });

  const catalogBooks = useMemo(
    () => booksQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [booksQuery.data],
  );
  const isSearchingBooks = debouncedSearch.trim().length > 0;
  const isFilteringBooks = (selectedCategory !== 'All' || isSearchingBooks) && booksQuery.isLoading;
  const visibleBooks = isFilteringBooks ? [] : catalogBooks;

  const featuredBooks = catalogBooks.slice(0, 5);

  const openBook = useCallback((book: Book) => {
    router.push(`/book/${book.id}`);
  }, []);

  const renderBook = useCallback(
    ({ item, index }: { item: Book; index: number }) => (
      <View className={`flex-1 ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
        <BookCard book={item} onPress={openBook} width={gridCardWidth} />
      </View>
    ),
    [gridCardWidth, openBook],
  );

  return (
    <Screen padded={false}>
      <View className="flex-1">
        <FlashList
          data={visibleBooks}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 132 }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (booksQuery.hasNextPage && !booksQuery.isFetchingNextPage) {
              booksQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.35}
          ListHeaderComponent={
            <View className="pb-6 pt-2">
              <View className="mb-6 flex-row items-start justify-between">
                <View>
                  <View className="flex-row items-baseline">
                    <Text className="text-4xl text-slate-950" style={typography.titleBlack}>
                      Book{' '}
                    </Text>
                    <Text className="text-4xl text-orange-500" style={typography.titleBlack}>
                      Nook
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3">
                  <Bell color="#0F172A" size={22} />
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
              </View>

              <View className="mb-7 h-14 flex-row items-center gap-3 rounded-2xl bg-slate-50 px-4">
                <Search color="#64748B" size={18} />
                <TextInput
                  accessibilityLabel="Search books"
                  className="flex-1 text-sm text-slate-950"
                  placeholder="Search books, authors, genres..."
                  placeholderTextColor="#94A3B8"
                  value={search}
                  onChangeText={setSearch}
                  style={typography.label}
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-8"
                contentContainerStyle={{ gap: 10, paddingRight: 20 }}
              >
                {categories.map((label) => {
                  const isActive = label === selectedCategory;

                  return (
                    <Pressable
                      key={label}
                      accessibilityRole="button"
                      onPress={() => setSelectedCategory(label)}
                      className={`h-10 items-center justify-center rounded-full border px-5 ${
                        isActive ? 'border-[#31523C] bg-[#31523C]' : 'border-orange-200 bg-orange-50'
                      }`}
                    >
                      <Text
                        className={`text-xs uppercase ${isActive ? 'text-white' : 'text-slate-700'}`}
                        style={typography.labelBold}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {featuredBooks.length > 0 ? (
                <View className="mb-8">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-xl text-slate-950" style={typography.title}>
                      Featured Books
                    </Text>
                    <Text className="text-xs text-orange-500" style={typography.labelBold}>
                      See all
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 20, paddingRight: 20 }}
                  >
                    {featuredBooks.map((book) => (
                      <FeaturedBookCard key={book.id} book={book} onPress={openBook} />
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              <View className="mb-5 flex-row items-center justify-between">
                <Text className="text-xl text-slate-950" style={typography.title}>
                  {selectedCategory === 'All' ? 'All Books' : `${selectedCategory} Books`}
                </Text>
                {booksQuery.isLoading ? <ActivityIndicator color="#F97316" /> : null}
              </View>

              {booksQuery.isError ? (
                <Text className="mb-4 rounded-2xl bg-red-50 p-4 text-red-600" style={typography.labelBold}>
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
            isFilteringBooks ? (
              <BookGridSkeleton cardWidth={gridCardWidth} />
            ) : !booksQuery.isLoading ? (
              <Text className="py-8 text-center text-slate-500" style={typography.labelBold}>
                No books match your search.
              </Text>
            ) : null
          }
        />
        <BottomNav />
      </View>
    </Screen>
  );
}


