import * as Linking from "expo-linking";
import { BookOpen, Home, ShoppingBag } from "lucide-react-native";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

import { typography } from "@/constants/typography";
import { useCartStore } from "@/store/cart-store";

type BottomNavTab = "home" | "cart" | "orders";

type TabIcon = ComponentType<{
  color?: string;
  fill?: string;
  fillOpacity?: number;
  size?: number;
  strokeWidth?: number;
}>;

const ACTIVE_COLOR = "#F97316";
const INACTIVE_COLOR = "#94A3B8";
const ACTIVE_FILL_OPACITY = 0.22;

const tabs: {
  key: BottomNavTab;
  href: string;
  label: string;
  icon: TabIcon;
}[] = [
  { key: "home", href: "/", label: "Home", icon: Home },
  { key: "cart", href: "/cart", label: "Cart", icon: ShoppingBag },
  { key: "orders", href: "/orders", label: "Orders", icon: BookOpen },
];

function getRouteUrl(href: string) {
  return Linking.createURL(href === "/" ? "" : href.replace(/^\//, ""));
}

function AnimatedTabIcon({
  Icon,
  color,
  isActive,
}: {
  Icon: TabIcon;
  color: string;
  isActive: boolean;
}) {
  const [activeProgress] = useState(() => new Animated.Value(isActive ? 1 : 0));

  useEffect(() => {
    Animated.timing(activeProgress, {
      toValue: isActive ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [activeProgress, isActive]);

  const outlineOpacity = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View className="h-[24px] w-[24px] items-center justify-center">
      <Animated.View style={{ opacity: outlineOpacity }}>
        <Icon color={color} size={22} strokeWidth={2} />
      </Animated.View>
      <Animated.View className="absolute" style={{ opacity: activeProgress }}>
        <Icon
          color={color}
          fill={color}
          fillOpacity={ACTIVE_FILL_OPACITY}
          size={22}
          strokeWidth={2.2}
        />
      </Animated.View>
    </View>
  );
}

export function BottomNav({ activeTab }: { activeTab: BottomNavTab }) {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-6 pb-5 pt-3">
      <View className="flex-row items-center justify-between">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const Icon = tab.icon;
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <Pressable
              key={tab.href}
              className="min-w-20 items-center gap-1"
              accessibilityRole="button"
              onPress={() => Linking.openURL(getRouteUrl(tab.href))}
            >
              <View>
                <AnimatedTabIcon
                  Icon={Icon}
                  color={color}
                  isActive={isActive}
                />
                {tab.key === "cart" && itemCount > 0 ? (
                  <View className="absolute -right-3 -top-2 min-w-5 items-center rounded-full bg-orange-500 px-1">
                    <Text className="text-[10px] font-black text-white">
                      {itemCount}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                className={`text-[11px] ${isActive ? "text-orange-500" : "text-slate-400"}`}
                style={typography.labelBold}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
