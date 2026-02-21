import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

import { useAuth } from "@/auth/SessionProvider";
import { ThemedText } from "@/components/themed-text";

const METRIC_CARDS = [
  { label: "Blood Pressure", icon: "water-drop" },
  { label: "Oxygen (SpO2)", icon: "air" },
  { label: "Glucose", icon: "opacity" },
  { label: "Heart Rate", icon: "monitor-heart" },
  { label: "Sleep", icon: "nights-stay" },
  { label: "Medication", icon: "medication" },
  { label: "Symptoms", icon: "person-search" },
  { label: "Other Data", icon: "calendar-month" },
] as const;

export default function LandingScreen() {
  const { user, signOut } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const elderName = user?.email ? user.email.split("@")[0] : "Elder";

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Do you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-glass-bg">
      {/* Background gradients simulated via absolute colored blurs */}
      <View className="absolute top-[-100px] -left-12 w-[500px] h-[500px] rounded-full bg-blue-700 opacity-60 blur-3xl" />
      <View className="absolute bottom-[-100px] -right-12 w-[400px] h-[400px] rounded-full bg-violet-600 opacity-40 blur-3xl" />

      {/* @ts-ignore - NativeWind v4 supports contentContainerClassName but TS types might be missing */}
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-16 pb-32 gap-6">
        {/* Header Row */}
        <View className="flex-row justify-between items-center">
          <ThemedText className="text-3xl font-bold text-glass-text">My Health</ThemedText>
          <View className="flex-row items-center gap-5">
            <Pressable className="relative">
              <MaterialIcons name="notifications-none" size={28} color="#F8FAFC" />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-glass-coral rounded-full" />
            </Pressable>
            <Pressable onPress={() => setIsProfileMenuOpen(true)}>
              <View className="w-10 h-10 rounded-full bg-glass-card border border-glass-border items-center justify-center shadow-sm">
                <ThemedText className="font-bold text-glass-text text-lg">
                  {elderName.slice(0, 1).toUpperCase()}
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-glass-card border border-glass-border rounded-full px-5 h-[56px] shadow-sm backdrop-blur-2xl">
          <MaterialIcons name="search" size={26} color="#94A3B8" />
          <ThemedText className="ml-3 text-glass-muted text-[19px]">Search</ThemedText>
        </View>

        {/* My Metrics */}
        <View className="mt-2 text-glass-text">
          <ThemedText className="text-xl font-bold text-glass-text mb-4">My metrics</ThemedText>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {METRIC_CARDS.map((item) => (
              <View
                key={item.label}
                className="bg-glass-card backdrop-blur-3xl rounded-[28px] p-4 w-[48%] py-8 items-center justify-center shadow-sm border border-glass-border">
                <MaterialIcons name={item.icon as any} size={40} color="#22D3EE" className="mb-3 opacity-90" />
                <ThemedText className="text-glass-text text-[17px] font-semibold text-center">{item.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Connected Devices */}
        <View className="mt-2 text-glass-text">
          <ThemedText className="text-xl font-bold text-glass-text mb-4">Connected devices</ThemedText>
          <View className="bg-glass-card backdrop-blur-3xl rounded-[24px] p-4 flex-row items-center justify-between shadow-sm border border-glass-border">
            <View className="flex-row items-center gap-4">
              <View className="w-[56px] h-[56px] bg-white/5 flex-col py-1 items-center justify-center border border-white/5 rounded-xl">
                <MaterialIcons name="screenshot-monitor" size={28} color="#22D3EE" />
              </View>
              <ThemedText className="text-glass-text font-bold text-[18px]">Blood Pressure Device</ThemedText>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#94A3B8" />
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
          <View className="w-56 bg-[#1E293B] rounded-[24px] p-3 shadow-lg border border-glass-border">
            <ThemedText className="text-glass-text font-bold px-3 py-2 text-base">Profile Menu</ThemedText>
            <Pressable
              className="flex-row items-center px-3 py-3 rounded-[16px] active:bg-white/5"
              onPress={() => {
                setIsProfileMenuOpen(false);
                Alert.alert("Settings", "Coming soon.");
              }}>
              <MaterialIcons name="settings" size={22} color="#F8FAFC" />
              <ThemedText className="ml-3 text-glass-text font-semibold text-[17px]">Settings</ThemedText>
            </Pressable>
            <Pressable
              className="flex-row items-center px-3 py-3 rounded-[16px] active:bg-glass-coral/10"
              onPress={() => {
                setIsProfileMenuOpen(false);
                handleSignOut();
              }}>
              <MaterialIcons name="logout" size={22} color="#FB7185" />
              <ThemedText className="ml-3 text-glass-coral font-semibold text-[17px]">Log Out</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
