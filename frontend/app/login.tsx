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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
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
          <View className="w-full max-w-[400px] self-center">
            {/* Logo */}
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
                <MaterialIcons name="lock" size={40} color="#2563EB" />
              </View>
              <ThemedText className="text-[38px] font-black text-[#0F172A] tracking-tight">Welcome Back</ThemedText>
              <ThemedText className="text-[#475569] text-[18px] mt-2 font-semibold text-center">
                Sign in to your care circle
              </ThemedText>
            </Animatable.View>

            {/* Form */}
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
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
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
                  onPress={handleLogin}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="large" />
                  ) : (
                    <ThemedText className="text-white text-[22px] font-bold tracking-wide">Sign In</ThemedText>
                  )}
                </Pressable>

                <View className="flex-row justify-center items-center gap-2 mt-4 bg-[#F8FAFC] p-4 rounded-full border border-gray-100">
                  <ThemedText className="text-[#64748B] font-semibold text-[17px]">
                    Don&apos;t have an account?
                  </ThemedText>
                  <Link href="/signup" asChild>
                    <Pressable>
                      <ThemedText className="text-[#2563EB] font-bold text-[18px]">Sign Up</ThemedText>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </Animatable.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
