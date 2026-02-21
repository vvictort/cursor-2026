import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 px-6 pt-12">
      <Text className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Welcome</Text>
      <Text className="text-base leading-6 opacity-80 mb-6 text-gray-700 dark:text-gray-300">
        Your React Native app is ready. Edit the screens in{' '}
        <Text className="font-mono">app/(tabs)/</Text> to get started.
      </Text>
      <View className="p-5 rounded-xl bg-sky-50 dark:bg-white/10">
        <Text className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Built with</Text>
        <Text className="text-sm leading-6 opacity-90 text-gray-700 dark:text-gray-300">• Expo & React Native</Text>
        <Text className="text-sm leading-6 opacity-90 text-gray-700 dark:text-gray-300">• Expo Router (file-based routing)</Text>
        <Text className="text-sm leading-6 opacity-90 text-gray-700 dark:text-gray-300">• NativeWind (Tailwind CSS)</Text>
        <Text className="text-sm leading-6 opacity-90 text-gray-700 dark:text-gray-300">• TypeScript</Text>
      </View>
    </View>
  );
}
