import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Bell, CircleHelp, Search } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { BottomNav } from "@/components/BottomNav";
import { BookCard } from "@/components/book/BookCard";
import { FeaturedBookCard } from "@/components/book/FeaturedBookCard";
import { Screen } from "@/components/Screen";
import { BookGridSkeleton } from "@/components/Skeleton";
import { typography } from "@/constants/typography";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { fetchBooks } from "@/services/books";
import type { Book } from "@/types/book";

const PAGE_SIZE = 8;
const GRID_HORIZONTAL_PADDING = 20;
const GRID_COLUMN_GAP = 16;
const categories = ["All", "Fiction", "Mystery", "Romance"] as const;

export default function HomeScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const gridCardWidth = Math.min(
    178,
    Math.max(
      150,
      Math.floor(
        (windowWidth - GRID_HORIZONTAL_PADDING * 2 - GRID_COLUMN_GAP) / 2,
      ),
    ),
  );
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>("All");
  const debouncedSearch = useDebouncedValue(search);
  const listRef = useRef<FlashListRef<Book>>(null);
  const logoPressScale = useSharedValue(1);
  const logoPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoPressScale.value }],
  }));

  function bounceLogo() {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value, safe to mutate.
    logoPressScale.value = withSequence(
      withSpring(0.93, { damping: 12, stiffness: 320 }),
      withSpring(1, { damping: 9, stiffness: 220 }),
    );
  }

  function handleLogoPress() {
    bounceLogo();
    listRef.current?.scrollToTop({ animated: true });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );
  }

  const booksQuery = useInfiniteQuery({
    queryKey: ["books", debouncedSearch, selectedCategory],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchBooks({
        page: pageParam,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        category: selectedCategory === "All" ? undefined : selectedCategory,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const featuredBooksQuery = useQuery({
    queryKey: ["featured-books"],
    queryFn: () => fetchBooks({ page: 1, limit: 5 }),
  });

  const catalogBooks = useMemo(
    () => booksQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [booksQuery.data],
  );
  const isSearchInputActive = search.trim().length > 0;
  const isSearchingBooks = debouncedSearch.trim().length > 0;
  const isFilteringBooks =
    (selectedCategory !== "All" || isSearchingBooks) && booksQuery.isLoading;
  const visibleBooks = isFilteringBooks ? [] : catalogBooks;
  const featuredBooks = featuredBooksQuery.data?.data ?? [];
  const shouldShowFeaturedBooks =
    !isSearchInputActive && featuredBooks.length > 0;
  const booksSectionTitle = isSearchInputActive
    ? "Search Results"
    : selectedCategory === "All"
      ? "All Books"
      : `${selectedCategory} Books`;

  const openBook = useCallback((book: Book) => {
    router.push(`/book/${book.id}`);
  }, []);

  const openHelpCenter = useCallback(() => {
    router.push("/help");
  }, []);

  const openNotifications = useCallback(() => {
    router.push("/notifications");
  }, []);
  const renderBook = useCallback(
    ({ item, index }: { item: Book; index: number }) => (
      <View
        className={`flex-1 ${index % 2 === 0 ? "items-start" : "items-end"}`}
      >
        <BookCard book={item} onPress={openBook} width={gridCardWidth} />
      </View>
    ),
    [gridCardWidth, openBook],
  );

  return (
    <Screen padded={false}>
      <View className="flex-1">
        <View className="border-b border-slate-100 bg-white px-5 pb-4 pt-2">
          <View className="mb-6 flex-row items-start justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Scroll to top"
              onPress={handleLogoPress}
              hitSlop={8}
            >
              <Animated.View
                style={logoPressStyle}
                className="flex-row items-baseline"
              >
                <Animated.Text
                  entering={FadeInDown.duration(520)
                    .delay(60)
                    .springify()
                    .damping(14)}
                  className="text-4xl text-slate-950"
                  style={typography.titleBlack}
                >
                  Book{" "}
                </Animated.Text>
                <Animated.Text
                  entering={FadeInDown.duration(560)
                    .delay(180)
                    .springify()
                    .damping(14)}
                  className="text-4xl text-orange-500"
                  style={typography.titleBlack}
                >
                  Nook
                </Animated.Text>
              </Animated.View>
            </Pressable>
            <Animated.View
              entering={FadeIn.duration(420).delay(260)}
              className="flex-row items-center gap-3"
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open notifications"
                onPress={openNotifications}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
              >
                <Bell color="#0F172A" size={20} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open help center"
                onPress={openHelpCenter}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
              >
                <CircleHelp color="#0F172A" size={20} />
              </Pressable>
            </Animated.View>
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
                    isActive
                      ? "border-[#31523C] bg-[#31523C]"
                      : "border-orange-200 bg-orange-50"
                  }`}
                >
                  <Text
                    className={`text-xs uppercase ${isActive ? "text-white" : "text-slate-700"}`}
                    style={typography.labelBold}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <FlashList
          ref={listRef}
          data={visibleBooks}
          style={{ flex: 1 }}
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
            <View className="pt-5">
              {shouldShowFeaturedBooks ? (
                <View className="mb-8">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text
                      className="text-xl text-slate-950"
                      style={typography.title}
                    >
                      Featured Books
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 20, paddingRight: 20 }}
                  >
                    {featuredBooks.map((book) => (
                      <FeaturedBookCard
                        key={book.id}
                        book={book}
                        onPress={openBook}
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              <View className="mb-4 flex-row items-center justify-between">
                <Text
                  className="text-xl text-slate-950"
                  style={typography.title}
                >
                  {booksSectionTitle}
                </Text>
                {booksQuery.isLoading ? (
                  <ActivityIndicator color="#F97316" />
                ) : null}
              </View>

              {booksQuery.isError ? (
                <Text
                  className="mb-4 rounded-2xl bg-red-50 p-4 text-red-600"
                  style={typography.labelBold}
                >
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
              <Text
                className="py-8 text-center text-slate-500"
                style={typography.labelBold}
              >
                No books match your search.
              </Text>
            ) : null
          }
        />
        <BottomNav activeTab="home" />
      </View>
    </Screen>
  );
}
