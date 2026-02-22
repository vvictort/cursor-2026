import { ThemedText } from "@/components/themed-text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import * as Animatable from "react-native-animatable";

const WEEKLY_PRESSURE = [
  { day: "Mn", sys: 146, dia: 78 },
  { day: "Tu", sys: 190, dia: 98 },
  { day: "Wed", sys: 136, dia: 96 },
  { day: "Thu", sys: 164, dia: 108 },
  { day: "Fri", sys: 136, dia: 92 },
  { day: "Sat", sys: 182, dia: 82 },
  { day: "Sun", sys: 156, dia: 124 },
];

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 760;

  return (
    <View className="flex-1 bg-[#F1F5F9]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="w-full items-center">
          <View
            className="w-full max-w-[1000px] px-6 pt-16"
            style={{
              gap: 24,
              flexDirection: isTablet ? "row" : "column",
              flexWrap: isTablet ? "wrap" : "nowrap",
              justifyContent: isTablet ? "space-between" : "flex-start",
            }}>
            {/* LEFT PANEL WIDGETS */}
            <View style={isTablet ? { width: "48%", gap: 24 } : { gap: 24 }}>
              {/* Blood Pressure Chart Card */}
              <Animatable.View animation="fadeInLeft" duration={800}>
                <View
                  className="bg-white rounded-[32px] p-6 border-[1.5px] border-gray-200"
                  style={{
                    shadowColor: "#0F172A",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.08,
                    shadowRadius: 24,
                    elevation: 12,
                  }}>
                  <ThemedText className="text-[#0F172A] font-black text-[22px] mb-8 tracking-tight">
                    Blood Pressure
                  </ThemedText>

                  {/* Chart Setup */}
                  <View className="flex-row h-56">
                    <View className="justify-between h-full py-2 mr-4">
                      <ThemedText className="text-[#64748B] font-bold text-[12px]">200</ThemedText>
                      <ThemedText className="text-[#64748B] font-bold text-[12px]">160</ThemedText>
                      <ThemedText className="text-[#64748B] font-bold text-[12px]">120</ThemedText>
                      <ThemedText className="text-[#64748B] font-bold text-[12px]">80</ThemedText>
                      <ThemedText className="text-[#64748B] font-bold text-[12px]">40</ThemedText>
                      <ThemedText className="text-[#64748B] font-bold text-[12px]">0</ThemedText>
                    </View>

                    {/* Grid */}
                    <View className="flex-1 border-b-2 border-l-2 border-[#E2E8F0] relative">
                      <View className="absolute w-full border-b border-[#E2E8F0] border-dashed top-[20%]" />
                      <View className="absolute w-full border-b border-[#E2E8F0] border-dashed top-[40%]" />
                      <View className="absolute w-full border-b border-[#E2E8F0] border-dashed top-[60%]" />
                      <View className="absolute w-full border-b border-[#E2E8F0] border-dashed top-[80%]" />

                      {WEEKLY_PRESSURE.map((pt, i) => {
                        const xPos = `${(i / 6) * 90 + 5}%`;
                        const ySys = `${100 - (pt.sys / 200) * 100}%`;
                        const yDia = `${100 - (pt.dia / 200) * 100}%`;
                        return (
                          <Animatable.View
                            key={i}
                            animation="bounceIn"
                            delay={300 + i * 100}
                            className="absolute h-full w-full">
                            <View
                              className="absolute w-4 h-4 rounded-full bg-[#EF4444] border-[3px] border-white z-10"
                              style={{
                                left: xPos as any,
                                top: ySys as any,
                                transform: [{ translateX: -8 }, { translateY: -8 }],
                                elevation: 4,
                              }}
                            />
                            <View
                              className="absolute w-4 h-4 rounded-full bg-[#3B82F6] border-[3px] border-white z-10"
                              style={{
                                left: xPos as any,
                                top: yDia as any,
                                transform: [{ translateX: -8 }, { translateY: -8 }],
                                elevation: 4,
                              }}
                            />
                          </Animatable.View>
                        );
                      })}
                    </View>
                  </View>

                  {/* X Axis labels */}
                  <View className="flex-row justify-between ml-[40px] mt-4 pr-3">
                    {WEEKLY_PRESSURE.map((pt) => (
                      <ThemedText
                        key={pt.day}
                        className="text-[#64748B] font-black text-[13px] uppercase tracking-wider">
                        {pt.day}
                      </ThemedText>
                    ))}
                  </View>

                  {/* Legend */}
                  <View className="flex-row justify-center mt-8 gap-8 bg-[#F8FAFC] rounded-2xl py-4 border border-[#F1F5F9]">
                    <View className="flex-row items-center gap-3">
                      <View className="w-4 h-4 rounded-full bg-[#EF4444]" />
                      <ThemedText className="text-[#334155] font-black text-[14px] uppercase tracking-wide">
                        Systolic
                      </ThemedText>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <View className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                      <ThemedText className="text-[#334155] font-black text-[14px] uppercase tracking-wide">
                        Diastolic
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </Animatable.View>

              {/* CarePulse Card */}
              <Animatable.View animation="fadeInUp" delay={200}>
                <View
                  className="bg-white rounded-[32px] p-6 border-[1.5px] border-gray-200"
                  style={{
                    shadowColor: "#0F172A",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.08,
                    shadowRadius: 24,
                    elevation: 12,
                  }}>
                  <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 bg-blue-50 rounded-[12px] items-center justify-center">
                        <MaterialIcons name="favorite" size={24} color="#2563EB" />
                      </View>
                      <ThemedText className="text-[#0F172A] font-black text-[22px] tracking-tight">Alerts</ThemedText>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-[#EF4444] items-center justify-center shadow-sm">
                      <ThemedText className="text-white text-[15px] font-black">2</ThemedText>
                    </View>
                  </View>

                  <View className="bg-[#FEF2F2] p-5 rounded-[24px] flex-row items-center gap-4 mb-4 border-2 border-[#FECACA]">
                    <View className="w-14 h-14 rounded-full bg-white items-center justify-center border-2 border-[#FCA5A5] elevation-sm">
                      <MaterialIcons name="warning" size={28} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                      <ThemedText className="text-[#7F1D1D] font-black text-[18px]">Glucose HIGH</ThemedText>
                      <ThemedText className="text-[#B91C1C] font-bold text-[15px] mt-1">
                        142 mg/dL - 12:48 AM
                      </ThemedText>
                    </View>
                  </View>

                  <View className="bg-[#ECFDF5] p-5 rounded-[24px] flex-row items-center gap-4 border-2 border-[#A7F3D0]">
                    <View className="w-14 h-14 rounded-full bg-white items-center justify-center border-2 border-[#6EE7B7] elevation-sm">
                      <MaterialIcons name="emoji-events" size={28} color="#10B981" />
                    </View>
                    <View className="flex-1">
                      <ThemedText className="text-[#064E3B] font-black text-[18px]">Goal Reached</ThemedText>
                      <ThemedText className="text-[#047857] font-bold text-[15px] mt-1">
                        Activity matched - 7:51 AM
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </Animatable.View>
            </View>

            {/* RIGHT PANEL WIDGETS */}
            <View style={isTablet ? { width: "48%", gap: 24 } : { gap: 24 }}>
              {/* Map Component */}
              <Animatable.View animation="fadeInRight" duration={800}>
                <View
                  className="bg-white rounded-[32px] p-6 border-[1.5px] border-red-200"
                  style={{
                    shadowColor: "#EF4444",
                    shadowOffset: { width: 0, height: 16 },
                    shadowOpacity: 0.1,
                    shadowRadius: 32,
                    elevation: 15,
                  }}>
                  <View className="flex-row items-start gap-4 mb-6">
                    <View className="w-16 h-16 rounded-[20px] bg-[#FEF2F2] items-center justify-center border-2 border-[#FECACA]">
                      <MaterialIcons name="local-hospital" size={32} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                      <ThemedText className="text-[#0F172A] font-black text-[22px] tracking-tight">
                        Emergency
                      </ThemedText>
                      <ThemedText className="text-[#475569] font-bold text-[16px] leading-[24px] mt-1">
                        Ambulance dispatched to nearest center.
                      </ThemedText>
                      <View className="bg-[#EF4444] px-4 py-2 rounded-full self-start mt-3">
                        <ThemedText className="text-white text-[13px] font-black uppercase tracking-widest">
                          Priority: HIGH
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  <View className="w-full h-56 bg-[#F8FAFC] rounded-[24px] mb-6 relative overflow-hidden items-center justify-center border-2 border-[#E2E8F0]">
                    <View className="absolute inset-0 opacity-20 bg-blue-200" />
                    <View className="absolute w-[80%] border-t-[6px] border-[#60A5FA] border-dashed top-[50%] left-[10%] tilt-2 transform -rotate-12" />

                    <View
                      className="w-16 h-16 rounded-full bg-white border-[5px] border-[#3B82F6] items-center justify-center absolute"
                      style={{ left: "20%", top: "30%", elevation: 8 }}>
                      <MaterialIcons name="person-pin-circle" size={32} color="#3B82F6" />
                    </View>

                    <View
                      className="w-16 h-16 rounded-full bg-white border-[5px] border-[#EF4444] items-center justify-center absolute"
                      style={{ right: "20%", bottom: "20%", elevation: 8 }}>
                      <MaterialIcons name="local-hospital" size={32} color="#EF4444" />
                    </View>
                  </View>

                  <ThemedText className="text-[#0F172A] font-black text-[22px] tracking-tight">
                    Tiburon Medical
                  </ThemedText>
                  <ThemedText className="text-[#64748B] font-bold text-[16px] mt-2 leading-6">
                    1550 Tiburon Blvd, Tiburon, CA 94920
                  </ThemedText>

                  <View className="flex-row gap-4 mt-8">
                    <Pressable
                      onPress={() => Alert.alert("Calling...", "Connecting to Tiburon Medical Center.")}
                      className="flex-1 bg-white border-2 border-[#E2E8F0] rounded-[20px] py-4 items-center active:bg-gray-50"
                      style={{ elevation: 2 }}>
                      <ThemedText className="text-[#334155] font-black text-[17px]">Call Hospital</ThemedText>
                    </Pressable>
                    <Pressable
                      onPress={() => Alert.alert("Opening Maps...", "Fetching directions to Tiburon Blvd.")}
                      className="flex-1 bg-[#2563EB] rounded-[20px] py-4 items-center active:opacity-90"
                      style={{
                        shadowColor: "#2563EB",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 16,
                        elevation: 8,
                      }}>
                      <ThemedText className="text-white font-black text-[17px]">Directions</ThemedText>
                    </Pressable>
                  </View>
                </View>
              </Animatable.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
