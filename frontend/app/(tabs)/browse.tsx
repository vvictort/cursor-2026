import { Image } from "expo-image";
import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

/**
 * Mock activity cards for elderly users – combat boredom and social isolation.
 * Uses placeholder images from Unsplash (free, no attribution required for mock use).
 */
const BROWSE_ACTIVITIES = [
  {
    id: "1",
    title: "Video Calls",
    subtitle: "Stay connected with family & friends",
    imageUri: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
  },
  {
    id: "2",
    title: "Gardening",
    subtitle: "Grow something beautiful together",
    imageUri: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80",
  },
  {
    id: "3",
    title: "Book Club",
    subtitle: "Join a virtual reading group",
    imageUri: "https://images.unsplash.com/photo-1481627834876-b7833e8e5574?w=400&q=80",
  },
  {
    id: "4",
    title: "Puzzles & Games",
    subtitle: "Keep your mind sharp",
    imageUri: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
  },
  {
    id: "5",
    title: "Gentle Walks",
    subtitle: "Explore your neighborhood",
    imageUri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    id: "6",
    title: "Craft Circle",
    subtitle: "Knit, paint, create together",
    imageUri: "https://images.unsplash.com/photo-1513542789411-b6d5b1c234b8?w=400&q=80",
  },
  {
    id: "7",
    title: "Music & Memories",
    subtitle: "Listen to your favorites",
    imageUri: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
  },
  {
    id: "8",
    title: "Pet Companions",
    subtitle: "Connect with furry friends",
    imageUri: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80",
  },
  {
    id: "9",
    title: "Local Meetups",
    subtitle: "Find community events nearby",
    imageUri: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
  },
];

export default function BrowseScreen() {
  return (
    <View className="flex-1 bg-glass-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-14 pb-32"
        showsVerticalScrollIndicator={false}>
        <ThemedText className="text-2xl font-bold text-glass-text mb-1">Browse</ThemedText>
        <ThemedText className="text-base text-glass-muted mb-6">
          Discover activities to stay engaged and connected
        </ThemedText>

        <View className="flex-row flex-wrap justify-between gap-y-4">
          {BROWSE_ACTIVITIES.map((item) => (
            <View
              key={item.id}
              className="w-[48%] rounded-[24px] overflow-hidden border border-glass-border bg-glass-card">
              <Image
                source={{ uri: item.imageUri }}
                className="w-full h-36 bg-white/5"
                contentFit="cover"
                transition={200}
              />
              <View className="p-4">
                <ThemedText className="text-glass-text font-bold text-[17px] mb-1">
                  {item.title}
                </ThemedText>
                <ThemedText className="text-glass-muted text-sm leading-5">
                  {item.subtitle}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
