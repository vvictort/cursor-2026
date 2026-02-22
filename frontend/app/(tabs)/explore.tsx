import { useAuth } from "@/auth/SessionProvider";
import { supabase } from "@/auth/supabase";
import { ThemedText } from "@/components/themed-text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

export default function CareScreen() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelationship, setNewRelationship] = useState("");
  const [addingLoader, setAddingLoader] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchConnections();
    }
  }, [user?.id]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("connections")
        .select("*")
        .eq("elder_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newName || !newRelationship || (!newEmail && !newPhone)) {
      Alert.alert("Missing Info", "Please provide a name, relationship, and at least an email or phone number.");
      return;
    }

    setAddingLoader(true);
    try {
      const { error } = await supabase.from("connections").insert({
        elder_id: user?.id,
        loved_one_name: newName,
        invite_email: newEmail || null,
        phone_number: newPhone || null,
        relationship: newRelationship,
        status: "accepted", // Auto-accepting for demo
      });

      if (error) throw error;

      // Reset and fetch
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewRelationship("");
      setAddModalVisible(false);
      fetchConnections();
    } catch (error: any) {
      Alert.alert("Error adding member", error.message);
    } finally {
      setAddingLoader(false);
    }
  };

  const handleCall = (phone?: string | null) => {
    if (!phone) {
      Alert.alert("No phone number", "This connection does not have a phone number on file.");
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Action not supported", "Could not open dialer on this device.");
    });
  };

  return (
    <View className="flex-1 bg-[#F1F5F9]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="w-full items-center">
          <View className="w-full max-w-[600px] px-6 pt-16">
            {/* Header & Add Button */}
            <Animatable.View
              animation="fadeInDown"
              duration={800}
              className="mb-8 pl-1 flex-row justify-between items-start">
              <View className="flex-1">
                <ThemedText className="text-[34px] font-black text-[#0F172A] tracking-tight">Care Circle</ThemedText>
                <ThemedText className="text-[#475569] text-[18px] font-bold mt-2 leading-[24px]">
                  Connect with your support team.
                </ThemedText>
              </View>
              <Pressable
                onPress={() => setAddModalVisible(true)}
                className="w-14 h-14 bg-[#2563EB] rounded-[18px] items-center justify-center border-2 border-white ml-2"
                style={{
                  shadowColor: "#2563EB",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                <MaterialIcons name="person-add" size={28} color="#FFFFFF" />
              </Pressable>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={200} duration={800} className="gap-5">
              {loading ? (
                <ActivityIndicator size="large" color="#2563EB" className="my-10" />
              ) : connections.length === 0 ? (
                <View className="bg-white p-8 rounded-[32px] items-center border-[1.5px] border-[#E2E8F0] border-dashed">
                  <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-4">
                    <MaterialIcons name="groups" size={40} color="#94A3B8" />
                  </View>
                  <ThemedText className="text-[#334155] font-black text-[22px] text-center mb-2">
                    No Connections Yet
                  </ThemedText>
                  <ThemedText className="text-[#64748B] text-[16px] text-center mb-6">
                    Tap the plus button above to add a loved one or doctor to your Care Circle.
                  </ThemedText>
                </View>
              ) : (
                connections.map((conn, idx) => {
                  // Determine icon based on relationship hints
                  const isDoctor =
                    conn.relationship?.toLowerCase().includes("doctor") ||
                    conn.relationship?.toLowerCase().includes("doc") ||
                    conn.relationship?.toLowerCase().includes("cardio");

                  return (
                    <Pressable
                      key={conn.id}
                      onPress={() => handleCall(conn.phone_number)}
                      className="flex-row items-center justify-between bg-white border-[1.5px] border-[#E2E8F0] p-5 rounded-[32px] active:scale-[0.98] transition-transform"
                      style={{
                        shadowColor: "#0F172A",
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.08,
                        shadowRadius: 24,
                        elevation: 12,
                      }}>
                      <View className="flex-row items-center flex-1 pr-2" style={{ gap: 16 }}>
                        <View
                          className={`w-16 h-16 rounded-full items-center justify-center border-[1.5px] shrink-0 ${isDoctor ? "bg-[#FFF7ED] border-[#FED7AA]" : "bg-[#EFF6FF] border-[#BFDBFE]"}`}>
                          <MaterialIcons
                            name={isDoctor ? "face" : "person"}
                            size={36}
                            color={isDoctor ? "#EA580C" : "#2563EB"}
                          />
                        </View>
                        <View className="flex-1">
                          <ThemedText
                            className="text-[#0F172A] font-black text-[20px] tracking-tight"
                            numberOfLines={1}>
                            {conn.loved_one_name || "Unknown Name"}
                          </ThemedText>
                          <ThemedText className="text-[#64748B] font-bold text-[15px] mt-1" numberOfLines={1}>
                            {conn.relationship || "Contact"}
                          </ThemedText>
                        </View>
                      </View>
                      <View className="w-14 h-14 rounded-full bg-[#F0FDF4] items-center justify-center border-2 border-[#16A34A] elevation-sm">
                        <MaterialIcons name="call" size={30} color="#16A34A" />
                      </View>
                    </Pressable>
                  );
                })
              )}

              {/* Emergency Services */}
              <Pressable
                onPress={() => Linking.openURL(`tel:911`).catch(() => Alert.alert("Emergency", "Dialing 911..."))}
                className="flex-row items-center justify-between bg-[#FEF2F2] border-[2px] border-[#FECACA] p-6 rounded-[32px] active:scale-[0.98] transition-transform mt-5"
                style={{
                  shadowColor: "#EF4444",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 10,
                }}>
                <View className="flex-row items-center flex-1 pr-2" style={{ gap: 16 }}>
                  <View className="w-16 h-16 rounded-[20px] bg-white items-center justify-center border-[1.5px] border-[#FCA5A5] elevation-sm shrink-0">
                    <MaterialIcons name="local-hospital" size={36} color="#DC2626" />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="text-[#7F1D1D] font-black text-[22px] tracking-tight" numberOfLines={1}>
                      Emergency
                    </ThemedText>
                    <ThemedText
                      className="text-[#B91C1C] font-bold text-[16px] mt-1 tracking-wider uppercase"
                      numberOfLines={1}>
                      Dial 911
                    </ThemedText>
                  </View>
                </View>
                <View className="bg-red-600 p-2.5 rounded-full" style={{ elevation: 4 }}>
                  <MaterialIcons name="chevron-right" size={32} color="#FFFFFF" />
                </View>
              </Pressable>
            </Animatable.View>

            {/* Resources */}
            <Animatable.View animation="fadeInUp" delay={400} duration={800} className="mt-10">
              <ThemedText className="text-[24px] font-black text-[#0F172A] mb-5 tracking-tight pl-1">
                Resources
              </ThemedText>
              <View
                className="bg-white rounded-[32px] overflow-hidden border-[1.5px] border-[#E2E8F0]"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.05,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                <Pressable className="flex-row items-center justify-between p-6 border-b-[1.5px] border-[#F1F5F9] active:bg-[#F8FAFC]">
                  <View className="flex-row items-center flex-1 pr-4" style={{ gap: 16 }}>
                    <View className="w-12 h-12 rounded-[16px] bg-[#FAF5FF] border border-[#E9D5FF] items-center justify-center shrink-0">
                      <MaterialIcons name="menu-book" size={26} color="#9333EA" />
                    </View>
                    <ThemedText className="text-[#1E293B] font-black text-[18px] flex-1" numberOfLines={1}>
                      Caregiver Guide
                    </ThemedText>
                  </View>
                  <View className="bg-[#F1F5F9] p-2 rounded-full">
                    <MaterialIcons name="chevron-right" size={26} color="#64748B" />
                  </View>
                </Pressable>

                <Pressable className="flex-row items-center justify-between p-6 active:bg-[#F8FAFC]">
                  <View className="flex-row items-center flex-1 pr-4" style={{ gap: 16 }}>
                    <View className="w-12 h-12 rounded-[16px] bg-[#F0FDF4] border border-[#BBF7D0] items-center justify-center shrink-0">
                      <MaterialIcons name="support-agent" size={26} color="#16A34A" />
                    </View>
                    <ThemedText className="text-[#1E293B] font-black text-[18px] flex-1" numberOfLines={1}>
                      Support Center
                    </ThemedText>
                  </View>
                  <View className="bg-[#F1F5F9] p-2 rounded-full">
                    <MaterialIcons name="chevron-right" size={26} color="#64748B" />
                  </View>
                </Pressable>
              </View>
            </Animatable.View>
          </View>
        </View>
      </ScrollView>

      {/* Add Loved One Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end">
          {/* Backdrop Tap to close */}
          <Pressable className="absolute inset-0 bg-black/40" onPress={() => setAddModalVisible(false)} />

          <View
            className="bg-[#F1F5F9] rounded-t-[40px] px-6 pt-8 pb-12 w-full max-w-[600px] self-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 20,
            }}>
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <ThemedText className="text-[28px] font-black text-[#0F172A] tracking-tight">Add to Circle</ThemedText>
                <ThemedText className="text-[#64748B] text-[16px] font-semibold mt-1">
                  Register a family member or doctor.
                </ThemedText>
              </View>
              <Pressable
                onPress={() => setAddModalVisible(false)}
                className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200">
                <MaterialIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <View className="gap-5">
              <View className="gap-2">
                <ThemedText className="text-[#334155] font-bold text-[15px] uppercase tracking-wider ml-1">
                  Full Name
                </ThemedText>
                <TextInput
                  className="bg-white border-2 border-[#E2E8F0] rounded-[20px] h-[60px] px-5 text-[#0F172A] text-[18px] font-medium"
                  placeholder="e.g. Jane Doe"
                  value={newName}
                  onChangeText={setNewName}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View className="gap-2">
                <ThemedText className="text-[#334155] font-bold text-[15px] uppercase tracking-wider ml-1">
                  Relationship
                </ThemedText>
                <TextInput
                  className="bg-white border-2 border-[#E2E8F0] rounded-[20px] h-[60px] px-5 text-[#0F172A] text-[18px] font-medium"
                  placeholder="e.g. Daughter, Cardiologist"
                  value={newRelationship}
                  onChangeText={setNewRelationship}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View className="gap-2">
                <ThemedText className="text-[#334155] font-bold text-[15px] uppercase tracking-wider ml-1">
                  Phone Number
                </ThemedText>
                <TextInput
                  className="bg-white border-2 border-[#E2E8F0] rounded-[20px] h-[60px] px-5 text-[#0F172A] text-[18px] font-medium"
                  placeholder="e.g. 555-0198"
                  value={newPhone}
                  onChangeText={setNewPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View className="gap-2">
                <ThemedText className="text-[#334155] font-bold text-[15px] uppercase tracking-wider ml-1">
                  Email Address (Optional)
                </ThemedText>
                <TextInput
                  className="bg-white border-2 border-[#E2E8F0] rounded-[20px] h-[60px] px-5 text-[#0F172A] text-[18px] font-medium"
                  placeholder="name@email.com"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <Pressable
                onPress={handleAddMember}
                disabled={addingLoader}
                className={`bg-[#2563EB] h-[64px] rounded-[20px] items-center justify-center mt-4 active:scale-95 transition-transform ${addingLoader ? "opacity-70" : ""}`}
                style={{
                  shadowColor: "#2563EB",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}>
                {addingLoader ? (
                  <ActivityIndicator color="#FFFFFF" size="large" />
                ) : (
                  <ThemedText className="text-white text-[20px] font-black tracking-wide">Save Contact</ThemedText>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
