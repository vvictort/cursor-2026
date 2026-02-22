import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Tab routes and their display names for announcements.
 * Matches the nav bar: Dashboard, My Health, Care, Browse.
 */
const TAB_ROUTES: { route: string; displayName: string; phrases: string[] }[] = [
  {
    route: '/(tabs)/dashboard',
    displayName: 'Dashboard',
    phrases: ['dashboard', 'home'],
  },
  {
    route: '/(tabs)',
    displayName: 'My Health',
    phrases: ['health', 'my health', 'index'],
  },
  {
    route: '/(tabs)/explore',
    displayName: 'Care',
    phrases: ['care', 'explore'],
  },
  {
    route: '/(tabs)/browse',
    displayName: 'Browse',
    phrases: ['browse'],
  },
];

function normalizeTranscript(text: string): string {
  return text.trim().toLowerCase().replace(/[.!?]/g, '');
}

function matchTabFromTranscript(transcript: string): { route: string; displayName: string } | null {
  const normalized = normalizeTranscript(transcript);

  // Multi-word phrases first (e.g. "my health", "go to dashboard")
  for (const { route, displayName, phrases } of TAB_ROUTES) {
    for (const phrase of phrases) {
      if (phrase.includes(' ')) {
        if (normalized.includes(phrase)) return { route, displayName };
      } else {
        const patterns = [
          new RegExp(`(?:go to|open|switch to|navigate to)\\s+${phrase}\\b`),
          new RegExp(`\\b${phrase}\\s+tab`),
          new RegExp(`^${phrase}$`),
          new RegExp(`\\b${phrase}\\b`),
        ];
        for (const pattern of patterns) {
          if (pattern.test(normalized)) return { route, displayName };
        }
      }
    }
  }

  // Single-word match from transcript words
  const words = normalized.split(/\s+/);
  for (const word of words) {
    for (const { route, displayName, phrases } of TAB_ROUTES) {
      if (phrases.includes(word)) return { route, displayName };
    }
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
        const match = matchTabFromTranscript(transcript);
        if (match) {
          navigatedRef.current = true;
          router.replace(match.route as never);
          announceForAccessibility(`Navigated to ${match.displayName}`);
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
      // Use abort() for immediate toggle-off; stop() waits for final result
      ExpoSpeechRecognitionModule.abort();
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
