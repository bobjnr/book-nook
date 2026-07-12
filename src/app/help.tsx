import { router } from "expo-router";
import { ArrowLeft, Clock3, Mail, MapPin, Phone } from "lucide-react-native";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Screen } from "@/components/Screen";
import { typography } from "@/constants/typography";

function WhatsAppOutlineIcon({ color = "#F97316", size = 20 }: { color?: string; size?: number }) {
  const strokeProps = {
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.04 3.1a8.86 8.86 0 0 0-7.68 13.29L3.2 20.8l4.52-1.19a8.86 8.86 0 1 0 4.32-16.51Z"
        {...strokeProps}
      />
      <Path
        d="M8.66 8.05c.18-.39.32-.4.58-.4h.43c.14 0 .34.05.52.43l.7 1.67c.08.2.06.37-.05.54l-.37.5c-.12.16-.24.31-.1.55.37.64.82 1.19 1.34 1.65.58.52 1.22.91 1.92 1.18.25.1.39.08.55-.1l.76-.87c.18-.21.38-.26.62-.16l1.68.76c.26.12.43.22.48.36.06.18-.02.92-.52 1.47-.47.52-1.15.76-2 .71-1.27-.07-2.82-.74-4.32-1.95-1.66-1.34-2.85-3.04-3.2-4.47-.24-.98-.06-1.55.28-1.87Z"
        {...strokeProps}
      />
    </Svg>
  );
}

const supportChannels = [
  {
    label: "Email support",
    value: "support@booknook.com",
    icon: Mail,
    url: "mailto:support@booknook.com?subject=Book%20Nook%20Support",
  },
  {
    label: "Call support",
    value: "+234 813 700 2452",
    icon: Phone,
    url: "tel:+2348137002452",
  },
  {
    label: "WhatsApp help",
    value: "+234 813 700 2452",
    icon: WhatsAppOutlineIcon,
    iconSize: 22,
    url: "https://wa.me/2348137002452",
  },
] as const;

export default function HelpScreen() {
  return (
    <Screen>
      <View className="mb-5 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
        >
          <ArrowLeft color="#0F172A" size={21} />
        </Pressable>
        <Text className="text-xl text-slate-950" style={typography.titleBlack}>
          Help Center
        </Text>
        <View className="w-11" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="gap-5">
          <View className="rounded-3xl bg-orange-50 p-5">
            <Text
              className="text-2xl text-slate-950"
              style={typography.titleBlack}
            >
              Need help with an order?
            </Text>
            <Text
              className="mt-2 leading-6 text-slate-600"
              style={typography.label}
            >
              Contact support if you have any issue with checkout, payment,
              delivery, refunds, or book availability.
            </Text>
          </View>

          <View className="gap-3">
            {supportChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <Pressable
                  key={channel.label}
                  accessibilityRole="button"
                  accessibilityLabel={channel.label}
                  onPress={() => Linking.openURL(channel.url)}
                  className="flex-row items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">
                    <Icon color="#F97316" size={"iconSize" in channel ? channel.iconSize : 20} />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-slate-950"
                      style={typography.labelBold}
                    >
                      {channel.label}
                    </Text>
                    <Text
                      className="mt-1 text-slate-500"
                      style={typography.label}
                    >
                      {channel.value}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <View className="mb-3 flex-row items-center gap-2">
              <Clock3 color="#F97316" size={18} />
              <Text className="text-lg text-slate-950" style={typography.title}>
                Support Hours
              </Text>
            </View>
            <Text className="leading-6 text-slate-500" style={typography.label}>
              Monday to Saturday, 9:00 AM - 6:00 PM WAT. We usually respond to
              emails within one business day.
            </Text>
          </View>

          <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <View className="mb-3 flex-row items-center gap-2">
              <MapPin color="#F97316" size={18} />
              <Text className="text-lg text-slate-950" style={typography.title}>
                Office
              </Text>
            </View>
            <Text className="leading-6 text-slate-500" style={typography.label}>
              27, Ojurongbe Street, Egbeda, Lagos State, Nigeria
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

