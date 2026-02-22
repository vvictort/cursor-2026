import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import * as Animatable from "react-native-animatable";

import { useAuth } from "@/auth/SessionProvider";
import { ThemedText } from "@/components/themed-text";

const METRIC_CARDS = [
  { label: "Blood Pressure", icon: "water-drop", delay: 100 },
  { label: "Oxygen (SpO2)", icon: "air", delay: 200 },
  { label: "Glucose", icon: "opacity", delay: 300 },
  { label: "Heart Rate", icon: "monitor-heart", delay: 400 },
  { label: "Sleep", icon: "nights-stay", delay: 500 },
  { label: "Medication", icon: "medication", delay: 600 },
  { label: "Symptoms", icon: "person-search", delay: 700 },
  { label: "Other Data", icon: "calendar-month", delay: 800 },
] as const;

export default function LandingScreen() {
  const { user, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const elderName = user?.email ? user.email.split("@")[0] : "Elder";

  const executeSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const handleSignOut = async () => {
    if (Platform.OS === "web") {
      if (window.confirm("Do you want to sign out?")) {
        await executeSignOut();
      }
      return;
    }

    Alert.alert("Sign Out", "Do you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: executeSignOut },
    ]);
  };

  return (
    <View className="flex-1 bg-[#F1F5F9]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="w-full items-center">
          <View className="w-full max-w-[600px] px-6 pt-16" style={{ gap: 24 }}>
            <Animatable.View
              animation="fadeInDown"
              duration={800}
              className="flex-row justify-between items-center mb-2">
              <ThemedText className="text-[34px] font-black text-[#0F172A] tracking-tight">My Health</ThemedText>
              <View className="flex-row items-center gap-5">
                <Pressable
                  className="relative bg-white p-3 rounded-full border border-gray-200"
                  style={{ elevation: 4 }}>
                  <MaterialIcons name="notifications-none" size={26} color="#0F172A" />
                  <View className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#EF4444] rounded-full border-2 border-white" />
                </Pressable>
                <Pressable onPress={() => setIsProfileMenuOpen(true)}>
                  <View
                    className="w-12 h-12 rounded-full bg-[#2563EB] border-[2px] border-white items-center justify-center"
                    style={{
                      shadowColor: "#2563EB",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }}>
                    <ThemedText className="font-black text-white text-[20px]">
                      {elderName.slice(0, 1).toUpperCase()}
                    </ThemedText>
                  </View>
                </Pressable>
              </View>
            </Animatable.View>

            {/* Search Bar */}
            <Animatable.View animation="fadeInDown" delay={100} duration={800}>
              <View
                className="flex-row items-center bg-white border-[1.5px] border-gray-200 rounded-[24px] px-6 h-[68px]"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.05,
                  shadowRadius: 16,
                  elevation: 6,
                }}>
                <MaterialIcons name="search" size={28} color="#64748B" />
                <ThemedText className="ml-4 text-[#94A3B8] font-bold text-[18px]">Search metrics...</ThemedText>
              </View>
            </Animatable.View>

            {/* My Metrics */}
            <View className="mt-4">
              <Animatable.View animation="fadeIn" delay={200}>
                <ThemedText className="text-[22px] font-black text-[#0F172A] mb-5 tracking-tight">
                  Today&apos;s Tracking
                </ThemedText>
              </Animatable.View>

              <View className="flex-row flex-wrap justify-between gap-y-5">
                {METRIC_CARDS.map((item) => (
                  <Animatable.View
                    key={item.label}
                    animation="zoomIn"
                    delay={item.delay}
                    duration={600}
                    style={{ width: "47%" }}>
                    <Pressable
                      onPress={() => router.push("/dashboard")}
                      className="bg-white rounded-[28px] p-5 w-full py-8 items-center justify-center border border-gray-100 active:scale-95 transition-transform"
                      style={{
                        shadowColor: "#0F172A",
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.06,
                        shadowRadius: 24,
                        elevation: 8,
                      }}>
                      <View className="w-16 h-16 rounded-[20px] bg-indigo-50 items-center justify-center mb-4 border border-indigo-100">
                        <MaterialIcons name={item.icon as any} size={32} color="#4F46E5" />
                      </View>
                      <ThemedText className="text-[#334155] text-[16px] font-bold text-center">{item.label}</ThemedText>
                    </Pressable>
                  </Animatable.View>
                ))}
              </View>
            </View>

            {/* Connected Devices */}
            <Animatable.View animation="fadeInUp" delay={800} duration={800}>
              <View className="mt-6">
                <ThemedText className="text-[22px] font-black text-[#0F172A] mb-5 tracking-tight">
                  Paired Equipment
                </ThemedText>
                <View
                  className="bg-white rounded-[28px] p-5 flex-row items-center justify-between border-[1.5px] border-[#E2E8F0]"
                  style={{
                    shadowColor: "#0F172A",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.05,
                    shadowRadius: 16,
                    elevation: 6,
                  }}>
                  <View className="flex-row items-center gap-5">
                    <View className="w-14 h-14 bg-[#F8FAFC] border border-[#E2E8F0] items-center justify-center rounded-[18px]">
                      <MaterialIcons name="screenshot-monitor" size={28} color="#0F172A" />
                    </View>
                    <ThemedText className="text-[#0F172A] font-black text-[18px]">Blood Pressure Cuff</ThemedText>
                  </View>
                  <View className="bg-[#F1F5F9] p-2 rounded-full">
                    <MaterialIcons name="chevron-right" size={28} color="#475569" />
                  </View>
                </View>
              </View>
            </Animatable.View>
          </View>
        </View>
      </ScrollView>

      {/* Profile Menu Modal */}
      <Modal
        transparent
        visible={isProfileMenuOpen}
        animationType="fade"
        onRequestClose={() => setIsProfileMenuOpen(false)}>
        <View className="flex-1 justify-start items-end pt-20 pr-6 bg-black/20">
          <Pressable className="absolute inset-0" onPress={() => setIsProfileMenuOpen(false)} />
          <View className="w-64 bg-white rounded-[28px] p-3 border border-gray-200" style={{ elevation: 20 }}>
            <ThemedText className="text-[#64748B] font-black px-4 py-3 text-[14px] uppercase tracking-widest border-b border-gray-100 mb-2">
              User Menu
            </ThemedText>
            <Pressable
              className="flex-row items-center px-4 py-4 rounded-[20px] active:bg-[#F8FAFC]"
              onPress={() => {
                setIsProfileMenuOpen(false);
                Alert.alert("Settings", "Coming soon.");
              }}>
              <View className="bg-[#F1F5F9] p-2 rounded-xl mr-4">
                <MaterialIcons name="settings" size={24} color="#0F172A" />
              </View>
              <ThemedText className="text-[#0F172A] font-black text-[18px]">Settings</ThemedText>
            </Pressable>
            <Pressable
              className="flex-row items-center px-4 py-4 rounded-[20px] active:bg-[#FEF2F2] mt-2"
              onPress={() => {
                setIsProfileMenuOpen(false);
                handleSignOut();
              }}>
              <View className="bg-[#FEF2F2] p-2 rounded-xl mr-4">
                <MaterialIcons name="logout" size={24} color="#EF4444" />
              </View>
              <ThemedText className="text-[#EF4444] font-black text-[18px]">Log Out</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
