import { Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View className="flex-1 px-6 pt-12">
      <Text className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Explore</Text>
      <Text className="text-base leading-6 opacity-80 mb-6 text-gray-700 dark:text-gray-300">
        Add new screens, navigation, and features here.
      </Text>
      <View className="flex-1 rounded-xl bg-gray-200 dark:bg-white/10 items-center justify-center">
        <Text className="text-base opacity-60 text-gray-600 dark:text-gray-400">Your content goes here</Text>
      </View>
    </View>
  );
}
