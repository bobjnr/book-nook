import { Link, usePathname } from 'expo-router';
import { BookOpen, Home, ShoppingBag } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { typography } from '@/constants/typography';
import { useCartStore } from '@/store/cart-store';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/cart', label: 'Cart', icon: ShoppingBag },
  { href: '/orders', label: 'Orders', icon: BookOpen },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-6 pb-5 pt-3">
      <View className="flex-row items-center justify-between">
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          const color = isActive ? '#F97316' : '#94A3B8';

          return (
            <Link href={tab.href} asChild key={tab.href}>
              <Pressable className="min-w-20 items-center gap-1" accessibilityRole="tab">
                <View>
                  <Icon color={color} size={22} strokeWidth={isActive ? 2.4 : 2} />
                  {tab.href === '/cart' && itemCount > 0 ? (
                    <View className="absolute -right-3 -top-2 min-w-5 items-center rounded-full bg-orange-500 px-1">
                      <Text className="text-[10px] font-black text-white">{itemCount}</Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  className={`text-[11px] ${isActive ? 'text-orange-500' : 'text-slate-400'}`}
                  style={typography.labelBold}
                >
                  {tab.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
