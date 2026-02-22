import { useAuth } from "@/auth/SessionProvider";
import { ThemedText } from "@/components/themed-text";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function LandingPage() {
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      router.replace("/(tabs)");
    }
  }, [session]);

  return (
    <View className="flex-1 bg-[#F1F5F9]">
      {/* Dynamic Graphic Background */}
      <View className="absolute top-[-150px] -left-20 w-[600px] h-[600px] rounded-full bg-blue-500 opacity-20 blur-[100px]" />
      <View className="absolute bottom-[-100px] -right-20 w-[500px] h-[500px] rounded-full bg-violet-500 opacity-20 blur-[100px]" />

      <View className="flex-1 items-center justify-center px-8 z-10" style={{ width: "100%" }}>
        {/* Logo Section */}
        <Animatable.View
          animation="fadeInDown"
          duration={1200}
          easing="ease-out-cubic"
          style={{ alignItems: "center", marginBottom: 48 }}>
          <Animatable.View animation="pulse" easing="ease-in-out" iterationCount="infinite" duration={3000}>
            <View
              className="w-28 h-28 bg-[#FFFFFF] rounded-[36px] items-center justify-center mb-8 border-[1.5px] border-gray-200"
              style={{
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
                elevation: 15,
              }}>
              <View className="w-16 h-16 rounded-[20px] bg-[#2563EB] items-center justify-center overflow-hidden">
                <ThemedText className="text-white text-5xl font-black" style={{ lineHeight: 60 }}>
                  E
                </ThemedText>
              </View>
            </View>
          </Animatable.View>

          <View className="flex-row items-center justify-center h-16">
            <ThemedText className="text-[52px] font-black text-[#0F172A] tracking-tight" style={{ lineHeight: 64 }}>
              Elder
            </ThemedText>
            <ThemedText className="text-[52px] font-black text-[#2563EB] tracking-tight" style={{ lineHeight: 64 }}>
              Link
            </ThemedText>
          </View>
          <ThemedText className="text-[#475569] text-[20px] mt-4 font-semibold text-center px-4 leading-[28px]">
            Bridging care with connection.
          </ThemedText>
        </Animatable.View>

        {/* Action Buttons */}
        <Animatable.View
          animation="fadeInUp"
          delay={400}
          duration={1200}
          easing="ease-out-cubic"
          style={{ width: "100%", maxWidth: 320, gap: 20 }}>
          <Link href="/signup" asChild>
            <Pressable
              className="bg-[#2563EB] h-[64px] rounded-[24px] items-center justify-center active:scale-95 transition-transform"
              style={{
                width: "100%",
                shadowColor: "#2563EB",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 10,
              }}>
              <ThemedText className="text-white text-[20px] font-bold tracking-wide">Get Started</ThemedText>
            </Pressable>
          </Link>

          <Link href="/login" asChild>
            <Pressable
              className="bg-[#FFFFFF] h-[64px] rounded-[24px] items-center justify-center border-[2px] border-[#E2E8F0] active:bg-[#F8FAFC] active:scale-95 transition-transform"
              style={{
                width: "100%",
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 5,
              }}>
              <ThemedText className="text-[#0F172A] text-[20px] font-bold tracking-wide">Sign In</ThemedText>
            </Pressable>
          </Link>
        </Animatable.View>

        {/* Footer */}
        <Animatable.View
          animation="fadeIn"
          delay={1200}
          duration={1000}
          className="absolute bottom-12 items-center"
          style={{ width: "100%" }}>
          <View className="bg-white/60 px-4 py-2 rounded-full border border-gray-200" style={{ alignSelf: "center" }}>
            <ThemedText className="text-[#64748B] text-[12px] font-bold tracking-widest uppercase">
              POWERED BY BANANA NANO PRO
            </ThemedText>
          </View>
        </Animatable.View>
      </View>
    </View>
  );
}
