import { useAuth } from "@/auth/SessionProvider";
import { ThemedText } from "@/components/themed-text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error, requiresEmailConfirmation, alreadyRegistered } = await signUp(email, password, {
      fullName,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Signup Failed", error.message);
    } else if (alreadyRegistered) {
      Alert.alert("Account exists", "This email is already registered. Please sign in instead.", [
        {
          text: "Go to login",
          onPress: () => router.replace("/login"),
        },
      ]);
    } else if (requiresEmailConfirmation) {
      Alert.alert(
        "Verify your email",
        "Account created. Open the confirmation link from your email to finish sign-in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="flex-1 bg-[#F1F5F9]">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: "height", web: undefined })}
        className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 pt-16 pb-32"
          keyboardShouldPersistTaps="handled">
          <View className="w-full max-w-[460px] self-center">
            {/* Header */}
            <Animatable.View animation="fadeInDown" duration={800} style={{ marginBottom: 40, alignItems: "center" }}>
              <View
                className="w-20 h-20 bg-white rounded-[24px] items-center justify-center border-2 border-indigo-100 mb-5"
                style={{
                  shadowColor: "#3B82F6",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 12,
                }}>
                <MaterialIcons name="person-add-alt-1" size={40} color="#2563EB" />
              </View>
              <ThemedText className="text-[38px] font-black text-[#0F172A] tracking-tight">Create Account</ThemedText>
              <ThemedText className="text-[#475569] text-[18px] mt-2 font-semibold text-center">
                Start your ElderLink care circle
              </ThemedText>
            </Animatable.View>

            {/* Form Panel */}
            <Animatable.View
              animation="fadeInUp"
              delay={200}
              duration={800}
              style={{
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.08,
                shadowRadius: 32,
                elevation: 20,
              }}>
              <View className="bg-[#FFFFFF] rounded-[36px] p-8 border-[1.5px] border-gray-200" style={{ gap: 24 }}>
                <View style={{ gap: 10 }}>
                  <ThemedText className="text-[#334155] font-bold text-[16px] ml-1 uppercase tracking-wider">
                    Full Name
                  </ThemedText>
                  <TextInput
                    className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[24px] h-[64px] px-6 text-[#0F172A] text-[18px] font-medium"
                    placeholder="John Doe"
                    placeholderTextColor="#94A3B8"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    autoComplete="name"
                    editable={!loading}
                  />
                </View>

                <View style={{ gap: 10 }}>
                  <ThemedText className="text-[#334155] font-bold text-[16px] ml-1 uppercase tracking-wider">
                    Email Address
                  </ThemedText>
                  <TextInput
                    className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[24px] h-[64px] px-6 text-[#0F172A] text-[18px] font-medium"
                    placeholder="name@email.com"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>

                <View style={{ gap: 10 }}>
                  <ThemedText className="text-[#334155] font-bold text-[16px] ml-1 uppercase tracking-wider">
                    Password
                  </ThemedText>
                  <TextInput
                    className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[24px] h-[64px] px-6 text-[#0F172A] text-[18px] font-medium"
                    placeholder="At least 6 characters"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                    editable={!loading}
                  />
                </View>

                <View style={{ gap: 10 }}>
                  <ThemedText className="text-[#334155] font-bold text-[16px] ml-1 uppercase tracking-wider">
                    Confirm Password
                  </ThemedText>
                  <TextInput
                    className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[24px] h-[64px] px-6 text-[#0F172A] text-[18px] font-medium"
                    placeholder="Re-type password"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                    editable={!loading}
                  />
                </View>

                <Pressable
                  className={`bg-[#2563EB] h-[68px] rounded-[24px] items-center justify-center mt-4 active:scale-95 transition-transform ${loading ? "opacity-70" : ""}`}
                  style={{
                    shadowColor: "#2563EB",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                  onPress={handleSignup}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="large" />
                  ) : (
                    <ThemedText className="text-white text-[22px] font-bold tracking-wide">Create Account</ThemedText>
                  )}
                </Pressable>

                <View className="flex-row justify-center items-center gap-2 mt-4 bg-[#F8FAFC] p-4 rounded-full border border-gray-100">
                  <ThemedText className="text-[#64748B] font-semibold text-[17px]">Already have an account?</ThemedText>
                  <Link href="/login" asChild>
                    <Pressable>
                      <ThemedText className="text-[#2563EB] font-bold text-[18px]">Sign In</ThemedText>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </Animatable.View>

            {/* Hint Card */}
            <Animatable.View
              animation="fadeInUp"
              delay={400}
              duration={800}
              style={{
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.05,
                shadowRadius: 16,
                elevation: 8,
                marginTop: 32,
              }}>
              <View className="bg-white rounded-[28px] p-6 border-l-[6px] border-[#2563EB]">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                    <MaterialIcons name="lightbulb" size={24} color="#2563EB" />
                  </View>
                  <ThemedText className="text-[#1E40AF] font-bold text-[20px]">Elder-friendly Design</ThemedText>
                </View>
                <ThemedText className="text-[#475569] text-[17px] leading-7 font-medium">
                  Buttons are extremely large and inputs have stark high-contrast borders to ensure ultimate
                  readability.
                </ThemedText>
              </View>
            </Animatable.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
