import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { useAuth } from "@/auth/SessionProvider";
import { HapticTab } from "@/components/haptic-tab";
import { ThemedText } from "@/components/themed-text";

export default function TabLayout() {
  const { user } = useAuth();
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0EA5E9", // bright sky blue
        tabBarInactiveTintColor: "#64748B", // slate gray
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="dashboard" // The route might be index for Dashboard or dashboard? Wait, index.tsx is 'My Health'. dashboard.tsx is widgets.
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "My Health",
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="monitor-heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Care",
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="volunteer-activism" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => {
            return (
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: focused ? "#2563EB" : "#F1F5F9",
                  borderColor: color,
                  borderWidth: focused ? 2 : 1,
                }}>
                <ThemedText style={{ color: focused ? "#FFFFFF" : "#64748B", fontSize: 14, fontWeight: "bold" }}>
                  {initial}
                </ThemedText>
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
}
