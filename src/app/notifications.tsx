import { router } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { typography } from "@/constants/typography";

export default function NotificationsScreen() {
  return (
    <Screen>
      <View className="flex-1">
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
          >
            <ArrowLeft color="#0F172A" size={21} />
          </Pressable>
          <Text
            className="text-xl text-slate-950"
            style={typography.titleBlack}
          >
            Notifications
          </Text>
          <View className="w-11" />
        </View>

        <View className="flex-1 items-center justify-center pb-20">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-orange-50">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <Bell color="#F97316" size={28} />
            </View>
          </View>

          <Text
            className="text-center text-2xl text-slate-950"
            style={typography.title}
          >
            No notifications yet
          </Text>
          <Text
            className="mt-3 max-w-[300px] text-center leading-6 text-slate-500"
            style={typography.label}
          >
            Order updates, book restocks, and special offers will appear here.
          </Text>

          <View className="mt-8 w-full">
            <PrimaryButton onPress={() => router.push("/")}>
              Browse Books
            </PrimaryButton>
          </View>
        </View>
      </View>
    </Screen>
  );
}
