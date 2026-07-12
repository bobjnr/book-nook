import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ArrowLeft, ShoppingBag } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { BookCover } from "@/components/book/BookCover";
import { Rating } from "@/components/book/Rating";
import { Price } from "@/components/Price";
import { PrimaryButton } from "@/components/PrimaryButton";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Screen } from "@/components/Screen";
import { BookDetailsSkeleton } from "@/components/Skeleton";
import { typography } from "@/constants/typography";
import { fetchBookById } from "@/services/books";
import { useCartStore } from "@/store/cart-store";
import type { Book } from "@/types/book";

type LoadStatus = "loading" | "success" | "error";

const reviewHighlights = [
  {
    quote: "Beautifully paced and easy to get lost in.",
    reviewer: "T. Okoye",
  },
  {
    quote: "A thoughtful read that stayed with me after the final page.",
    reviewer: "R. Daniel",
  },
];

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const rootRef = useRef<View>(null);
  const coverRef = useRef<View>(null);
  const cartIconRef = useRef<View>(null);
  const isFlyingRef = useRef(false);
  const addBook = useCartStore((state) => state.addBook);
  const itemCount = useCartStore((state) => state.getItemCount());
  const flyingOpacity = useSharedValue(0);
  const flyingProgress = useSharedValue(0);
  const flyingLeft = useSharedValue(0);
  const flyingTop = useSharedValue(0);
  const flyingWidth = useSharedValue(0);
  const flyingHeight = useSharedValue(0);
  const flyingControlX = useSharedValue(0);
  const flyingControlY = useSharedValue(0);
  const flyingEndX = useSharedValue(0);
  const flyingEndY = useSharedValue(0);
  const cartBumpScale = useSharedValue(1);
  const badgeBumpScale = useSharedValue(1);

  useEffect(() => {
    let isActive = true;

    async function loadBook() {
      if (!id) {
        return;
      }

      setStatus("loading");
      setError("");

      try {
        const selectedBook = await fetchBookById(id);

        if (isActive) {
          setBook(selectedBook);
          setStatus("success");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "We could not load this book right now.",
          );
          setStatus("error");
        }
      }
    }

    loadBook();

    return () => {
      isActive = false;
    };
  }, [id]);

  const flyingStyle = useAnimatedStyle(() => {
    const progress = flyingProgress.value;
    const inverse = 1 - progress;
    const translateX =
      2 * inverse * progress * flyingControlX.value +
      progress * progress * flyingEndX.value;
    const translateY =
      2 * inverse * progress * flyingControlY.value +
      progress * progress * flyingEndY.value;
    // Shrinks quickly on lift-off, then settles into a small parcel for the rest
    // of the arc, with a gentle flutter of rotation instead of a single twist.
    const scale = interpolate(
      progress,
      [0, 0.2, 0.62, 1],
      [1, 0.62, 0.32, 0.15],
    );
    const rotate = interpolate(progress, [0, 0.3, 0.62, 1], [0, -8, 5, 12]);

    return {
      left: flyingLeft.value,
      top: flyingTop.value,
      width: flyingWidth.value,
      height: flyingHeight.value,
      opacity: flyingOpacity.value,
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const cartIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartBumpScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeBumpScale.value }],
  }));


  function handleCartLanding() {
    isFlyingRef.current = false;
  }

  function startFlyingCoverAnimation(onLanded: () => void) {
    const rootNode = rootRef.current;
    const coverNode = coverRef.current;
    const cartNode = cartIconRef.current;

    if (!rootNode || !coverNode || !cartNode) {
      isFlyingRef.current = false;
      return;
    }

    rootNode.measureInWindow((rootX, rootY) => {
      coverNode.measureInWindow((coverX, coverY, coverWidth, coverHeight) => {
        cartNode.measureInWindow((cartX, cartY, cartWidth, cartHeight) => {
          const startLeft = coverX - rootX;
          const startTop = coverY - rootY;
          const startCenterX = startLeft + coverWidth / 2;
          const startCenterY = startTop + coverHeight / 2;
          const endCenterX = cartX - rootX + cartWidth / 2;
          const endCenterY = cartY - rootY + cartHeight / 2;
          const endX = endCenterX - startCenterX;
          const endY = endCenterY - startCenterY;

          flyingLeft.value = startLeft;
          flyingTop.value = startTop;
          flyingWidth.value = coverWidth;
          flyingHeight.value = coverHeight;
          flyingControlX.value = endX * 0.35;
          flyingControlY.value = Math.min(endY, 0) - 130;
          flyingEndX.value = endX;
          flyingEndY.value = endY;
          flyingProgress.value = 0;
          flyingOpacity.value = 1;

          // Two-stage timing rather than one flat curve: a quick, energetic
          // launch away from the cover, then a shorter, decelerating
          // approach into the cart, similar to how a thrown object behaves.
          flyingProgress.value = withSequence(
            withTiming(0.62, {
              duration: 430,
              easing: Easing.out(Easing.cubic),
            }),
            withTiming(
              1,
              { duration: 300, easing: Easing.in(Easing.quad) },
              (finished) => {
                if (finished) {
                  scheduleOnRN(onLanded);
                  flyingOpacity.value = withTiming(0, { duration: 160 });
                  cartBumpScale.value = 1;
                  cartBumpScale.value = withSequence(
                    withTiming(1.2, {
                      duration: 90,
                      easing: Easing.out(Easing.quad),
                    }),
                    withTiming(1, {
                      duration: 80,
                      easing: Easing.in(Easing.quad),
                    }),
                  );
                  badgeBumpScale.value = 1;
                  badgeBumpScale.value = withSequence(
                    withTiming(1.32, {
                      duration: 90,
                      easing: Easing.out(Easing.quad),
                    }),
                    withTiming(1, {
                      duration: 80,
                      easing: Easing.in(Easing.quad),
                    }),
                  );
                }
              },
            ),
          );
        });
      });
    });
  }

  function handleAddToCart() {
    if (!book || isFlyingRef.current) {
      return;
    }

    isFlyingRef.current = true;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );

    for (let index = 0; index < quantity; index += 1) {
      addBook(book);
    }

    startFlyingCoverAnimation(() => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
        () => undefined,
      );
      handleCartLanding();
    });
  }

  return (
    <Screen>
      <View ref={rootRef} collapsable={false} className="flex-1">
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
            <Link href="/cart" asChild>
              <Pressable>
                <Animated.View
                  ref={cartIconRef}
                  collapsable={false}
                  className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-50"
                  style={cartIconStyle}
                >
                  <ShoppingBag color="#F97316" size={20} />
                  {itemCount > 0 ? (
                    <Animated.View
                      style={badgeStyle}
                      className="absolute -right-1 -top-1 min-w-5 items-center rounded-full bg-orange-500 px-1"
                    >
                      <Text className="text-[10px] font-extrabold text-white">
                        {itemCount}
                      </Text>
                    </Animated.View>
                  ) : null}
                </Animated.View>
              </Pressable>
            </Link>
          </View>
        </View>

        {status === "loading" ? <BookDetailsSkeleton /> : null}

        {status === "error" ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-center text-lg font-extrabold text-slate-950">
              Something went wrong
            </Text>
            <Text className="text-center font-semibold text-slate-500">
              {error}
            </Text>
            <PrimaryButton onPress={() => router.replace(`/book/${id}`)}>
              Try Again
            </PrimaryButton>
          </View>
        ) : null}

        {status === "success" && book ? (
          <View className="flex-1">
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 116 }}
            >
              <View className="items-center pt-3">
                <View ref={coverRef} collapsable={false}>
                  <BookCover
                    uri={book.cover}
                    width={204}
                    height={318}
                    rounded={20}
                  />
                </View>
              </View>

              <View className="mt-7 gap-4">
                <View>
                  <Text className="text-3xl font-black text-slate-950">
                    {book.title}
                  </Text>
                  <Text className="mt-1 text-base font-semibold text-slate-500">
                    {book.author}
                  </Text>
                </View>

                <Rating rating={book.rating} reviews={book.reviews} />

                <View className="flex-row items-center gap-3">
                  <Price
                    value={book.price}
                    originalValue={book.price + 4}
                    size="lg"
                  />
                  <View className="rounded-lg bg-green-100 px-3 py-1">
                    <Text className="text-xs font-extrabold text-green-700">
                      27% OFF
                    </Text>
                  </View>
                </View>

                <Text className="text-base font-medium leading-7 text-slate-600">
                  {book.description}
                </Text>

                <View className="gap-3">
                  <Text
                    className="text-xs uppercase text-orange-700"
                    style={typography.labelBold}
                  >
                    Reviews
                  </Text>
                  {reviewHighlights.map((review) => (
                    <View
                      key={review.reviewer}
                      className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4"
                    >
                      <Text
                        className="text-sm italic leading-6 text-slate-800"
                        style={typography.label}
                      >
                        {`"${review.quote}"`}
                      </Text>
                      <Text
                        className="mt-2 text-xs text-slate-500"
                        style={typography.labelBold}
                      >
                        - {review.reviewer}
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="flex-row justify-between rounded-3xl bg-slate-50 px-5 py-4">
                  <View className="items-center">
                    <Text className="text-sm font-extrabold text-slate-950">
                      Paperback
                    </Text>
                    <Text className="text-xs font-semibold text-slate-500">
                      Format
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-sm font-extrabold text-slate-950">
                      208
                    </Text>
                    <Text className="text-xs font-semibold text-slate-500">
                      Pages
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-sm font-extrabold text-slate-950">
                      English
                    </Text>
                    <Text className="text-xs font-semibold text-slate-500">
                      Language
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: "absolute",
                  zIndex: 20,
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.28,
                  shadowRadius: 16,
                  elevation: 12,
                },
                flyingStyle,
              ]}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: book.cover }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
            </Animated.View>

            <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-slate-100 bg-white pb-5 pt-4">
              <QuantityStepper
                quantity={quantity}
                onIncrease={() => setQuantity((value) => value + 1)}
                onDecrease={() =>
                  setQuantity((value) => Math.max(1, value - 1))
                }
              />
              <View className="flex-1">
                <PrimaryButton
                  testID="add-to-cart-button"
                  onPress={handleAddToCart}
                >
                  ADD TO CART
                </PrimaryButton>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
