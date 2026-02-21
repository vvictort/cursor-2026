import { ScrollView, View, Pressable, useWindowDimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/themed-text";

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
    <View className="flex-1 bg-glass-bg">
      {/* Background Orbs */}
      <View className="absolute top-[-100px] -left-12 w-[500px] h-[500px] rounded-full bg-blue-700 opacity-60 blur-3xl" />
      <View className="absolute bottom-[-100px] -right-12 w-[400px] h-[400px] rounded-full bg-violet-600 opacity-40 blur-3xl" />

      {/* @ts-ignore */}
      <ScrollView
        className="flex-1"
        contentContainerClassName={`px-6 pt-16 pb-32 gap-6 ${isTablet ? "flex-row flex-wrap justify-between" : ""}`}>
        {/* LEFT PANEL WIDGETS */}
        <View className={isTablet ? "w-[48%] gap-6" : "gap-6"}>
          {/* Blood Pressure Chart Card */}
          <View className="bg-glass-card backdrop-blur-3xl rounded-[28px] p-6 shadow-sm border border-glass-border">
            {/* Chart Y Axis labels */}
            <View className="flex-row h-40">
              <View className="justify-between h-full py-2 mr-2">
                <ThemedText className="text-glass-muted text-xs">200</ThemedText>
                <ThemedText className="text-glass-muted text-xs">160</ThemedText>
                <ThemedText className="text-glass-muted text-xs">120</ThemedText>
                <ThemedText className="text-glass-muted text-xs">80</ThemedText>
                <ThemedText className="text-glass-muted text-xs">40</ThemedText>
                <ThemedText className="text-glass-muted text-xs">0</ThemedText>
              </View>
              {/* Chart Grid Area */}
              <View className="flex-1 border-b border-l border-white/20 relative">
                <View className="absolute w-full border-b border-white/10 border-dashed top-[20%]" />
                <View className="absolute w-full border-b border-white/10 border-dashed top-[40%]" />
                <View className="absolute w-full border-b border-white/10 border-dashed top-[60%]" />
                <View className="absolute w-full border-b border-white/10 border-dashed top-[80%]" />

                {/* Simulated SVG Lines using absolute positioned colored dots for now */}
                {WEEKLY_PRESSURE.map((pt, i) => {
                  const xPos = `${(i / 6) * 90 + 5}%`;
                  const ySys = `${100 - (pt.sys / 200) * 100}%`;
                  const yDia = `${100 - (pt.dia / 200) * 100}%`;
                  return (
                    <View key={i} className="absolute h-full w-full">
                      <View
                        className="absolute w-3 h-3 rounded-full bg-glass-coral border-2 border-white/50 shadow-md"
                        style={{ left: xPos as any, top: ySys as any }}
                      />
                      <View
                        className="absolute w-3 h-3 rounded-full bg-glass-cyan border-2 border-white/50 shadow-md"
                        style={{ left: xPos as any, top: yDia as any }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
            {/* X Axis labels */}
            <View className="flex-row justify-between ml-8 mt-2 pr-2">
              {WEEKLY_PRESSURE.map((pt) => (
                <ThemedText key={pt.day} className="text-glass-muted text-xs">
                  {pt.day}
                </ThemedText>
              ))}
            </View>
            {/* Legend */}
            <View className="flex-row justify-center mt-4 gap-6">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-glass-coral shadow-sm shadow-glass-coral" />
                <ThemedText className="text-glass-muted font-semibold text-[15px]">Systole</ThemedText>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-glass-cyan shadow-sm shadow-glass-cyan" />
                <ThemedText className="text-glass-muted font-semibold text-[15px]">Diastole</ThemedText>
              </View>
            </View>
          </View>

          {/* CarePulse Notification */}
          <View className="bg-glass-card backdrop-blur-3xl rounded-[24px] p-5 shadow-sm border border-glass-border">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="favorite" size={20} color="#22D3EE" />
                <ThemedText className="text-glass-text font-bold text-[17px]">CarePulse Notification</ThemedText>
              </View>
              <View className="w-6 h-6 rounded-full bg-glass-coral items-center justify-center shadow-lg shadow-glass-coral">
                <ThemedText className="text-white text-[13px] font-bold">2</ThemedText>
              </View>
            </View>

            <View className="bg-white/5 border border-white/10 p-3 rounded-[16px] flex-row items-start gap-4 mb-3">
              <View className="w-12 h-12 rounded-full bg-glass-coral/20 items-center justify-center mt-1 border border-glass-coral/30">
                <MaterialIcons name="warning" size={24} color="#FB7185" />
              </View>
              <View className="flex-1">
                <ThemedText className="text-glass-text font-bold text-[16px]">Glucose Level HIGH: 142 mg/dL</ThemedText>
                <ThemedText className="text-glass-muted font-medium text-[14px] mt-0.5">12:48 AM</ThemedText>
              </View>
            </View>

            <View className="bg-white/5 border border-white/10 p-3 rounded-[16px] flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-full bg-glass-cyan/20 items-center justify-center mt-1 border border-glass-cyan/30">
                <MaterialIcons name="emoji-events" size={24} color="#22D3EE" />
              </View>
              <View className="flex-1">
                <ThemedText className="text-glass-text font-bold text-[16px]">
                  You reached daily activity goal!
                </ThemedText>
                <ThemedText className="text-glass-muted font-medium text-[14px] mt-0.5">7:51 AM</ThemedText>
              </View>
            </View>
          </View>

          {/* Therapist Card */}
          <View className="bg-glass-card backdrop-blur-3xl rounded-[24px] p-4 flex-row justify-between items-center shadow-sm border border-glass-border">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full overflow-hidden bg-orange-500/20 items-center justify-center border border-orange-500/30">
                <MaterialIcons name="face" size={32} color="#F97316" />
              </View>
              <View>
                <ThemedText className="text-glass-text font-bold text-[18px]">Dr.McKinney</ThemedText>
                <ThemedText className="text-glass-muted font-medium text-[16px]">Therapist</ThemedText>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable className="bg-glass-cyan/20 border border-glass-cyan/30 px-5 py-2.5 rounded-full">
                <ThemedText className="text-glass-cyan font-bold text-[16px]">Call</ThemedText>
              </Pressable>
              <MaterialIcons name="more-vert" size={26} color="#94A3B8" />
            </View>
          </View>
        </View>

        {/* RIGHT PANEL WIDGETS */}
        <View className={isTablet ? "w-[48%] gap-6" : "gap-6"}>
          {/* Map Route Card */}
          <View className="bg-glass-card backdrop-blur-3xl rounded-[28px] p-5 shadow-sm border border-glass-border">
            <View className="flex-row items-start gap-3 mb-4">
              <View className="mt-1">
                <MaterialIcons name="favorite" size={20} color="#FB7185" />
              </View>
              <View className="flex-1">
                <ThemedText className="text-glass-text font-bold text-[17px]">
                  John is en route to the hospital
                </ThemedText>
                <ThemedText className="text-glass-muted font-medium text-[15px] leading-5 mt-1">
                  Urgent heart issue detected — ambulance dispatc...
                </ThemedText>
                <View className="bg-glass-coral/20 border border-glass-coral/30 px-3 py-1 rounded-full self-start mt-2">
                  <ThemedText className="text-glass-coral text-[13px] font-bold">Moderate</ThemedText>
                </View>
              </View>
            </View>

            <View className="w-full h-36 bg-[#0B1120] rounded-[16px] mb-4 relative overflow-hidden items-center justify-center border border-white/10">
              {/* Simulated Map Background - Darkened for theme */}
              <View className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Tiburon,CA&zoom=14&size=400x400&sensor=false')] opacity-30 mix-blend-luminosity" />
              {/* Simulated Pins & Route */}
              <View className="absolute w-full border-t-4 border-glass-cyan/30 border-dashed top-[50%] left-[-10%] tilt-2" />
              <View className="w-14 h-14 rounded-full bg-glass-card backdrop-blur-sm border-2 border-glass-cyan items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <MaterialIcons name="person" size={28} color="#22D3EE" />
              </View>
            </View>

            <ThemedText className="text-glass-text font-bold text-[17px]">Tiburon Medical Center</ThemedText>
            <ThemedText className="text-glass-muted font-medium text-[15px] mt-1">
              1550 Tiburon Blvd, Tiburon, CA 94920
            </ThemedText>

            <View className="flex-row gap-3 mt-5">
              <Pressable className="flex-1 border-2 border-glass-cyan/50 rounded-full py-3.5 items-center">
                <ThemedText className="text-glass-cyan font-bold text-[16px]">Call Hospital</ThemedText>
              </Pressable>
              <Pressable className="flex-1 bg-glass-cyan/20 border border-glass-cyan/30 rounded-full py-3.5 items-center">
                <ThemedText className="text-glass-cyan font-bold text-[16px]">Get Direction</ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Oxygen Card */}
          <View className="bg-glass-card/50 backdrop-blur-3xl rounded-[28px] p-6 shadow-sm border border-glass-border">
            <View className="flex-row justify-between items-end h-32 mb-4 border-b-2 border-white/10 pb-2">
              {[60, 45, 65, 55, 60, 40, 75].map((height, i) => (
                <View key={i} className="items-center w-8">
                  <View
                    style={{ height: `${height}%` }}
                    className={`w-6 rounded-full ${i === 6 ? "bg-glass-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-glass-cyan/20"}`}
                  />
                </View>
              ))}
              {/* Hover dot for Sunday */}
              <View className="absolute right-[11px] top-6 w-3 h-3 rounded-full bg-white border-2 border-glass-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <ThemedText className="absolute right-[11px] top-12 text-white font-bold text-lg">0</ThemedText>
            </View>

            <View className="flex-row justify-between mb-6 px-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <ThemedText key={i} className="text-glass-muted font-bold text-[16px] w-8 text-center">
                  {day}
                </ThemedText>
              ))}
            </View>

            <View>
              <ThemedText className="text-glass-text font-bold text-[20px]">Oxygen</ThemedText>
              <View className="flex-row items-center gap-2 mt-1">
                <MaterialIcons name="air" size={30} color="#22D3EE" />
                <ThemedText className="text-glass-cyan font-bold text-[40px] shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  89
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
