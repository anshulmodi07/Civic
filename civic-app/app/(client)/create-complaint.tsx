import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// ─── DESIGN TOKENS (shared with complaint screens) ────────────────────────────
const C = {
  bg: "#f0fdf4",
  surface: "#ffffff",
  border: "#86efac",
  accent: "#16a34a",
  textPrimary: "#0f172a",
  textSecondary: "#166534",
  textMuted: "#4b5563",
  gradientHeader: ["#bbf7d0", "#4ade80"] as [string, string],
};

export default function RaiseComplaint() {
  const router = useRouter();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={fs.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <LinearGradient
        colors={C.gradientHeader}
        style={fs.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={fs.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={fs.headerCenter}>
          <View style={fs.headerIconWrap}>
            <Ionicons name="create-outline" size={20} color={C.accent} />
          </View>
          <Text style={fs.headerTitle}>Raise Complaint</Text>
        </View>

        {/* balance flex */}
        <View style={{ width: 38 }} />
      </LinearGradient>

      <Animated.ScrollView
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        contentContainerStyle={fs.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── INFO BANNER ── */}
        <View style={fs.infoBanner}>
          <Ionicons name="information-circle-outline" size={18} color={C.accent} />
          <Text style={fs.infoText}>
            Choose the type of issue you'd like to report below.
          </Text>
        </View>

        {/* ── HOSTEL CARD ── */}
        <ComplaintCard
          gradient={["#3b82f6", "#1d4ed8"]}
          icon="home"
          title="Hostel Complaint"
          subtitle="Report issues in your room or hostel common areas"
          features={["AC & Heating", "Plumbing Problems", "Electrical Faults", "WiFi & Connectivity"]}
          onPress={() => router.push({ pathname: "/create-complaint-hostel" })}
        />

        {/* ── CAMPUS CARD ── */}
        <ComplaintCard
          gradient={["#22c55e", "#16a34a"]}
          icon="school"
          title="Campus Complaint"
          subtitle="Report issues around campus grounds and facilities"
          features={["Sanitation Issues", "Construction Hazards", "Maintenance Issues", "General Safety"]}
          onPress={() => router.push({ pathname: "/create-complaint-campus" })}
        />

        <View style={{ height: 48 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ─── COMPLAINT CARD ───────────────────────────────────────────────────────────
function ComplaintCard({
  gradient,
  icon,
  title,
  subtitle,
  features,
  onPress,
}: {
  gradient: [string, string];
  icon: string;
  title: string;
  subtitle: string;
  features: string[];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={fs.card} onPress={onPress} activeOpacity={0.88}>
      <LinearGradient
        colors={gradient}
        style={fs.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Card header row */}
        <View style={fs.cardHeader}>
          <View style={fs.cardIconWrap}>
            <Ionicons name={icon as any} size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={fs.cardTitle}>{title}</Text>
            <Text style={fs.cardSubtitle}>{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
        </View>

        <View style={fs.divider} />

        {/* Feature grid — 2 columns */}
        <View style={fs.featureGrid}>
          {features.map((f) => (
            <View key={f} style={fs.featureItem}>
              <Ionicons name="checkmark-circle" size={15} color="rgba(255,255,255,0.85)" />
              <Text style={fs.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const fs = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerCenter: {
    flex: 1, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  headerIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "rgba(22,163,74,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  // Info Banner
  infoBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "rgba(22,163,74,0.08)",
    borderWidth: 1, borderColor: "rgba(22,163,74,0.2)",
    borderRadius: 12, padding: 14, marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: C.textSecondary, lineHeight: 20 },

  // Card
  card: {
    marginBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardGradient: { padding: 20 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  cardIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#fff", marginBottom: 3 },
  cardSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 18 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 16,
  },

  // Features — 2-column grid
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "47%",
  },
  featureText: { fontSize: 13, fontWeight: "600", color: "#fff" },
});