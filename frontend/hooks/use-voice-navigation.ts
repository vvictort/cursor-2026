import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Maps voice command phrases (normalized lowercase) to tab route paths.
 * Supports variations: "go to X", "open X", "X tab", "X".
 */
const VOICE_TO_TAB: Record<string, string> = {
  home: '/(tabs)',
  explore: '/(tabs)/explore',
  dashboard: '/(tabs)/dashboard',
  settings: '/(tabs)/dashboard', // Map to dashboard if no dedicated settings tab
  profile: '/(tabs)/dashboard', // Map to dashboard if no dedicated profile tab
};

/** Phrases to match for each tab (first match wins) */
const TAB_PHRASES = [
  { keys: ['home'], route: '/(tabs)' },
  { keys: ['explore'], route: '/(tabs)/explore' },
  { keys: ['dashboard', 'settings', 'profile'], route: '/(tabs)/dashboard' },
];

function normalizeTranscript(text: string): string {
  return text.trim().toLowerCase().replace(/[.!?]/g, '');
}

function matchTabFromTranscript(transcript: string): string | null {
  const normalized = normalizeTranscript(transcript);
  // Check for "go to X", "open X", "X tab" patterns
  const patterns = [
    /(?:go to|open|switch to|navigate to)\s+(\w+)/,
    /(\w+)\s+tab/,
    /^(\w+)$/,
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      const word = match[1];
      for (const { keys, route } of TAB_PHRASES) {
        if (keys.includes(word)) return route;
      }
    }
  }
  // Direct word match
  const words = normalized.split(/\s+/);
  for (const word of words) {
    const route = VOICE_TO_TAB[word];
    if (route) return route;
  }
  return null;
}

function announceForAccessibility(message: string): void {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

export function useVoiceNavigation() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const navigatedRef = useRef(false);

  // Check availability on mount (handles native module not linked, web, etc.)
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        // On web, isRecognitionAvailable is sync; on native it exists on the module
        const available =
          typeof ExpoSpeechRecognitionModule?.isRecognitionAvailable ===
          'function'
            ? ExpoSpeechRecognitionModule.isRecognitionAvailable()
            : false;
        if (mounted) setIsAvailable(available);
      } catch {
        if (mounted) setIsAvailable(false);
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle speech result – navigate if we detect a tab name
  useSpeechRecognitionEvent(
    'result',
    useCallback(
      (event: { isFinal: boolean; results: { transcript: string }[] }) => {
        if (!event.isFinal || navigatedRef.current) return;
        const transcript = event.results?.[0]?.transcript ?? '';
        if (!transcript) return;
        const route = matchTabFromTranscript(transcript);
        if (route) {
          navigatedRef.current = true;
          router.replace(route as never);
          const tabName = route === '/(tabs)' ? 'Home' : route.split('/').pop() ?? '';
          announceForAccessibility(`Navigated to ${tabName}`);
        }
      },
      [router]
    )
  );

  // Handle errors – announce fallback for permission/unavailable
  useSpeechRecognitionEvent(
    'error',
    useCallback((event: { error: string; message: string }) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return;
      const msg =
        event.error === 'not-allowed'
          ? 'Microphone permission is required for voice navigation.'
          : event.error === 'service-not-allowed' ||
              event.error === 'language-not-supported'
            ? 'Speech recognition is not available on this device.'
            : 'Voice recognition failed. Please try again.';
      announceForAccessibility(msg);
    }, [])
  );

  // Reset navigated flag when recognition ends
  useSpeechRecognitionEvent('end', () => {
    navigatedRef.current = false;
    setIsListening(false);
  });

  useSpeechRecognitionEvent('start', () => setIsListening(true));

  const startListening = useCallback(async () => {
    if (isAvailable === false) {
      announceForAccessibility(
        'Speech recognition is not available. Please check permissions or device support.'
      );
      return;
    }
    try {
      const { granted } =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) {
        announceForAccessibility(
          'Microphone permission is required for voice navigation. Please enable it in settings.'
        );
        return;
      }
      navigatedRef.current = false;
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: false,
        continuous: false,
      });
    } catch {
      announceForAccessibility(
        'Could not start voice recognition. Please check permissions.'
      );
    }
  }, [isAvailable]);

  const stopListening = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      // ignore
    }
  }, []);

  return {
    isAvailable: isAvailable ?? false,
    isListening,
    startListening,
    stopListening,
  };
}
