import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Tab button with haptic feedback.
 *
 * Accessibility props (required for screen readers):
 * - accessibilityRole="tab": Announces each item as a tab so users can navigate between tabs.
 * - accessibilityState.selected: Tells TalkBack/VoiceOver which tab is active;
 *   without this, users cannot tell which tab they are on.
 */
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: props.accessibilityState?.selected ?? props.focused }}
      onPressIn={(ev) => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
