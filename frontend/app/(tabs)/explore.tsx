import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, View } from "react-native";
import { Linking } from "react-native";

import { ThemedText } from "@/components/themed-text";

/**
 * Care section for seniors – quick help, care team, reminders, and resources.
 */

const QUICK_HELP = [
  { label: "Emergency", sublabel: "911", icon: "emergency" as const, tel: "911" },
  { label: "Family", sublabel: "Call loved ones", icon: "family-restroom" as const },
  { label: "Doctor", sublabel: "Primary care", icon: "medical-services" as const },
  { label: "Pharmacy", sublabel: "Prescriptions", icon: "local-pharmacy" as const },
];

const CARE_REMINDERS = [
  { label: "Medication", time: "8:00 AM", icon: "medication" as const },
  { label: "Doctor Visit", time: "Tomorrow 2 PM", icon: "event" as const },
  { label: "Caregiver Check-in", time: "Daily", icon: "person-search" as const },
];

const CARE_RESOURCES = [
  { label: "Fall Prevention Tips", icon: "health-and-safety" as const },
  { label: "Medicare & Benefits", icon: "account-balance" as const },
  { label: "Senior Support Hotline", icon: "support-agent" as const },
  { label: "Meal Delivery Info", icon: "restaurant" as const },
];

export default function CareScreen() {
  const handleEmergency = () => {
    Linking.openURL("tel:911");
  };

  return (
    <View className="flex-1 bg-glass-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-14 pb-32 gap-6"
        showsVerticalScrollIndicator={false}>
        <View>
          <ThemedText className="text-2xl font-bold text-glass-text mb-1">Care</ThemedText>
          <ThemedText className="text-base text-glass-muted">
            Your care team, reminders, and quick help
          </ThemedText>
        </View>

        {/* Quick Help */}
        <View>
          <ThemedText className="text-lg font-bold text-glass-text mb-4">Quick Help</ThemedText>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {QUICK_HELP.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.tel ? handleEmergency : undefined}
                className="w-[48%] bg-glass-card border border-glass-border rounded-[20px] p-4 flex-row items-center gap-3 active:opacity-90">
                <View className="w-12 h-12 rounded-full bg-glass-cyan/20 items-center justify-center">
                  <MaterialIcons
                    name={item.icon}
                    size={26}
                    color={item.label === "Emergency" ? "#FB7185" : "#22D3EE"}
                  />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-glass-text font-bold text-[16px]">
                    {item.label}
                  </ThemedText>
                  <ThemedText className="text-glass-muted text-sm">{item.sublabel}</ThemedText>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Care Reminders */}
        <View>
          <ThemedText className="text-lg font-bold text-glass-text mb-4">Care Reminders</ThemedText>
          <View className="gap-3">
            {CARE_REMINDERS.map((item) => (
              <View
                key={item.label}
                className="bg-glass-card border border-glass-border rounded-[18px] p-4 flex-row items-center gap-4">
                <MaterialIcons name={item.icon} size={28} color="#22D3EE" />
                <View className="flex-1">
                  <ThemedText className="text-glass-text font-semibold text-[17px]">
                    {item.label}
                  </ThemedText>
                  <ThemedText className="text-glass-muted text-sm mt-0.5">{item.time}</ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </View>
            ))}
          </View>
        </View>

        {/* My Care Team */}
        <View>
          <ThemedText className="text-lg font-bold text-glass-text mb-4">My Care Team</ThemedText>
          <View className="bg-glass-card border border-glass-border rounded-[20px] p-4 gap-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-glass-cyan/20 items-center justify-center">
                <MaterialIcons name="medical-information" size={22} color="#22D3EE" />
              </View>
              <View>
                <ThemedText className="text-glass-text font-semibold">Primary Doctor</ThemedText>
                <ThemedText className="text-glass-muted text-sm">Dr. Smith — (555) 123-4567</ThemedText>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-glass-cyan/20 items-center justify-center">
                <MaterialIcons name="face" size={22} color="#22D3EE" />
              </View>
              <View>
                <ThemedText className="text-glass-text font-semibold">Caregiver</ThemedText>
                <ThemedText className="text-glass-muted text-sm">Sarah — Check-ins daily</ThemedText>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-glass-cyan/20 items-center justify-center">
                <MaterialIcons name="groups" size={22} color="#22D3EE" />
              </View>
              <View>
                <ThemedText className="text-glass-text font-semibold">Family Contact</ThemedText>
                <ThemedText className="text-glass-muted text-sm">Available for calls & visits</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Care Resources */}
        <View>
          <ThemedText className="text-lg font-bold text-glass-text mb-4">
            Care Resources
          </ThemedText>
          <View className="gap-3">
            {CARE_RESOURCES.map((item) => (
              <Pressable
                key={item.label}
                className="bg-glass-card border border-glass-border rounded-[18px] p-4 flex-row items-center gap-4 active:opacity-90">
                <MaterialIcons name={item.icon} size={26} color="#22D3EE" />
                <ThemedText className="flex-1 text-glass-text font-semibold text-[16px]">
                  {item.label}
                </ThemedText>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Need Help Banner */}
        <View className="bg-glass-coral/15 border border-glass-coral/40 rounded-[24px] p-5">
          <View className="flex-row items-center gap-3 mb-2">
            <MaterialIcons name="support" size={28} color="#FB7185" />
            <ThemedText className="text-glass-text font-bold text-lg">Need help?</ThemedText>
          </View>
          <ThemedText className="text-glass-muted text-[15px] leading-6">
            If you feel unwell or need assistance, tap Emergency above or call your caregiver. You're
            not alone.
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}
