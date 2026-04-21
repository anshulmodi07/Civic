import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

const STATS = [
  { label: "Assigned", value: "12", icon: "📋" },
  { label: "Completed", value: "9", icon: "✅" },
  { label: "Pending", value: "3", icon: "⏳" },
];

const MENU_ITEMS = [
  { icon: "👤", label: "Edit Profile", sub: "Update your name and details" },
  { icon: "🔔", label: "Notifications", sub: "Manage alert preferences" },
  { icon: "🔒", label: "Change Password", sub: "Keep your account secure" },
  { icon: "🌐", label: "Language", sub: "English (Default)" },
];

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* HERO BANNER */}
      <View style={styles.hero}>
        <View style={styles.heroPattern}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.circle, { 
              width: 60 + i * 30, 
              height: 60 + i * 30,
              opacity: 0.06 - i * 0.008,
            }]} />
          ))}
        </View>

        <Text style={styles.heroLabel}>WORKER PROFILE</Text>

        {/* AVATAR */}
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👷</Text>
          </View>
        </View>

        <Text style={styles.name}>Rajesh Kumar</Text>
        <Text style={styles.role}>Maintenance Staff · Electrical</Text>

        {/* BADGE */}
        <View style={styles.shiftBadge}>
          <Text style={styles.shiftDot}>●</Text>
          <Text style={styles.shiftText}>Morning Shift Active</Text>
        </View>
      </View>

      {/* STATS ROW */}
      <View style={styles.statsRow}>
        {STATS.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statNumber}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* MENU */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.menuItem,
              i < MENU_ITEMS.length - 1 && styles.menuItemBorder,
            ]}
            activeOpacity={0.6}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>{item.icon}</Text>
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* APP INFO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} activeOpacity={0.6}>
          <View style={styles.menuIcon}>
            <Text style={styles.menuIconText}>ℹ️</Text>
          </View>
          <View style={styles.menuText}>
            <Text style={styles.menuLabel}>About</Text>
            <Text style={styles.menuSub}>Version 1.0.0</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
          <View style={styles.menuIcon}>
            <Text style={styles.menuIconText}>🛟</Text>
          </View>
          <View style={styles.menuText}>
            <Text style={styles.menuLabel}>Help & Support</Text>
            <Text style={styles.menuSub}>Contact maintenance team</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* SIGN OUT */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={() => router.push("/signout")}
        activeOpacity={0.8}
      >
        <Text style={styles.signOutIcon}>🚪</Text>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Campus Maintenance System · v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    paddingBottom: 40,
  },

  /* HERO */
  hero: {
    backgroundColor: "#1e3a5f",
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  heroPattern: {
    position: "absolute",
    top: -20,
    right: -20,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#93c5fd",
    letterSpacing: 3,
    marginBottom: 20,
  },
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "rgba(59,130,246,0.15)",
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 36,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
  role: {
    fontSize: 13,
    color: "#93c5fd",
    marginTop: 4,
    marginBottom: 14,
  },
  shiftBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.4)",
    gap: 6,
  },
  shiftDot: {
    color: "#10b981",
    fontSize: 8,
  },
  shiftText: {
    color: "#6ee7b7",
    fontSize: 12,
    fontWeight: "600",
  },

  /* STATS */
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: -1,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderTopWidth: 3,
    borderTopColor: "#2563eb",
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },

  /* SECTION */
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIconText: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  menuSub: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: "#cbd5e1",
    fontWeight: "300",
  },

  /* SIGN OUT */
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#fee2e2",
    shadowColor: "#ef4444",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  signOutIcon: {
    fontSize: 18,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ef4444",
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#cbd5e1",
    marginTop: 4,
  },
});
