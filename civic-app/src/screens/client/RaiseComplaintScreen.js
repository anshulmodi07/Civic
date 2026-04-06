import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function RaiseComplaintScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#1e3a8a", "#3b82f6"]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Raise Complaint</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#2563eb" />
          <Text style={styles.infoText}>Select the type of issue you want to report</Text>
        </View>

        {/* Hostel Complaint Card */}
        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => navigation.navigate("CreateComplaintHostel")}
          activeOpacity={0.85}
        >
          <LinearGradient colors={["#3b82f6", "#2563eb"]} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="home" size={40} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Hostel Complaint</Text>
                <Text style={styles.cardSubtitle}>Report issues in your hostel room or common areas</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.featureList}>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>AC Issues</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>Plumbing Problems</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>Electrical Faults</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>WiFi & Connectivity</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Campus Complaint Card */}
        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => navigation.navigate("CreateComplaintCampus")}
          activeOpacity={0.85}
        >
          <LinearGradient colors={["#10b981", "#059669"]} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="school" size={40} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Campus Complaint</Text>
                <Text style={styles.cardSubtitle}>Report issues around campus grounds</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.featureList}>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>Sanatation Issues</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>Construction Hazards</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>Maintenance Issues</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>General Safety</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
    lineHeight: 20,
  },
  typeCard: { marginBottom: 20 },
  cardGradient: { borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 4, letterSpacing: 0.3 },
  cardSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: "500", lineHeight: 18 },
  cardDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: 20 },
  featureList: { paddingHorizontal: 20, paddingVertical: 16 },
  feature: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  featureText: { marginLeft: 10, fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: "500" },
});
