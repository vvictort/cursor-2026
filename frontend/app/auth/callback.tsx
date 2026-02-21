import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { type EmailOtpType } from '@supabase/supabase-js';

import { supabase } from '@/auth/supabase';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type CallbackParams = {
  code?: string | string[];
  token_hash?: string | string[];
  type?: string | string[];
  access_token?: string | string[];
  refresh_token?: string | string[];
  error?: string | string[];
  error_description?: string | string[];
};

const asSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const decodeMessage = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseHashTokens = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }

  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) {
    return { accessToken: null, refreshToken: null };
  }

  const params = new URLSearchParams(hash);
  return {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token'),
  };
};

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<CallbackParams>();
  const [statusText, setStatusText] = useState('Completing sign-in...');
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const finishSignIn = async () => {
      const authError = asSingleValue(params.error_description) ?? asSingleValue(params.error);
      if (authError) {
        setErrorText(decodeMessage(authError));
        return;
      }

      const code = asSingleValue(params.code);
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!isCancelled) setErrorText(error.message);
          return;
        }

        if (!isCancelled) router.replace('/(tabs)');
        return;
      }

      const tokenHash = asSingleValue(params.token_hash);
      const otpType = asSingleValue(params.type);
      if (tokenHash && otpType) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType as EmailOtpType,
        });

        if (error) {
          if (!isCancelled) setErrorText(error.message);
          return;
        }

        if (!isCancelled) router.replace('/(tabs)');
        return;
      }

      let accessToken = asSingleValue(params.access_token);
      let refreshToken = asSingleValue(params.refresh_token);

      if (!accessToken || !refreshToken) {
        const hashTokens = parseHashTokens();
        accessToken ??= hashTokens.accessToken ?? undefined;
        refreshToken ??= hashTokens.refreshToken ?? undefined;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          if (!isCancelled) setErrorText(error.message);
          return;
        }

        if (!isCancelled) router.replace('/(tabs)');
        return;
      }

      setStatusText('Checking session...');
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        if (!isCancelled) router.replace('/(tabs)');
        return;
      }

      if (!isCancelled) {
        setErrorText('Could not complete authentication callback. Please sign in again.');
      }
    };

    void finishSignIn();

    return () => {
      isCancelled = true;
    };
  }, [
    params.access_token,
    params.code,
    params.error,
    params.error_description,
    params.refresh_token,
    params.token_hash,
    params.type,
  ]);

  return (
    <ThemedView style={styles.container}>
      {errorText ? (
        <>
          <ThemedText type="title" style={styles.title}>
            Sign-in error
          </ThemedText>
          <ThemedText style={styles.message}>{errorText}</ThemedText>
          <ThemedText type="link" onPress={() => router.replace('/login')}>
            Back to login
          </ThemedText>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.message}>{statusText}</ThemedText>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});
