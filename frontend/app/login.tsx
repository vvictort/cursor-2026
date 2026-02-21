import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/auth/SessionProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Senior-friendly warm colour palette: easy to see, inviting.
 * - Warm creams and ivories
 * - Warm brown text (not cold black)
 * - Terracotta/coral accent
 */
const SENIOR_COLORS = {
  light: {
    background: '#FFFBF7',
    cardBackground: '#FFF5EB',
    text: '#3d3632',
    textSecondary: '#5c524c',
    label: '#4a4039',
    border: '#8b7355',
    placeholder: '#7d6e5c',
    primary: '#c75b39',
    primaryText: '#FFFFFF',
    link: '#a64a2e',
  },
  dark: {
    background: '#2d2622',
    cardBackground: '#3d3632',
    text: '#f5ebe0',
    textSecondary: '#e8ddd2',
    label: '#f0e6da',
    border: '#9d8b7a',
    placeholder: '#b5a698',
    primary: '#e07c5b',
    primaryText: '#FFFFFF',
    link: '#e8a08a',
  },
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const colorScheme = useColorScheme();
  const colors = SENIOR_COLORS[colorScheme ?? 'light'];

  const showError = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showError('Error', 'Please fill in your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      showError('Login Failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: 'height', web: undefined })}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {/* Large, clear heading */}
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Welcome
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue
          </ThemedText>

          {/* Label above input - easier for seniors than placeholders alone */}
          <ThemedText style={[styles.label, { color: colors.label }]}>
            Email address
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="e.g. you@example.com"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
            accessible
            accessibilityLabel="Email address"
            accessibilityHint="Enter your email address"
          />

          <ThemedText style={[styles.label, { color: colors.label }]}>
            Password
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="Enter your password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            editable={!loading}
            accessible
            accessibilityLabel="Password"
            accessibilityHint="Enter your password"
          />

          {/* Large, high-contrast Sign In button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryText} size="large" />
            ) : (
              <ThemedText style={[styles.buttonText, { color: colors.primaryText }]}>
                Sign In
              </ThemedText>
            )}
          </TouchableOpacity>

          {/* Clear sign-up option */}
          <View style={styles.footer}>
            <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
              Don&apos;t have an account?{' '}
            </ThemedText>
            <Link href="/signup" asChild>
              <TouchableOpacity hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}>
                <ThemedText style={[styles.linkText, { color: colors.link }]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 32,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // Large, readable title (36px)
  title: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 8,
  },
  // Clear subtitle (22px)
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 32,
  },
  // Visible labels above inputs (20px)
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  // Large input fields (20px text, 60px height, 3px border)
  input: {
    height: 60,
    borderWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
    fontSize: 20,
    lineHeight: 28,
  },
  // Large touch target for button (60px)
  button: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 4,
  },
  footerText: {
    fontSize: 20,
    lineHeight: 28,
  },
  linkText: {
    fontSize: 20,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
