import { Tabs } from "expo-router";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#22D3EE", // glass-cyan
        tabBarInactiveTintColor: "#94A3B8", // glass-muted
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#0B1120", // glass-bg
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          elevation: 0,
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
        name="browse" // Assuming browse doesn't exist, we can just point to a placeholder or add it if needed
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="grid-view" color={color} />,
        }}
      />
    </Tabs>
  );
}
