import { useAuth } from "@/auth/SessionProvider";
import { ThemedText } from "@/components/themed-text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
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
          <View className="w-full max-w-[600px] px-6 pt-16">
            {/* Header */}
            <Animatable.View animation="fadeInDown" duration={800} className="items-center mb-10">
              <View
                className="w-28 h-28 rounded-[36px] bg-white items-center justify-center border-2 border-gray-200 mb-6 pb-1"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 16 },
                  shadowOpacity: 0.1,
                  shadowRadius: 32,
                  elevation: 15,
                }}>
                <ThemedText className="font-black text-[#2563EB] text-[48px]">
                  {elderName.slice(0, 1).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText className="text-[#0F172A] text-[34px] font-black tracking-tight">{elderName}</ThemedText>
              <ThemedText className="text-[#475569] text-[18px] font-bold mt-2 bg-white px-5 py-2 rounded-full border border-gray-200">
                {user?.email}
              </ThemedText>
            </Animatable.View>

            {/* Options */}
            <Animatable.View animation="fadeInUp" delay={200} duration={800} className="gap-5">
              <Pressable
                onPress={() => Alert.alert("Settings", "Coming soon.")}
                className="flex-row items-center justify-between bg-white border-[1.5px] border-gray-200 p-6 rounded-[32px] active:scale-[0.98] transition-transform"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.05,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                <View className="flex-row items-center flex-1 pr-4" style={{ gap: 16 }}>
                  <View className="w-14 h-14 rounded-[20px] bg-[#EFF6FF] border border-[#BFDBFE] items-center justify-center shrink-0">
                    <MaterialIcons name="settings" size={32} color="#2563EB" />
                  </View>
                  <ThemedText className="text-[#0F172A] font-black text-[20px] flex-1" numberOfLines={1}>
                    Account Settings
                  </ThemedText>
                </View>
                <View className="bg-[#F8FAFC] p-2 rounded-full border border-gray-100">
                  <MaterialIcons name="chevron-right" size={28} color="#64748B" />
                </View>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert("Medical ID", "Coming soon.")}
                className="flex-row items-center justify-between bg-white border-[1.5px] border-gray-200 p-6 rounded-[32px] active:scale-[0.98] transition-transform"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.05,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                <View className="flex-row items-center flex-1 pr-4" style={{ gap: 16 }}>
                  <View className="w-14 h-14 rounded-[20px] bg-[#FFF7ED] border border-[#FED7AA] items-center justify-center shrink-0">
                    <MaterialIcons name="medical-services" size={32} color="#EA580C" />
                  </View>
                  <ThemedText className="text-[#0F172A] font-black text-[20px] flex-1" numberOfLines={1}>
                    Medical ID
                  </ThemedText>
                </View>
                <View className="bg-[#F8FAFC] p-2 rounded-full border border-gray-100">
                  <MaterialIcons name="chevron-right" size={28} color="#64748B" />
                </View>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert("Health Connected Apps", "Coming soon.")}
                className="flex-row items-center justify-between bg-white border-[1.5px] border-gray-200 p-6 rounded-[32px] active:scale-[0.98] transition-transform"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.05,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                <View className="flex-row items-center flex-1 pr-4" style={{ gap: 16 }}>
                  <View className="w-14 h-14 rounded-[20px] bg-[#F0FDF4] border border-[#BBF7D0] items-center justify-center shrink-0">
                    <MaterialIcons name="devices-other" size={32} color="#16A34A" />
                  </View>
                  <ThemedText className="text-[#0F172A] font-black text-[20px] flex-1" numberOfLines={1}>
                    Connected Devices
                  </ThemedText>
                </View>
                <View className="bg-[#F8FAFC] p-2 rounded-full border border-gray-100">
                  <MaterialIcons name="chevron-right" size={28} color="#64748B" />
                </View>
              </Pressable>

              {/* Spacer */}
              <View className="h-4" />

              {/* Logout Button */}
              <Pressable
                onPress={handleSignOut}
                className="flex-row items-center justify-center bg-white border-2 border-[#FECACA] p-6 rounded-[32px] active:bg-[#FEF2F2] transition-colors"
                style={{
                  shadowColor: "#EF4444",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 6,
                }}>
                <View className="bg-[#FEF2F2] p-2 rounded-xl mr-3">
                  <MaterialIcons name="logout" size={28} color="#DC2626" />
                </View>
                <ThemedText className="text-[#DC2626] font-black text-[20px] tracking-wide">Sign Out</ThemedText>
              </Pressable>
            </Animatable.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
