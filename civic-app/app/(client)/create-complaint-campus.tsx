// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ScrollView,
//   StatusBar,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import { useEffect, useState } from "react";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import RNPickerSelect from "react-native-picker-select";
// import { ISSUE_TYPES, LOCATION_LANDMARKS } from "@/src/utils/constants";
// import {
//   validateComplaintForm,
//   getErrorMessages,
//   hasErrorIssues,
// } from "@/src/services/complaintValidation.service";
// import api from "@/src/api/axios";

// export default function CreateComplaintCampus() {
//   const router = useRouter();
//   const [locationLandmark, setLocationLandmark] = useState<string | null>(null);
//   const [locationAddress, setLocationAddress] = useState("");
//   const [issueType, setIssueType] = useState<string | null>(null);
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [images, setImages] = useState<any[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingLocation, setLoadingLocation] = useState(true);

//   // 📍 Get GPS Location
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Required", "Location access is needed");
//         setLoadingLocation(false);
//         return;
//       }
//       try {
//         const loc = await Location.getCurrentPositionAsync({});
//         setLocation({
//           lat: loc.coords.latitude,
//           lng: loc.coords.longitude,
//         });
//       } catch (error) {
//         console.log("Location error:", error);
//       }
//       setLoadingLocation(false);
//     })();
//   }, []);

//   const pickImage = async () => {
//     if (images.length >= 5) {
//       Alert.alert("Limit Reached", "Maximum 5 images allowed");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       setImages([...images, result.assets[0]]);
//     }
//   };

//   const takePhoto = async () => {
//     if (images.length >= 5) {
//       Alert.alert("Limit Reached", "Maximum 5 images allowed");
//       return;
//     }

//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission Required", "Camera access is needed");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
//     if (!result.canceled) {
//       setImages([...images, result.assets[0]]);
//     }
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const submitComplaint = async () => {
//     const formData = {
//       type: "campus",
//       locationLandmark,
//       locationAddress,
//       issueType,
//       description,
//     };

//     const validationIssues = validateComplaintForm(formData);
//     if (hasErrorIssues(validationIssues)) {
//       Alert.alert("Validation Error", getErrorMessages(validationIssues));
//       return;
//     }

//     if (!location) {
//       Alert.alert("Location Required", "Please enable location services");
//       return;
//     }

//     setIsSubmitting(true);

//     const formPayload = new FormData();
//     formPayload.append("type", "campus");
//     formPayload.append("locationLandmark", locationLandmark || "");
//     formPayload.append("locationAddress", locationAddress);
//     formPayload.append("issueType", issueType || "");
//     formPayload.append("description", description);
//     formPayload.append(
//       "location",
//       JSON.stringify({
//         lat: location.lat,
//         lng: location.lng,
//       })
//     );

//     images.forEach((img) => {
//       const imageFile: any = {
//         uri: img.uri,
//         name: `photo_${Date.now()}.jpg`,
//         type: "image/jpeg",
//       };
//       formPayload.append("images", imageFile);
//     });

//     try {
//       await api.post("/complaints", formPayload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       Alert.alert("Success", "Your complaint has been submitted", [
//         { text: "OK", onPress: () => router.push("/my-complaints") },
//       ]);
//     } catch (err) {
//       console.log("ERROR:", err);
//       Alert.alert("Submission Failed", "Unable to submit complaint");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <LinearGradient colors={["#1e3a8a", "#3b82f6"]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Campus Complaint</Text>
//         <View style={styles.placeholder} />
//       </LinearGradient>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.infoBanner}>
//           <Ionicons name="information-circle" size={20} color="#2563eb" />
//           <Text style={styles.infoText}>Report campus facility issues</Text>
//         </View>

//         {/* Location - Landmark */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="location" size={16} color="#334155" /> Landmark / Area
//           </Text>
//           <View style={styles.pickerWrapper}>
//             <RNPickerSelect
//               onValueChange={(value: string | null) => setLocationLandmark(value)}
//               items={LOCATION_LANDMARKS}
//               placeholder={{ label: "Select a landmark...", value: null, color: "#94a3b8" }}
//               style={pickerSelectStyles}
//               Icon={() => <Ionicons name="chevron-down" size={20} color="#64748b" />}
//             />
//           </View>
//         </View>

//         {/* Location - Address */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="map" size={16} color="#334155" /> Address or Details *
//           </Text>
//           <View style={styles.textAreaWrapper}>
//             <TextInput
//               value={locationAddress}
//               onChangeText={setLocationAddress}
//               multiline
//               numberOfLines={3}
//               placeholder="e.g., Near the main gate, in front of library..."
//               style={styles.textArea}
//             />
//           </View>
//         </View>

//         {/* Issue Type */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="alert-circle" size={16} color="#334155" /> Issue Type *
//           </Text>
//           <View style={styles.pickerWrapper}>
//             <RNPickerSelect
//               onValueChange={(value: string | null) => setIssueType(value)}
//               items={ISSUE_TYPES}
//               placeholder={{ label: "Select issue type...", value: null, color: "#94a3b8" }}
//               style={pickerSelectStyles}
//               Icon={() => <Ionicons name="chevron-down" size={20} color="#64748b" />}
//             />
//           </View>
//         </View>

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="document-text" size={16} color="#334155" /> Description *
//           </Text>
//           <View style={styles.textAreaWrapper}>
//             <TextInput
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={6}
//               placeholder="Describe the issue in detail..."
//               style={styles.textArea}
//             />
//           </View>
//           <Text style={styles.charCount}>{description.length} characters</Text>
//         </View>

//         {/* Location GPS */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="navigate" size={16} color="#334155" /> GPS Location *
//           </Text>
//           <View style={styles.locationCard}>
//             {loadingLocation ? (
//               <>
//                 <ActivityIndicator color="#2563eb" />
//                 <Text style={{ marginLeft: 12, color: "#64748b" }}>Getting location...</Text>
//               </>
//             ) : location ? (
//               <>
//                 <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
//                 <View style={{ marginLeft: 12, flex: 1 }}>
//                   <Text style={{ fontWeight: "600", color: "#1e293b" }}>Location Captured</Text>
//                   <Text style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>
//                     {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
//                   </Text>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <Ionicons name="alert-circle" size={24} color="#ef4444" />
//                 <Text style={{ marginLeft: 12, color: "#ef4444" }}>Location not available</Text>
//               </>
//             )}
//           </View>
//         </View>

//         {/* Images */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="image" size={16} color="#334155" /> Photos ({images.length}/5)
//           </Text>
//           <View style={styles.imageActions}>
//             <TouchableOpacity style={styles.imageActionButton} onPress={takePhoto}>
//               <Ionicons name="camera" size={24} color="#2563eb" />
//               <Text style={styles.imageActionText}>Take Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.imageActionButton} onPress={pickImage}>
//               <Ionicons name="image" size={24} color="#2563eb" />
//               <Text style={styles.imageActionText}>Pick Image</Text>
//             </TouchableOpacity>
//           </View>

//           {images.length > 0 && (
//             <View style={styles.imagesGrid}>
//               {images.map((img, i) => (
//                 <View key={i} style={styles.imagePreview}>
//                   <Image source={{ uri: img.uri }} style={styles.previewImage} />
//                   <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(i)}>
//                     <Ionicons name="close-circle" size={24} color="#ef4444" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity onPress={submitComplaint} disabled={isSubmitting} activeOpacity={0.8} style={styles.submitButtonWrapper}>
//           <LinearGradient
//             colors={isSubmitting ? ["#94a3b8", "#64748b"] : ["#2563eb", "#1e40af"]}
//             style={styles.submitButton}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             {isSubmitting ? (
//               <>
//                 <ActivityIndicator color="#fff" />
//                 <Text style={styles.submitButtonText}>Submitting...</Text>
//               </>
//             ) : (
//               <>
//                 <Ionicons name="send" size={20} color="#fff" />
//                 <Text style={styles.submitButtonText}>Submit Complaint</Text>
//               </>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8fafc" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
//   headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
//   placeholder: { width: 40 },
//   content: { flex: 1, paddingHorizontal: 20 },
//   infoBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#eff6ff",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 20,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: "#bfdbfe",
//   },
//   infoText: { flex: 1, marginLeft: 12, fontSize: 14, color: "#1e40af", fontWeight: "500" },
//   section: { marginBottom: 24 },
//   label: { fontSize: 16, fontWeight: "700", color: "#334155", marginBottom: 12, letterSpacing: 0.2 },
//   pickerWrapper: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   textAreaWrapper: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   textArea: { padding: 16, fontSize: 16, color: "#1e293b", minHeight: 100, textAlignVertical: "top" },
//   charCount: { fontSize: 12, color: "#94a3b8", marginTop: 6, textAlign: "right" },
//   locationCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 16, borderRadius: 12, borderWidth: 1.5, borderColor: "#e2e8f0" },
//   imageActions: { flexDirection: "row", gap: 12, marginBottom: 16 },
//   imageActionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 16, borderRadius: 12, borderWidth: 1.5, borderColor: "#e2e8f0" },
//   imageActionText: { marginLeft: 8, fontSize: 14, color: "#2563eb", fontWeight: "600" },
//   imagesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//   imagePreview: { position: "relative", width: 100, height: 100, borderRadius: 12, overflow: "hidden" },
//   previewImage: { width: "100%", height: "100%" },
//   removeImageButton: { position: "absolute", top: -6, right: -6, backgroundColor: "#fff", borderRadius: 12 },
//   submitButtonWrapper: { marginTop: 8 },
//   submitButton: {
//     flexDirection: "row",
//     height: 56,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#2563eb",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   submitButtonText: { fontSize: 17, fontWeight: "700", color: "#fff", marginLeft: 8, letterSpacing: 0.5 },
// });

// const pickerSelectStyles = {
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     color: "#1e293b",
//     fontWeight: "500" as const,
//     paddingRight: 40,
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     color: "#1e293b",
//     fontWeight: "500" as const,
//     paddingRight: 40,
//   },
//   iconContainer: {
//     top: 16,
//     marginTop: -10,
//     right: 16,
//   },
// };

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
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import {
  ISSUE_TYPES,
  LOCATION_LANDMARKS,
} from "@/src/utils/constants";
import {
  validateComplaintForm,
  getErrorMessages,
  hasErrorIssues,
} from "@/src/services/complaintValidation.service";
import { createComplaint } from "@/src/api/complaint.api";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#f0fdf4",
  surface: "#ffffff",
  surfaceElevated: "#ecfdf5",
  border: "#86efac",
  borderFocus: "#22c55e",
  accent: "#16a34a",       // green-700
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

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

/** Animated label + input field with focus border */
type FieldErrors = {
  locationLandmark?: string | null;
  locationAddress?: string | null;
  issueType?: string | null;
  description?: string | null;
  gps?: string | null;
};

type IconName = ComponentProps<typeof Ionicons>["name"];

function FormField({ label, icon, error, required, children }: {
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

/** Step indicator pill at the top */
function StepBadge({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <View style={fs.stepBadge}>
      <Text style={fs.stepText}>
        {step}/{total} — {label}
      </Text>
    </View>
  );
}

/** Location status card */
function LocationCard({ loading, location, onRetry }: {
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
          <Text style={[fs.locationText, { color: C.success }]}>Location captured</Text>
          <Text style={fs.locationCoords}>
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </Text>
        </View>
        <Ionicons name="checkmark-circle" size={22} color={C.success} />
      </View>
    );
  }
  return (
    <TouchableOpacity style={[fs.locationCard, fs.locationError]} onPress={onRetry} activeOpacity={0.7}>
      <Ionicons name="alert-circle" size={20} color={C.error} />
      <Text style={[fs.locationText, { color: C.error, flex: 1 }]}>
        Location unavailable — tap to retry
      </Text>
      <Ionicons name="refresh" size={18} color={C.error} />
    </TouchableOpacity>
  );
}

/** Single image thumbnail with remove button */
function ImageThumb({ uri, onRemove }: { uri: string; onRemove: () => void }) {
  return (
    <View style={fs.thumb}>
      <Image source={{ uri }} style={fs.thumbImage} resizeMode="cover" />
      <TouchableOpacity style={fs.thumbRemove} onPress={onRemove} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Ionicons name="close-circle" size={20} color={C.error} />
      </TouchableOpacity>
    </View>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CreateComplaintCampus() {
  const router = useRouter();

  // Form state
  const [locationLandmark, setLocationLandmark] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [issueType, setIssueType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  // GPS
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingGps, setLoadingGps] = useState(true);

  // UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
    fetchGps();
  }, []);

  // ── GPS ────────────────────────────────────────────────────────────────────
  const fetchGps = async () => {
    setLoadingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location access is needed to file a complaint.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setGpsLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch (err) {
      console.warn("GPS error:", err);
    } finally {
      setLoadingGps(false);
    }
  };

  // ── IMAGES ─────────────────────────────────────────────────────────────────
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
    const result = await picker({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.75 });
    if (!result.canceled) setImages((prev) => [...prev, result.assets[0]]);
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  // ── VALIDATION ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errors: FieldErrors = {};
    if (!locationLandmark)
      errors.locationLandmark = "Please select a landmark.";
    if (!locationAddress.trim())
      errors.locationAddress = "Please describe the location.";
    if (!issueType)
      errors.issueType = "Please select an issue type.";
    if (description.trim().length < MIN_DESC_LENGTH)
      errors.description = `At least ${MIN_DESC_LENGTH} characters required.`;
    if (!gpsLocation)
      errors.gps = "GPS location is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── SUBMIT ─────────────────────────────────────────────────────────────────
  const submitComplaint = async () => {
    if (!validate()) {
      Alert.alert("Incomplete Form", "Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("type", "campus");
    formPayload.append("locationLandmark", locationLandmark ?? "");
    formPayload.append("locationAddress", locationAddress.trim());
    formPayload.append("issueType", issueType ?? "");
    formPayload.append("description", description.trim());
    formPayload.append("location", JSON.stringify(gpsLocation));

    images.forEach((img, i) => {
      const imageFile: any = {
        uri: img.uri,
        name: `campus_photo_${i}_${Date.now()}.jpg`,
        type: "image/jpeg",
      };
      formPayload.append("images", imageFile);
    });

    try {
      await createComplaint(formPayload);
      setSubmitted(true);
      Alert.alert(
        "✓ Complaint Filed",
        "Your campus complaint has been submitted. You'll receive updates on its progress.",
        [{ text: "View My Complaints", onPress: () => router.replace("/my-complaints") }]
      );
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Submission Failed", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  const descProgress = Math.min(description.length / 200, 1);
  const isFormReady  = locationLandmark && locationAddress && issueType &&
                       description.length >= MIN_DESC_LENGTH && gpsLocation;

  return (
    <View style={fs.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <LinearGradient colors={C.gradientHeader} style={fs.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity style={fs.backBtn} onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
            {
              width: `${Math.round(
                ([locationLandmark, locationAddress, issueType,
                  description.length >= MIN_DESC_LENGTH, gpsLocation
                ].filter(Boolean).length / 5) * 100
              )}%`,
            },
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
          <Ionicons name="information-circle-outline" size={18} color={C.accent} />
          <Text style={fs.infoText}>
            Report issues across campus facilities — buildings, pathways, utilities, and common areas.
          </Text>
        </View>

        {/* ── SECTION: LOCATION ── */}
        <SectionHeader icon="location-outline" title="Location Details" />

        <FormField label="Landmark / Area" icon="flag-outline" required error={fieldErrors.locationLandmark}>
          <View style={[fs.pickerBox, fieldErrors.locationLandmark && fs.inputError]}>
            <RNPickerSelect
              onValueChange={(v) => {
                setLocationLandmark(v);
                setFieldErrors((e) => ({ ...e, locationLandmark: null }));
              }}
              items={LOCATION_LANDMARKS}
              placeholder={{ label: "Select a landmark…", value: null }}
              style={pickerStyle}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Ionicons name="chevron-down" size={18} color={C.textSecondary} />}
            />
          </View>
        </FormField>

        <FormField label="Specific Location / Address" icon="map-outline" required error={fieldErrors.locationAddress}>
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
            style={[fs.textArea, fs.textAreaShort, fieldErrors.locationAddress && fs.inputError]}
          />
        </FormField>

        {/* ── SECTION: ISSUE ── */}
        <SectionHeader icon="construct-outline" title="Issue Details" />

        <FormField label="Issue Category" icon="alert-circle-outline" required error={fieldErrors.issueType}>
          <View style={[fs.pickerBox, fieldErrors.issueType && fs.inputError]}>
            <RNPickerSelect
              onValueChange={(v) => {
                setIssueType(v);
                setFieldErrors((e) => ({ ...e, issueType: null }));
              }}
              items={ISSUE_TYPES}
              placeholder={{ label: "Select issue type…", value: null }}
              style={pickerStyle}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Ionicons name="chevron-down" size={18} color={C.textSecondary} />}
            />
          </View>
        </FormField>

        <FormField label="Description" icon="document-text-outline" required error={fieldErrors.description}>
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
          {/* Progress bar for description */}
          <View style={fs.descMeta}>
            <View style={fs.descProgressTrack}>
              <View style={[fs.descProgressFill, { width: `${descProgress * 100}%`, backgroundColor: descProgress === 1 ? C.success : C.accent }]} />
            </View>
            <Text style={[fs.charCount, description.length >= MIN_DESC_LENGTH && { color: C.success }]}>
              {description.length} chars
            </Text>
          </View>
        </FormField>

        {/* ── SECTION: GPS ── */}
        <SectionHeader icon="navigate-outline" title="GPS Location" />

        <LocationCard loading={loadingGps} location={gpsLocation} onRetry={fetchGps} />
        {fieldErrors.gps ? <Text style={[fs.fieldError, { marginTop: 4, marginBottom: 12 }]}>{fieldErrors.gps}</Text> : null}

        {/* ── SECTION: PHOTOS ── */}
        <SectionHeader icon="camera-outline" title={`Photos (${images.length}/${MAX_IMAGES})`} optional />

        <View style={fs.photoRow}>
          <TouchableOpacity style={fs.photoBtn} onPress={() => addImage(true)} activeOpacity={0.75}>
            <Ionicons name="camera" size={22} color={C.accent} />
            <Text style={fs.photoBtnText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={fs.photoBtn} onPress={() => addImage(false)} activeOpacity={0.75}>
            <Ionicons name="images-outline" size={22} color={C.accent} />
            <Text style={fs.photoBtnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={fs.thumbGrid}>
            {images.map((img, i) => (
              <ImageThumb key={i} uri={img.uri} onRemove={() => removeImage(i)} />
            ))}
            {images.length < MAX_IMAGES && (
              <TouchableOpacity style={fs.thumbAdd} onPress={() => addImage(false)}>
                <Ionicons name="add" size={28} color={C.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── SUBMIT ── */}
        <TouchableOpacity
          onPress={submitComplaint}
          disabled={isSubmitting}
          activeOpacity={0.85}
          style={fs.submitOuter}
        >
          <LinearGradient
            colors={isSubmitting || submitted ? C.gradientBtnDisabled : C.gradientBtn}
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

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ icon, title, optional = false }: { icon: IconName; title: string; optional?: boolean }) {
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
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  headerIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "rgba(56,189,248,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  headerRight: { width: 60, alignItems: "flex-end" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: "500" },

  // Progress bar
  progressTrack: { height: 3, backgroundColor: C.surface },
  progressFill: { height: 3, backgroundColor: C.accent, borderRadius: 2 },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  // Info Banner
  infoBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "rgba(56,189,248,0.08)",
    borderWidth: 1, borderColor: "rgba(56,189,248,0.2)",
    borderRadius: 12, padding: 14, marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: C.textSecondary, lineHeight: 20 },

  // Section header
  sectionHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginTop: 8, marginBottom: 16,
  },
  sectionIconWrap: {
    width: 28, height: 28, borderRadius: 7,
    backgroundColor: "rgba(56,189,248,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: C.textSecondary, letterSpacing: 0.8, textTransform: "uppercase" },
  optionalBadge: {
    fontSize: 10, color: C.textMuted, fontWeight: "600",
    backgroundColor: C.surface, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5,
  },

  // Form Field
  fieldWrapper: { marginBottom: 18 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  required: { color: C.error },
  fieldError: { fontSize: 12, color: C.error, marginTop: 4, marginLeft: 2 },
  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: C.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textSecondary,
  },

  // Inputs
  pickerBox: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
  },
  textArea: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    padding: 14,
    fontSize: 15, color: C.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  textAreaShort: { minHeight: 80 },
  inputError: { borderColor: C.error },

  // Description meta
  descMeta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  descProgressTrack: { flex: 1, height: 3, backgroundColor: C.border, borderRadius: 2 },
  descProgressFill: { height: 3, borderRadius: 2 },
  charCount: { fontSize: 12, color: C.textMuted, fontWeight: "500" },

  // Location card
  locationCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 16,
  },
  locationPending: { backgroundColor: C.surface, borderColor: C.border },
  locationSuccess: { backgroundColor: "rgba(52,211,153,0.08)", borderColor: "rgba(52,211,153,0.3)" },
  locationError:   { backgroundColor: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)" },
  locationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.success },
  locationText: { fontSize: 14, fontWeight: "600" },
  locationCoords: { fontSize: 11, color: C.textMuted, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", marginTop: 2 },

  // Photos
  photoRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  photoBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.surface,
    borderRadius: 12, borderWidth: 1, borderColor: C.border,
    paddingVertical: 14,
  },
  photoBtnText: { fontSize: 14, color: C.accent, fontWeight: "600" },
  thumbGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  thumb: { position: "relative", width: 88, height: 88, borderRadius: 10, overflow: "hidden" },
  thumbImage: { width: "100%", height: "100%" },
  thumbRemove: {
    position: "absolute", top: 4, right: 4,
    backgroundColor: C.bg, borderRadius: 10,
  },
  thumbAdd: {
    width: 88, height: 88, borderRadius: 10,
    backgroundColor: C.surface,
    borderWidth: 1.5, borderColor: C.border, borderStyle: "dashed",
    justifyContent: "center", alignItems: "center",
  },

  // Submit
  submitOuter: { marginTop: 8 },
  submitBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    height: 54, borderRadius: 14,
    shadowColor: C.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  submitText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.4 },
});

const pickerStyle = {
  inputIOS: {
    fontSize: 15, paddingVertical: 14, paddingHorizontal: 14,
    color: C.textPrimary, paddingRight: 40,
  },
  inputAndroid: {
    fontSize: 15, paddingVertical: 12, paddingHorizontal: 14,
    color: C.textPrimary, paddingRight: 40,
  },
  placeholder: { color: C.textMuted },
  iconContainer: { top: 14, right: 14 },
};