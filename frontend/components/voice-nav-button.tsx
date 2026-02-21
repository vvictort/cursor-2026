import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useVoiceNavigation } from '@/hooks/use-voice-navigation';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const TAB_BAR_HEIGHT = 56;
const BUTTON_SIZE = 56;
const FLOATING_OFFSET = 12;

/**
 * Floating microphone button positioned above the bottom tab bar.
 * Activates voice input for tab navigation via phrases like "Go to Home", "Open Explore", "Dashboard tab".
 *
 * Accessibility props:
 * - accessibilityRole="button": Announces as a button to screen readers (TalkBack/VoiceOver).
 * - accessibilityLabel: Short label read when the element is focused.
 * - accessibilityHint: Additional context read after the label, guiding the user on what the button does.
 */
export function VoiceNavButton() {
  const colorScheme = useColorScheme();
  const { isListening, startListening, stopListening } = useVoiceNavigation();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View
      style={[styles.container, { bottom: TAB_BAR_HEIGHT + FLOATING_OFFSET }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.tint,
            opacity: pressed ? 0.9 : 1,
            borderColor: colors.background,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Voice navigation"
        accessibilityHint="Use your voice to change tabs. Say phrases like 'Go to Home' or 'Open Explore'."
        accessibilityState={{ expanded: isListening }}
      >
        <IconSymbol
          name="mic.fill"
          size={28}
          color={colors.background}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // Elevation/shadow for visibility above content
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
