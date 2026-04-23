import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { ISSUE_TYPES, LOCATION_LANDMARKS } from "@/src/utils/constants";

// ✅ Corrected import path: complaint_api (underscore), not complaint.api (dot)

import { createComplaint } from "@/src/api/complaint.api";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#f0fdf4",
  surface: "#ffffff",
  surfaceElevated: "#ecfdf5",
  border: "#86efac",
  borderFocus: "#22c55e",
  accent: "#16a34a",
  accentDim: "#22c55e",
  success: "#16a34a",
  error: "#ef4444",
  warning: "#fbbf24",
  textPrimary: "#0f172a",
  textSecondary: "#166534",
  textMuted: "#4b5563",
  gradientHeader: ["#bbf7d0", "#4ade80"] as [string, string],
  gradientBtn: ["#22c55e", "#16a34a"] as [string, string],
  gradientBtnDisabled: ["#d1fae5", "#a7f3d0"] as [string, string],
};

const MAX_IMAGES = 5;
const MIN_DESC_LENGTH = 20;

// ─── TYPES ────────────────────────────────────────────────────────────────────
type FieldErrors = {
  area?: string | null;
  locationAddress?: string | null;
  departmentId?: string | null;
  description?: string | null;
  gps?: string | null;
};

type IconName = ComponentProps<typeof Ionicons>["name"];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function FormField({
  label,
  icon,
  error,
  required,
  children,
}: {
  label: string;
  icon: IconName;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={fs.fieldWrapper}>
      <View style={fs.labelRow}>
        <Ionicons name={icon} size={14} color={C.accent} />
        <Text style={fs.label}>
          {label}
          {required && <Text style={fs.required}> *</Text>}
        </Text>
      </View>
      {children}
      {error ? <Text style={fs.fieldError}>{error}</Text> : null}
    </View>
  );
}

function LocationCard({
  loading,
  location,
  onRetry,
}: {
  loading: boolean;
  location: { lat: number; lng: number } | null;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <View style={[fs.locationCard, fs.locationPending]}>
        <ActivityIndicator color={C.accent} size="small" />
        <Text style={[fs.locationText, { color: C.textSecondary }]}>
          Acquiring GPS signal…
        </Text>
      </View>
    );
  }
  if (location) {
    return (
      <View style={[fs.locationCard, fs.locationSuccess]}>
        <View style={fs.locationDot} />
        <View style={{ flex: 1 }}>
          <Text style={[fs.locationText, { color: C.success }]}>
            Location captured
          </Text>
          <Text style={fs.locationCoords}>
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </Text>
        </View>
        <Ionicons name="checkmark-circle" size={22} color={C.success} />
      </View>
    );
  }
  return (
    <TouchableOpacity
      style={[fs.locationCard, fs.locationError]}
      onPress={onRetry}
      activeOpacity={0.7}
    >
      <Ionicons name="alert-circle" size={20} color={C.error} />
      <Text style={[fs.locationText, { color: C.error, flex: 1 }]}>
        Location unavailable — tap to retry
      </Text>
      <Ionicons name="refresh" size={18} color={C.error} />
    </TouchableOpacity>
  );
}

function ImageThumb({ uri, onRemove }: { uri: string; onRemove: () => void }) {
  return (
    <View style={fs.thumb}>
      <Image source={{ uri }} style={fs.thumbImage} resizeMode="cover" />
      <TouchableOpacity
        style={fs.thumbRemove}
        onPress={onRemove}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <Ionicons name="close-circle" size={20} color={C.error} />
      </TouchableOpacity>
    </View>
  );
}

function SectionHeader({
  icon,
  title,
  optional = false,
}: {
  icon: IconName;
  title: string;
  optional?: boolean;
}) {
  return (
    <View style={fs.sectionHeader}>
      <View style={fs.sectionIconWrap}>
        <Ionicons name={icon} size={15} color={C.accent} />
      </View>
      <Text style={fs.sectionTitle}>{title}</Text>
      {optional && <Text style={fs.optionalBadge}>optional</Text>}
    </View>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CreateComplaintCampus() {
  const router = useRouter();

  // Form state — field names aligned with backend payload
  const [area, setArea] = useState<string | null>(null);           // was: locationLandmark
  const [locationAddress, setLocationAddress] = useState("");
  const [departmentId, setDepartmentId] = useState<string | null>(null); // was: issueType
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  // GPS
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingGps, setLoadingGps] = useState(true);

  // UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    fetchGps();
  }, []);

  // ── GPS ──────────────────────────────────────────────────────────────────────
  const fetchGps = async () => {
    setLoadingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location access is needed to file a complaint."
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setGpsLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    } catch (err) {
      console.warn("GPS error:", err);
    } finally {
      setLoadingGps(false);
    }
  };

  // ── IMAGES ───────────────────────────────────────────────────────────────────
  const addImage = async (fromCamera = false) => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Limit Reached", `You can attach up to ${MAX_IMAGES} photos.`);
      return;
    }
    if (fromCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera access is needed.");
        return;
      }
    }
    const picker = fromCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;
    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
    });
    if (!result.canceled) setImages((prev) => [...prev, result.assets[0]]);
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  // ── VALIDATION ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!area)
      errors.area = "Please select a landmark / area.";
    if (!locationAddress.trim())
      errors.locationAddress = "Please describe the location.";
    if (!departmentId)
      errors.departmentId = "Please select a department / issue type.";
    if (description.trim().length < MIN_DESC_LENGTH)
      errors.description = `At least ${MIN_DESC_LENGTH} characters required.`;
    if (description.trim().length > 500)
      errors.description = "Description cannot exceed 500 characters.";
    if (!gpsLocation)
      errors.gps = "GPS location is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── SUBMIT ───────────────────────────────────────────────────────────────────
  const submitComplaint = async () => {
    if (!validate()) {
      Alert.alert("Incomplete Form", "Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    // ✅ Build FormData matching backend payload shape
    const formPayload = new FormData();
    formPayload.append("type", "campus");
    formPayload.append("area", area ?? "");
    formPayload.append("locationAddress", locationAddress.trim());
    formPayload.append("description", description.trim());
    formPayload.append("departmentId", departmentId ?? "");
    formPayload.append("visibility", "public"); // backend auto-sets; kept for explicitness
    formPayload.append(
      "location",
      JSON.stringify({ lat: gpsLocation!.lat, lng: gpsLocation!.lng })
    );

    images.forEach((img, i) => {
      const imageFile: any = {
        uri: img.uri,
        name: `campus_photo_${i}_${Date.now()}.jpg`,
        type: "image/jpeg",
      };
      formPayload.append("images", imageFile);
    });

    try {
      // ✅ createComplaint from complaint_api.js — posts to /complaints
      await createComplaint(formPayload);
      setSubmitted(true);
      Alert.alert(
        "✓ Complaint Filed",
        "Your campus complaint has been submitted. You'll receive updates on its progress.",
        [
          {
            text: "View My Complaints",
            onPress: () => router.replace("/my-complaints"),
          },
        ]
      );
    } catch (err: any) {
      console.error("Submit error:", err);
      Alert.alert(
        "Submission Failed",
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  const descProgress = Math.min(description.length / 200, 1);
  const filledCount = [
    area,
    locationAddress,
    departmentId,
    description.length >= MIN_DESC_LENGTH,
    gpsLocation,
  ].filter(Boolean).length;

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
            <Ionicons name="business" size={20} color={C.accent} />
          </View>
          <Text style={fs.headerTitle}>Campus Report</Text>
        </View>

        <View style={fs.headerRight}>
          <Text style={fs.headerSub}>{images.length}/{MAX_IMAGES} photos</Text>
        </View>
      </LinearGradient>

      {/* ── PROGRESS BAR ── */}
      <View style={fs.progressTrack}>
        <Animated.View
          style={[
            fs.progressFill,
            { width: `${Math.round((filledCount / 5) * 100)}%` },
          ]}
        />
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        contentContainerStyle={fs.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── INFO BANNER ── */}
        <View style={fs.infoBanner}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={C.accent}
          />
          <Text style={fs.infoText}>
            Report issues across campus facilities — buildings, pathways,
            utilities, and common areas.
          </Text>
        </View>

        {/* ── SECTION: LOCATION ── */}
        <SectionHeader icon="location-outline" title="Location Details" />

        {/* Area — maps to `area` in payload (was locationLandmark) */}
        <FormField
          label="Landmark / Area"
          icon="flag-outline"
          required
          error={fieldErrors.area}
        >
          <View style={[fs.pickerBox, fieldErrors.area && fs.inputError]}>
            <RNPickerSelect
              onValueChange={(v) => {
                setArea(v);
                setFieldErrors((e) => ({ ...e, area: null }));
              }}
              items={LOCATION_LANDMARKS}
              placeholder={{ label: "Select a landmark…", value: null }}
              style={pickerStyle}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={C.textSecondary}
                />
              )}
            />
          </View>
        </FormField>

        <FormField
          label="Specific Location / Address"
          icon="map-outline"
          required
          error={fieldErrors.locationAddress}
        >
          <TextInput
            value={locationAddress}
            onChangeText={(t) => {
              setLocationAddress(t);
              setFieldErrors((e) => ({ ...e, locationAddress: null }));
            }}
            multiline
            numberOfLines={3}
            placeholder="e.g., Near the main gate, ground floor corridor…"
            placeholderTextColor={C.textMuted}
            style={[
              fs.textArea,
              fs.textAreaShort,
              fieldErrors.locationAddress && fs.inputError,
            ]}
          />
        </FormField>

        {/* ── SECTION: ISSUE ── */}
        <SectionHeader icon="construct-outline" title="Issue Details" />

        {/* Department — maps to `departmentId` in payload (was issueType) */}
        <FormField
          label="Issue Category / Department"
          icon="alert-circle-outline"
          required
          error={fieldErrors.departmentId}
        >
          <View
            style={[fs.pickerBox, fieldErrors.departmentId && fs.inputError]}
          >
            <RNPickerSelect
              onValueChange={(v) => {
                setDepartmentId(v);
                setFieldErrors((e) => ({ ...e, departmentId: null }));
              }}
              items={ISSUE_TYPES}
              placeholder={{ label: "Select issue type…", value: null }}
              style={pickerStyle}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={C.textSecondary}
                />
              )}
            />
          </View>
        </FormField>

        <FormField
          label="Description"
          icon="document-text-outline"
          required
          error={fieldErrors.description}
        >
          <TextInput
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              setFieldErrors((e) => ({ ...e, description: null }));
            }}
            multiline
            numberOfLines={6}
            placeholder={`Describe the issue in detail (min ${MIN_DESC_LENGTH} characters)…`}
            placeholderTextColor={C.textMuted}
            style={[fs.textArea, fieldErrors.description && fs.inputError]}
          />
          <View style={fs.descMeta}>
            <View style={fs.descProgressTrack}>
              <View
                style={[
                  fs.descProgressFill,
                  {
                    width: `${descProgress * 100}%`,
                    backgroundColor:
                      descProgress === 1 ? C.success : C.accent,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                fs.charCount,
                description.length >= MIN_DESC_LENGTH && { color: C.success },
              ]}
            >
              {description.length}/500
            </Text>
          </View>
        </FormField>

        {/* ── SECTION: GPS ── */}
        <SectionHeader icon="navigate-outline" title="GPS Location" />

        <LocationCard
          loading={loadingGps}
          location={gpsLocation}
          onRetry={fetchGps}
        />
        {fieldErrors.gps ? (
          <Text style={[fs.fieldError, { marginTop: 4, marginBottom: 12 }]}>
            {fieldErrors.gps}
          </Text>
        ) : null}

        {/* ── SECTION: PHOTOS ── */}
        <SectionHeader
          icon="camera-outline"
          title={`Photos (${images.length}/${MAX_IMAGES})`}
          optional
        />

        <View style={fs.photoRow}>
          <TouchableOpacity
            style={fs.photoBtn}
            onPress={() => addImage(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="camera" size={22} color={C.accent} />
            <Text style={fs.photoBtnText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={fs.photoBtn}
            onPress={() => addImage(false)}
            activeOpacity={0.75}
          >
            <Ionicons name="images-outline" size={22} color={C.accent} />
            <Text style={fs.photoBtnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={fs.thumbGrid}>
            {images.map((img, i) => (
              <ImageThumb
                key={i}
                uri={img.uri}
                onRemove={() => removeImage(i)}
              />
            ))}
            {images.length < MAX_IMAGES && (
              <TouchableOpacity
                style={fs.thumbAdd}
                onPress={() => addImage(false)}
              >
                <Ionicons name="add" size={28} color={C.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── SUBMIT ── */}
        <TouchableOpacity
          onPress={submitComplaint}
          disabled={isSubmitting || submitted}
          activeOpacity={0.85}
          style={fs.submitOuter}
        >
          <LinearGradient
            colors={
              isSubmitting || submitted
                ? C.gradientBtnDisabled
                : C.gradientBtn
            }
            style={fs.submitBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={fs.submitText}>Submitting…</Text>
              </>
            ) : (
              <>
                <Ionicons name="send" size={18} color="#fff" />
                <Text style={fs.submitText}>Submit Complaint</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </Animated.ScrollView>
    </View>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(22,163,74,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  headerRight: { width: 60, alignItems: "flex-end" },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },

  // Progress bar
  progressTrack: { height: 3, backgroundColor: C.surface },
  progressFill: { height: 3, backgroundColor: C.accent, borderRadius: 2 },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  // Info Banner
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(22,163,74,0.08)",
    borderWidth: 1,
    borderColor: "rgba(22,163,74,0.2)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: C.textSecondary, lineHeight: 20 },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "rgba(22,163,74,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  optionalBadge: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "600",
    backgroundColor: C.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Form Field
  fieldWrapper: { marginBottom: 18 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  required: { color: C.error },
  fieldError: { fontSize: 12, color: C.error, marginTop: 4, marginLeft: 2 },

  // Inputs
  pickerBox: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  textArea: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    fontSize: 15,
    color: C.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  textAreaShort: { minHeight: 80 },
  inputError: { borderColor: C.error },

  // Description meta
  descMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  descProgressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: C.border,
    borderRadius: 2,
  },
  descProgressFill: { height: 3, borderRadius: 2 },
  charCount: { fontSize: 12, color: C.textMuted, fontWeight: "500" },

  // Location card
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  locationPending: { backgroundColor: C.surface, borderColor: C.border },
  locationSuccess: {
    backgroundColor: "rgba(52,211,153,0.08)",
    borderColor: "rgba(52,211,153,0.3)",
  },
  locationError: {
    backgroundColor: "rgba(248,113,113,0.08)",
    borderColor: "rgba(248,113,113,0.3)",
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.success,
  },
  locationText: { fontSize: 14, fontWeight: "600" },
  locationCoords: {
    fontSize: 11,
    color: C.textMuted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginTop: 2,
  },

  // Photos
  photoRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  photoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 14,
  },
  photoBtnText: { fontSize: 14, color: C.accent, fontWeight: "600" },
  thumbGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  thumb: {
    position: "relative",
    width: 88,
    height: 88,
    borderRadius: 10,
    overflow: "hidden",
  },
  thumbImage: { width: "100%", height: "100%" },
  thumbRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: C.bg,
    borderRadius: 10,
  },
  thumbAdd: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },

  // Submit
  submitOuter: { marginTop: 8 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 14,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.4,
  },
});

const pickerStyle = {
  inputIOS: {
    fontSize: 15,
    paddingVertical: 14,
    paddingHorizontal: 14,
    color: C.textPrimary,
    paddingRight: 40,
  },
  inputAndroid: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: C.textPrimary,
    paddingRight: 40,
  },
  placeholder: { color: C.textMuted },
  iconContainer: { top: 14, right: 14 },
};