import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, router } from 'expo-router';

import { useAuth } from '@/auth/SessionProvider';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Glass, type ThemeMode, getGlassCardStyle } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const colorScheme = useColorScheme();
  const mode = (colorScheme ?? 'light') as ThemeMode;
  const colors = Colors[mode];
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const panelStyle = useMemo(() => getGlassCardStyle(mode, 'strong'), [mode]);
  const hintCardStyle = useMemo(() => getGlassCardStyle(mode, 'regular'), [mode]);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error, requiresEmailConfirmation, alreadyRegistered } = await signUp(email, password, {
      fullName,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else if (alreadyRegistered) {
      Alert.alert('Account exists', 'This email is already registered. Please sign in instead.', [
        {
          text: 'Go to login',
          onPress: () => router.replace('/login'),
        },
      ]);
    } else if (requiresEmailConfirmation) {
      Alert.alert(
        'Verify your email',
        'Account created. Open the confirmation link from your email to finish sign-in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <View style={[styles.orbTop, { backgroundColor: colors.gradientTop }]} />
      <View style={[styles.orbMiddle, { backgroundColor: colors.gradientMid }]} />
      <View style={[styles.orbBottom, { backgroundColor: colors.gradientBottom }]} />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height', web: undefined })}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.stack, isWide && styles.stackWide]}>
            <View style={[styles.panel, panelStyle]}>
              <View style={[styles.badge, { backgroundColor: colors.glassSurfaceStrong }]}>
                <MaterialIcons name="favorite" size={22} color={colors.tint} />
              </View>
              <ThemedText
                type="title"
                style={[
                  styles.title,
                  {
                    fontFamily: Fonts.rounded,
                  },
                ]}
              >
                Elder Signup
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Create your care account and invite loved ones from the dashboard.
              </ThemedText>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.glassBorder,
                    backgroundColor: colors.inputBackground,
                  },
                ]}
                placeholder="Full Name (optional)"
                placeholderTextColor={colors.icon}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoComplete="name"
                editable={!loading}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.glassBorder,
                    backgroundColor: colors.inputBackground,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={colors.icon}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!loading}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.glassBorder,
                    backgroundColor: colors.inputBackground,
                  },
                ]}
                placeholder="Password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!loading}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.glassBorder,
                    backgroundColor: colors.inputBackground,
                  },
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={colors.icon}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!loading}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: colors.tint,
                    opacity: loading ? 0.74 : pressed ? 0.9 : 1,
                  },
                ]}
                onPress={handleSignup}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Create elder account"
              >
                {loading ? (
                  <View style={styles.loadingWrap}>
                    <ActivityIndicator color="#fff" />
                    <ThemedText style={styles.primaryButtonText}>Creating account...</ThemedText>
                  </View>
                ) : (
                  <ThemedText style={styles.primaryButtonText}>Create Elder Account</ThemedText>
                )}
              </Pressable>

              <View style={styles.footer}>
                <ThemedText style={styles.footerText}>Already have an account?</ThemedText>
                <Link href="/login" asChild>
                  <Pressable hitSlop={6}>
                    <ThemedText type="link" style={styles.footerLink}>
                      Sign In
                    </ThemedText>
                  </Pressable>
                </Link>
              </View>
            </View>

            <View style={[styles.hintCard, hintCardStyle, isWide && styles.hintCardWide]}>
              <ThemedText type="defaultSemiBold">Elder-friendly notes</ThemedText>
              <ThemedText style={styles.hintText}>
                Buttons are large and feedback is explicit to avoid uncertainty after tapping.
                Text and spacing are intentionally generous for readability.
              </ThemedText>
              <ThemedText style={styles.hintText}>
                Your account is created as an elder profile. In Dashboard, add loved-one emails or
                names and manage your care circle.
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  orbTop: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 999,
    top: -120,
    right: -80,
    opacity: 0.2,
  },
  orbMiddle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    top: 220,
    left: -100,
    opacity: 0.14,
  },
  orbBottom: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 999,
    bottom: -140,
    left: 30,
    opacity: 0.16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 14,
  },
  stack: {
    width: '100%',
    gap: 14,
    alignItems: 'center',
  },
  stackWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 460,
    padding: 20,
    gap: 12,
    flex: 1.55,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: Glass.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: Glass.borderWidth.thin,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  title: {
    textAlign: 'center',
    fontSize: 34,
    lineHeight: 38,
    marginTop: 2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.82,
    marginBottom: 4,
  },
  input: {
    height: 56,
    borderWidth: Glass.borderWidth.regular,
    borderRadius: Glass.radius.input,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  primaryButton: {
    height: 56,
    borderRadius: Glass.radius.input,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  footerText: {
    fontSize: 15,
    opacity: 0.86,
  },
  footerLink: {
    fontSize: 15,
    lineHeight: 22,
  },
  hintCard: {
    width: '100%',
    maxWidth: 460,
    padding: 16,
    gap: 8,
  },
  hintCardWide: {
    maxWidth: 320,
    flex: 1,
  },
  hintText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.88,
  },
});
