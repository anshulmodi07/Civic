import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { HOSTEL_NAMES, ISSUE_TYPES } from "@/src/utils/constants";
import { createComplaint } from "@/src/api/complaint.api";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#eff6ff",
  surface: "#ffffff",
  surfaceElevated: "#dbeafe",
  border: "#c7d2fe",
  borderFocus: "#60a5fa",
  accent: "#2563eb",
  accentDim: "#3b82f6",
  success: "#165aa3",
  error: "#dc2626",
  textPrimary: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#64748b",
  gradientHeader: ["#60a5fa", "#2563eb"] as [string, string],
  gradientBtn: ["#3b82f6", "#2563eb"] as [string, string],
  gradientBtnDisabled: ["#cbd5e1", "#94a3b8"] as [string, string],
};

type IconName = ComponentProps<typeof Ionicons>["name"];
type Visibility = "public" | "private";

type FieldErrors = {
  hostelName?: string | null;
  floor?: string | null;
  roomNumber?: string | null;
  landmark?: string | null;
  departmentId?: string | null;
  description?: string | null;
  gps?: string | null;
};

const MAX_IMAGES = 5;
const MIN_DESC_LENGTH = 20;
const MAX_DESC_LENGTH = 500;

const FLOORS = ["Ground", "1", "2", "3", "4", "5", "6", "7", "8"].map((f) => ({
  label: f === "Ground" ? "Ground Floor" : `Floor ${f}`,
  value: f.toLowerCase(),
}));

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function FormField({
  label,
  icon,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  icon: IconName;
  error?: string | null;
  required?: boolean;
  hint?: string;
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
      {hint ? <Text style={fs.hint}>{hint}</Text> : null}
      {children}
      {error ? <Text style={fs.fieldError}>{error}</Text> : null}
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

function ChipRow({
  items,
  selected,
  onSelect,
  color,
}: {
  items: Array<{ label: string; value: string | null }>;
  selected: string;
  onSelect: (value: string | null) => void;
  color: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 12 }}
    >
      <View style={{ flexDirection: "row", gap: 8, paddingRight: 12 }}>
        {items.map((item) => {
          const active = selected === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onSelect(active ? null : item.value)}
              style={[fs.chip, active && { backgroundColor: color, borderColor: color }]}
              activeOpacity={0.75}
            >
              <Text style={[fs.chipText, active && { color: "#fff" }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// Public / Private visibility toggle
function VisibilityToggle({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  const opts: { key: Visibility; label: string; icon: IconName }[] = [
    { key: "public",  label: "Public",  icon: "globe-outline"       },
    { key: "private", label: "Private", icon: "lock-closed-outline" },
  ];
  return (
    <View style={fs.visibilityRow}>
      {opts.map(({ key, label, icon }) => {
        const active = value === key;
        return (
          <TouchableOpacity
            key={key}
            style={[fs.visibilityBtn, active && fs.visibilityBtnActive]}
            onPress={() => onChange(key)}
            activeOpacity={0.8}
          >
            <Ionicons name={icon} size={16} color={active ? "#fff" : C.textMuted} />
            <Text style={[fs.visibilityText, active && fs.visibilityTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CreateComplaintHostel() {
  const router = useRouter();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [hostelName,   setHostelName]   = useState<string | null>(null);
  const [floor,        setFloor]        = useState("");
  const [visibility,   setVisibility]   = useState<Visibility>("public");
  const [roomNumber,   setRoomNumber]   = useState("");   // only when private
  const [landmark,     setLandmark]     = useState("");   // only when public
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [description,  setDescription]  = useState("");
  const [images,       setImages]       = useState<ImagePicker.ImagePickerAsset[]>([]);

  // ── GPS ─────────────────────────────────────────────────────────────────────
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingGps,  setLoadingGps]  = useState(true);

  // ── UI ──────────────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({});

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
    fetchGps();
  }, []);

  // ── GPS ─────────────────────────────────────────────────────────────────────
  const fetchGps = async () => {
    setLoadingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location access is required to submit a complaint.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setGpsLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch (err) {
      console.warn("GPS error:", err);
    } finally {
      setLoadingGps(false);
    }
  };

  // ── Images ──────────────────────────────────────────────────────────────────
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

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!hostelName)
      errors.hostelName = "Please select your hostel.";

    if (!floor.trim())
      errors.floor = "Please enter the floor number.";

    if (visibility === "private" && !roomNumber.trim())
      errors.roomNumber = "Room number is required for private complaints.";

    if (visibility === "public" && !landmark.trim())
      errors.landmark = "Landmark is required for public complaints.";

    if (!departmentId)
      errors.departmentId = "Please select a department.";

    if (description.trim().length < MIN_DESC_LENGTH)
      errors.description = `At least ${MIN_DESC_LENGTH} characters required.`;

    if (description.trim().length > MAX_DESC_LENGTH)
      errors.description = `Description cannot exceed ${MAX_DESC_LENGTH} characters.`;

    if (!gpsLocation)
      errors.gps = "GPS location is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const submitComplaint = async () => {
    if (!validate()) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // FormData for multipart (image file upload)
      const formPayload = new FormData();
      formPayload.append("type",         "hostel");
      formPayload.append("hostelName",   hostelName ?? "");
      formPayload.append("floor",        floor.trim());
      formPayload.append("visibility",   visibility);
      formPayload.append("departmentId", departmentId ?? "");
      formPayload.append("description",  description.trim());
      formPayload.append("location",     JSON.stringify(gpsLocation));

      // Visibility-conditional fields
      if (visibility === "private") {
        formPayload.append("roomNumber", roomNumber.trim());
      } else {
        formPayload.append("landmark", landmark.trim());
      }

      // Images
      images.forEach((img, i) => {
        const imageFile: any = {
          uri:  img.uri,
          name: `hostel_photo_${i}_${Date.now()}.jpg`,
          type: "image/jpeg",
        };
        formPayload.append("images", imageFile);
      });

      await createComplaint(formPayload);

      Alert.alert(
        "✓ Complaint Filed",
        "Your hostel complaint has been submitted. The department will be notified shortly.",
        [{ text: "View My Complaints", onPress: () => router.replace("/my-complaints") }]
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

  // ── Derived ─────────────────────────────────────────────────────────────────
  const conditionalOk =
    visibility === "private" ? !!roomNumber.trim() : !!landmark.trim();

  const completedFields = [
    hostelName,
    floor,
    conditionalOk,
    departmentId,
    description.length >= MIN_DESC_LENGTH,
    gpsLocation,
  ].filter(Boolean).length;

  const progressPct  = Math.round((completedFields / 6) * 100);
  const descProgress = Math.min(description.length / MAX_DESC_LENGTH, 1);
  const descColor    =
    description.length > MAX_DESC_LENGTH
      ? C.error
      : description.length >= MIN_DESC_LENGTH
      ? C.success
      : C.accent;

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <View style={fs.root}>
      <StatusBar barStyle="light-content" />

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
            <Ionicons name="bed-outline" size={20} color="#fff" />
          </View>
          <Text style={fs.headerTitle}>Hostel Report</Text>
        </View>

        <View style={fs.headerRight}>
          <Text style={fs.progressLabel}>{progressPct}%</Text>
        </View>
      </LinearGradient>

      {/* ── PROGRESS BAR ── */}
      <View style={fs.progressTrack}>
        <View style={[fs.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        contentContainerStyle={fs.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── INFO BANNER ── */}
        <View style={fs.infoBanner}>
          <Ionicons name="home-outline" size={18} color={C.accent} />
          <Text style={fs.infoText}>
            Report maintenance issues in your hostel room or common areas. The
            assigned department will be notified automatically.
          </Text>
        </View>

        {/* ══ SECTION 1: ROOM DETAILS ══ */}
        <SectionHeader icon="business-outline" title="Room Details" />

        {/* Hostel Name */}
        <FormField
          label="Hostel Block"
          icon="flag-outline"
          required
          error={fieldErrors.hostelName}
        >
          <View style={[fs.pickerBox, fieldErrors.hostelName && fs.inputError]}>
            <RNPickerSelect
              onValueChange={(v) => {
                setHostelName(v);
                setFieldErrors((e) => ({ ...e, hostelName: null }));
              }}
              items={HOSTEL_NAMES}
              placeholder={{ label: "Select your hostel…", value: null }}
              style={pickerStyle}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons name="chevron-down" size={18} color={C.textSecondary} />
              )}
            />
          </View>
        </FormField>

        {/* Floor — chip + manual */}
        <FormField
          label="Floor"
          icon="layers-outline"
          required
          error={fieldErrors.floor}
          hint="Tap a chip or type manually"
        >
          <ChipRow
            items={FLOORS}
            selected={floor}
            onSelect={(v) => {
              setFloor(v || "");
              setFieldErrors((e) => ({ ...e, floor: null }));
            }}
            color={C.accent}
          />
          <TextInput
            value={floor}
            onChangeText={(t) => {
              setFloor(t);
              setFieldErrors((e) => ({ ...e, floor: null }));
            }}
            placeholder="Or type floor number…"
            placeholderTextColor={C.textMuted}
            style={[fs.input, fieldErrors.floor && fs.inputError]}
          />
        </FormField>

        {/* Visibility */}
        <FormField
          label="Visibility"
          icon="eye-outline"
          required
          hint={
            visibility === "public"
              ? "Shared area — enter a nearby landmark below"
              : "Your room — enter your room number below"
          }
        >
          <VisibilityToggle
            value={visibility}
            onChange={(v) => {
              setVisibility(v);
              // Clear the field that no longer applies
              if (v === "public") setRoomNumber("");
              else setLandmark("");
              setFieldErrors((e) => ({ ...e, roomNumber: null, landmark: null }));
            }}
          />
        </FormField>

        {/* Conditional: Room Number (private) */}
        {visibility === "private" && (
          <FormField
            label="Room Number"
            icon="open-outline"
            required
            error={fieldErrors.roomNumber}
          >
            <TextInput
              value={roomNumber}
              onChangeText={(t) => {
                setRoomNumber(t);
                setFieldErrors((e) => ({ ...e, roomNumber: null }));
              }}
              placeholder="e.g., 101, 204-A…"
              placeholderTextColor={C.textMuted}
              style={[fs.input, fieldErrors.roomNumber && fs.inputError]}
            />
          </FormField>
        )}

        {/* Conditional: Landmark (public) */}
        {visibility === "public" && (
          <FormField
            label="Landmark"
            icon="location-outline"
            required
            error={fieldErrors.landmark}
          >
            <TextInput
              value={landmark}
              onChangeText={(t) => {
                setLandmark(t);
                setFieldErrors((e) => ({ ...e, landmark: null }));
              }}
              placeholder="e.g., Near common room, Corridor 3…"
              placeholderTextColor={C.textMuted}
              style={[fs.input, fieldErrors.landmark && fs.inputError]}
            />
          </FormField>
        )}

        {/* ══ SECTION 2: ISSUE DETAILS ══ */}
        <SectionHeader icon="construct-outline" title="Issue Details" />

        {/* Department */}
        <FormField
          label="Department"
          icon="briefcase-outline"
          required
          error={fieldErrors.departmentId}
        >
          <View style={[fs.pickerBox, fieldErrors.departmentId && fs.inputError]}>
            <RNPickerSelect
              onValueChange={(v) => {
                setDepartmentId(v);
                setFieldErrors((e) => ({ ...e, departmentId: null }));
              }}
              items={ISSUE_TYPES}
              placeholder={{ label: "Select responsible department…", value: null }}
              style={pickerStyle}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons name="chevron-down" size={18} color={C.textSecondary} />
              )}
            />
          </View>
        </FormField>

        {/* Description */}
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
            placeholder={`Describe the problem clearly (min ${MIN_DESC_LENGTH} characters)…`}
            placeholderTextColor={C.textMuted}
            style={[fs.textArea, fieldErrors.description && fs.inputError]}
          />
          <View style={fs.descMeta}>
            <View style={fs.descProgressTrack}>
              <View
                style={[
                  fs.descProgressFill,
                  { width: `${descProgress * 100}%`, backgroundColor: descColor },
                ]}
              />
            </View>
            <Text style={[fs.charCount, { color: descColor }]}>
              {description.length}/{MAX_DESC_LENGTH}
            </Text>
          </View>
        </FormField>

        {/* ══ SECTION 3: GPS ══ */}
        <SectionHeader icon="navigate-outline" title="GPS Location" />

        <LocationCard
          loading={loadingGps}
          location={gpsLocation}
          onRetry={fetchGps}
        />
        {fieldErrors.gps && (
          <Text style={[fs.fieldError, { marginTop: -8, marginBottom: 16 }]}>
            {fieldErrors.gps}
          </Text>
        )}

        {/* ══ SECTION 4: PHOTOS ══ */}
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

        {/* ══ SUBMIT ══ */}
        <TouchableOpacity
          onPress={submitComplaint}
          disabled={isSubmitting}
          activeOpacity={0.85}
          style={fs.submitOuter}
        >
          <LinearGradient
            colors={isSubmitting ? C.gradientBtnDisabled : C.gradientBtn}
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
    backgroundColor: "rgba(255,255,255,0.15)",
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
    backgroundColor: "rgba(255,255,255,0.18)",
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
  progressLabel: { fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: "700" },

  // Progress bar
  progressTrack: { height: 3, backgroundColor: C.surfaceElevated },
  progressFill: { height: 3, backgroundColor: C.accent, borderRadius: 2 },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  // Info banner
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(37,99,235,0.06)",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.18)",
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
    backgroundColor: "rgba(37,99,235,0.10)",
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

  // Field wrapper
  fieldWrapper: { marginBottom: 18 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  label: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  required: { color: C.error },
  hint: { fontSize: 12, color: C.textMuted, marginBottom: 8 },
  fieldError: { fontSize: 12, color: C.error, marginTop: 4, marginLeft: 2 },

  // Picker
  pickerBox: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },

  // Input
  input: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: C.textPrimary,
    fontWeight: "500",
  },
  textArea: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    fontSize: 15,
    color: C.textPrimary,
    minHeight: 130,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  inputError: { borderColor: C.error },

  // Chips
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipText: { fontSize: 13, color: C.textSecondary, fontWeight: "600" },

  // Visibility toggle
  visibilityRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  visibilityBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  visibilityBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  visibilityText: { fontSize: 14, fontWeight: "600", color: C.textMuted },
  visibilityTextActive: { color: "#fff" },

  // Description meta
  descMeta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  descProgressTrack: { flex: 1, height: 3, backgroundColor: C.border, borderRadius: 2 },
  descProgressFill: { height: 3, borderRadius: 2 },
  charCount: { fontSize: 12, fontWeight: "500" },

  // Location
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
    backgroundColor: "rgba(22,90,163,0.06)",
    borderColor: "rgba(22,90,163,0.25)",
  },
  locationError: {
    backgroundColor: "rgba(220,38,38,0.06)",
    borderColor: "rgba(220,38,38,0.25)",
  },
  locationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.success },
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
  thumbGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  thumb: { position: "relative", width: 88, height: 88, borderRadius: 10, overflow: "hidden" },
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
  submitText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.4 },
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