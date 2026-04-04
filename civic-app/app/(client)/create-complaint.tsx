import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createComplaint } from "@/src/api/complaint.api";
import { ISSUE_TYPES } from "@/src/utils/constants";

type LocationShape = { lat: number; lng: number };
type LocationType = "hostel" | "campus";

const HOSTEL_OPTIONS = [
  { label: "Dhaludhar", value: "dhaludhar" },
  { label: "Yamuna", value: "yamuna" },
  { label: "Shivalik", value: "shivalik" },
];

export default function CreateComplaint() {
  const router = useRouter();
  const [locationType, setLocationType] = useState<LocationType>("campus");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState<string | null>(null);
  const [hostelName, setHostelName] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [block, setBlock] = useState("");
  const [location, setLocation] = useState<LocationShape>({ lat: 28.5468, lng: 77.2741 });
  const [submitting, setSubmitting] = useState(false);
  const [showHostelDropdown, setShowHostelDropdown] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() || !issueType) {
      Alert.alert("Missing fields", "Please choose an issue type and enter a description.");
      return;
    }

    if (locationType === "hostel" && !hostelName) {
      Alert.alert("Missing fields", "Please select a hostel name.");
      return;
    }

    if (locationType === "hostel" && !roomNumber.trim()) {
      Alert.alert("Missing fields", "Please enter your room number.");
      return;
    }

    if (locationType === "campus" && !building.trim()) {
      Alert.alert("Missing fields", "Please enter building/location name.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        issueType,
        description,
        location: location || { lat: 0, lng: 0 },
        locationType,
        ...(locationType === "hostel" && {
          hostelName,
          roomNumber,
        }),
        ...(locationType === "campus" && {
          building,
          block,
        }),
        images: [],
      };

      await createComplaint(payload);

      Alert.alert("Complaint Submitted", "Your grievance has been recorded.", [
        { text: "OK", onPress: () => router.push("/my-complaints") },
      ]);
    } catch (error) {
      console.log("Submit complaint error:", error);
      Alert.alert("Submission failed", "Unable to submit your complaint right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e3a8a", "#3b82f6"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Raise Grievance</Text>
        <View style={styles.headerPlaceholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Type Toggle */}
        <View style={styles.section}>
          <Text style={styles.label}>Location Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                locationType === "campus" && styles.toggleButtonActive,
              ]}
              onPress={() => setLocationType("campus")}
              activeOpacity={0.8}
            >
              <Ionicons
                name="school-outline"
                size={18}
                color={locationType === "campus" ? "#fff" : "#2563eb"}
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  locationType === "campus" && styles.toggleButtonTextActive,
                ]}
              >
                Campus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                locationType === "hostel" && styles.toggleButtonActive,
              ]}
              onPress={() => setLocationType("hostel")}
              activeOpacity={0.8}
            >
              <Ionicons
                name="home-outline"
                size={18}
                color={locationType === "hostel" ? "#fff" : "#2563eb"}
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  locationType === "hostel" && styles.toggleButtonTextActive,
                ]}
              >
                Hostel
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hostel-Specific Fields */}
        {locationType === "hostel" && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Hostel Name *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowHostelDropdown(!showHostelDropdown)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dropdownButtonText,
                    !hostelName && styles.dropdownPlaceholder,
                  ]}
                >
                  {hostelName
                    ? HOSTEL_OPTIONS.find((h) => h.value === hostelName)?.label
                    : "Select hostel..."}
                </Text>
                <Ionicons
                  name={showHostelDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#2563eb"
                />
              </TouchableOpacity>
              {showHostelDropdown && (
                <View style={styles.dropdownMenu}>
                  {HOSTEL_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setHostelName(option.value);
                        setShowHostelDropdown(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Room Number *</Text>
              <TextInput
                value={roomNumber}
                onChangeText={setRoomNumber}
                placeholder="E.g., 205A"
                style={styles.input}
                placeholderTextColor="#cbd5e1"
              />
            </View>
          </>
        )}

        {/* Campus-Specific Fields */}
        {locationType === "campus" && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Building/Location *</Text>
              <TextInput
                value={building}
                onChangeText={setBuilding}
                placeholder="E.g., Main Administrative Building"
                style={styles.input}
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Block/Wing (Optional)</Text>
              <TextInput
                value={block}
                onChangeText={setBlock}
                placeholder="E.g., Block A"
                style={styles.input}
                placeholderTextColor="#cbd5e1"
              />
            </View>
          </>
        )}

        {/* Issue Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Grievance Type *</Text>
          <View style={styles.typeList}>
            {ISSUE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  issueType === type.value && styles.typeButtonActive,
                ]}
                onPress={() => setIssueType(type.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={
                    issueType === type.value
                      ? styles.typeButtonTextActive
                      : styles.typeButtonText
                  }
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail..."
            multiline
            numberOfLines={5}
            style={styles.textArea}
            placeholderTextColor="#cbd5e1"
          />
          <Text style={styles.charCount}>{description.length} characters</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Submitting..." : "Submit Grievance"}
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
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
});

const pickerStyles = {};
