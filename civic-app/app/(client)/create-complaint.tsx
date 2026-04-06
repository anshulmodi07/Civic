import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function RaiseComplaint() {
  const router = useRouter();
  const [locationType, setLocationType] = useState<"campus" | "hostel">("campus");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitting complaint");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#1e3a8a", "#3b82f6"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Raise Complaint</Text>
        <View style={styles.headerPlaceholder} />
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
          onPress={() => router.push({ pathname: "/create-complaint-hostel" })}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
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
          onPress={() => router.push({ pathname: "/create-complaint-campus" })}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#10b981", "#059669"]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
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
                <Text style={styles.featureText}>Sanitation Issues</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 22,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerPlaceholder: {
    width: 46,
    height: 46,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "700",
    marginBottom: 11,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#2563eb",
  },
  toggleButtonText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 14,
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dropdownButtonText: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "600",
  },
  dropdownPlaceholder: {
    color: "#94a3b8",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  typeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  typeButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  typeButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  typeButtonText: {
    color: "#1f2937",
    fontWeight: "700",
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  textArea: {
    minHeight: 140,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  charCount: {
    marginTop: 8,
    color: "#94a3b8",
    fontSize: 12,
  },
  submitButton: {
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  spacer: {
    height: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
    marginLeft: 8,
  },
  typeCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardGradient: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginVertical: 16,
  },
  featureList: {
    marginTop: 4,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

const pickerStyles = {};
