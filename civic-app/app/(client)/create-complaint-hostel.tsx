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
// import { ISSUE_TYPES, HOSTEL_NAMES } from "@/src/utils/constants";
// import {
//   validateComplaintForm,
//   getErrorMessages,
//   hasErrorIssues,
// } from "@/src/services/complaintValidation.service";
// import api from "@/src/api/axios";

// export default function CreateComplaintHostel() {
//   const router = useRouter();
//   const [hostelName, setHostelName] = useState<string | null>(null);
//   const [floor, setFloor] = useState("");
//   const [roomNumber, setRoomNumber] = useState("");
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
//       type: "hostel",
//       hostelName,
//       floor,
//       roomNumber,
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
//     formPayload.append("type", "hostel");
//     formPayload.append("hostelName", hostelName ?? "");
//     formPayload.append("floor", floor);
//     formPayload.append("roomNumber", roomNumber);
//     formPayload.append("issueType", issueType ?? "");
//     formPayload.append("description", description);
//     formPayload.append(
//       "location",
//       JSON.stringify({
//         lat: location.lat,
//         lng: location.lng,
//       })
//     );

//     images.forEach((img) => {
//       const file: any = {
//         uri: img.uri,
//         name: `photo_${Date.now()}.jpg`,
//         type: "image/jpeg",
//       };
//       formPayload.append("images", file);
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
//         <Text style={styles.headerTitle}>Hostel Complaint</Text>
//         <View style={styles.placeholder} />
//       </LinearGradient>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.infoBanner}>
//           <Ionicons name="information-circle" size={20} color="#2563eb" />
//           <Text style={styles.infoText}>Report hostel facility issues</Text>
//         </View>

//         {/* Hostel Selection */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="home" size={16} color="#334155" /> Hostel *
//           </Text>
//           <View style={styles.pickerWrapper}>
//             <RNPickerSelect
//               onValueChange={(value) => setHostelName(value)}
//               items={HOSTEL_NAMES}
//               placeholder={{ label: "Select hostel...", value: null, color: "#94a3b8" }}
//               style={pickerSelectStyles}
//               useNativeAndroidPickerStyle={false}
//               Icon={() => <Ionicons name="chevron-down" size={20} color="#64748b" />}
//             />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="layers" size={16} color="#334155" /> Floor *
//           </Text>
//           <View style={styles.inputWrapper}>
//             <TextInput
//               value={floor}
//               onChangeText={setFloor}
//               placeholder="e.g., 1, 2, 3..."
//               keyboardType="number-pad"
//               style={styles.input}
//             />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="open-outline" size={16} color="#334155" /> Room Number *
//           </Text>
//           <View style={styles.inputWrapper}>
//             <TextInput value={roomNumber} onChangeText={setRoomNumber} placeholder="e.g., 101, 202..." style={styles.input} />
//           </View>
//         </View>

//         {/* Issue Type */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="alert-circle" size={16} color="#334155" /> Issue Type *
//           </Text>
//           <View style={styles.pickerWrapper}>
//             <RNPickerSelect
//               onValueChange={(value) => setIssueType(value)}
//               items={ISSUE_TYPES}
//               placeholder={{ label: "Select issue type...", value: null, color: "#94a3b8" }}
//               style={pickerSelectStyles}
//               useNativeAndroidPickerStyle={false}
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

//         {/* Location */}
//         <View style={styles.section}>
//           <Text style={styles.label}>
//             <Ionicons name="location" size={16} color="#334155" /> Location *
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
//   inputWrapper: {
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
//   input: { padding: 16, fontSize: 16, color: "#1e293b", fontWeight: "500" },
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
//   textArea: { padding: 16, fontSize: 16, color: "#1e293b", minHeight: 140, textAlignVertical: "top" },
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

// const pickerSelectStyles: any = {
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     color: "#1e293b",
//     fontWeight: "500" as const,
//     paddingRight: 40,
//     backgroundColor: "transparent",
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     color: "#1e293b",
//     fontWeight: "500" as const,
//     paddingRight: 40,
//     backgroundColor: "transparent",
//   },
//   iconContainer: {
//     top: 16,
//     marginTop: -10,
//     right: 16,
//   },
//   placeholder: {
//     color: "#94a3b8",
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
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import {
  ISSUE_TYPES,
  HOSTEL_NAMES,
} from "@/src/utils/constants";
import {
  validateComplaintForm,
  getErrorMessages,
  hasErrorIssues,
} from "@/src/services/complaintValidation.service";
import { createComplaint } from "@/src/api/complaint.api";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Hostel uses a warmer amber/teal palette to differentiate from campus blue
const C = {
  bg: "#0f172a",
  surface: "#1e293b",
  surfaceElevated: "#263347",
  border: "#334155",
  borderFocus: "#f59e0b",
  accent: "#f59e0b",       // amber-400  (hostel = warm tones)
  accentDim: "#d97706",
  success: "#34d399",
  error: "#f87171",
  warning: "#fbbf24",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#475569",
  gradientHeader: ["#451a03", "#78350f"],
  gradientBtn: ["#f59e0b", "#d97706"],
  gradientBtnDisabled: ["#334155", "#1e293b"],
};

const MAX_IMAGES = 5;
const MIN_DESC_LENGTH = 20;
const FLOORS = ["Ground", "1", "2", "3", "4", "5", "6", "7", "8"].map(
  (f) => ({ label: f === "Ground" ? "Ground Floor" : `Floor ${f}`, value: f.toLowerCase() })
);

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function FormField({ label, icon, error, required, hint, children }) {
  return (
    <View style={fs.fieldWrapper}>
      <View style={fs.labelRow}>
        <Ionicons name={icon} size={14} color={C.accent} />
        <Text style={fs.label}>{label}{required && <Text style={fs.required}> *</Text>}</Text>
      </View>
      {hint ? <Text style={fs.hint}>{hint}</Text> : null}
      {children}
      {error ? <Text style={fs.fieldError}>{error}</Text> : null}
    </View>
  );
}

function SectionHeader({ icon, title, optional = false }) {
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

function LocationCard({ loading, location, onRetry }) {
  if (loading) {
    return (
      <View style={[fs.locationCard, fs.locationPending]}>
        <ActivityIndicator color={C.accent} size="small" />
        <Text style={[fs.locationText, { color: C.textSecondary }]}>Acquiring GPS signal…</Text>
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
      <Text style={[fs.locationText, { color: C.error, flex: 1 }]}>Location unavailable — tap to retry</Text>
      <Ionicons name="refresh" size={18} color={C.error} />
    </TouchableOpacity>
  );
}

function ImageThumb({ uri, onRemove }) {
  return (
    <View style={fs.thumb}>
      <Image source={{ uri }} style={fs.thumbImage} resizeMode="cover" />
      <TouchableOpacity style={fs.thumbRemove} onPress={onRemove} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Ionicons name="close-circle" size={20} color={C.error} />
      </TouchableOpacity>
    </View>
  );
}

// ─── QUICK-SELECT CHIPS ───────────────────────────────────────────────────────
// Lets the user pick floor or common room numbers fast via chips
function ChipRow({ items, selected, onSelect, color }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
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
              <Text style={[fs.chipText, active && { color: "#fff" }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CreateComplaintHostel() {
  const router = useRouter();

  // Form state
  const [hostelName, setHostelName]   = useState(null);
  const [floor, setFloor]             = useState("");
  const [roomNumber, setRoomNumber]   = useState("");
  const [issueType, setIssueType]     = useState(null);
  const [description, setDescription] = useState("");
  const [images, setImages]           = useState([]);

  // GPS
  const [gpsLocation, setGpsLocation] = useState(null);
  const [loadingGps, setLoadingGps]   = useState(true);

  // UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors]   = useState({});

  // Animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
    fetchGps();
  }, []);

  // ── GPS ────────────────────────────────────────────────────────────────────
  const fetchGps = async () => {
    setLoadingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location access is required to submit a complaint.");
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
    const picker = fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await picker({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.75 });
    if (!result.canceled) setImages((prev) => [...prev, result.assets[0]]);
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  // ── VALIDATION ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!hostelName)                              errors.hostelName   = "Please select your hostel.";
    if (!floor.trim())                            errors.floor        = "Please enter the floor number.";
    if (!roomNumber.trim())                       errors.roomNumber   = "Please enter your room number.";
    if (!issueType)                               errors.issueType    = "Please select an issue category.";
    if (description.trim().length < MIN_DESC_LENGTH)
      errors.description = `At least ${MIN_DESC_LENGTH} characters required.`;
    if (!gpsLocation)                             errors.gps          = "GPS location is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── SUBMIT ─────────────────────────────────────────────────────────────────
  const submitComplaint = async () => {
    if (!validate()) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("type",        "hostel");
    formPayload.append("hostelName",  hostelName);
    formPayload.append("floor",       floor.trim());
    formPayload.append("roomNumber",  roomNumber.trim());
    formPayload.append("issueType",   issueType);
    formPayload.append("description", description.trim());
    formPayload.append("location",    JSON.stringify(gpsLocation));

    images.forEach((img, i) => {
      formPayload.append("images", {
        uri:  img.uri,
        name: `hostel_photo_${i}_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      await createComplaint(formPayload);
      Alert.alert(
        "✓ Complaint Filed",
        "Your hostel complaint has been submitted. Maintenance will be notified shortly.",
        [{ text: "View My Complaints", onPress: () => router.replace("/my-complaints") }]
      );
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Submission Failed", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── DERIVED ───────────────────────────────────────────────────────────────
  const completedFields = [hostelName, floor, roomNumber, issueType,
    description.length >= MIN_DESC_LENGTH, gpsLocation].filter(Boolean).length;
  const progressPct = Math.round((completedFields / 6) * 100);
  const descProgress = Math.min(description.length / 200, 1);

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
            <Ionicons name="bed-outline" size={20} color={C.accent} />
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
            Report maintenance issues in your hostel room or common areas. Your warden will be notified automatically.
          </Text>
        </View>

        {/* ── SECTION: HOSTEL DETAILS ── */}
        <SectionHeader icon="business-outline" title="Room Details" />

        <FormField label="Hostel Block" icon="flag-outline" required error={fieldErrors.hostelName}>
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
              Icon={() => <Ionicons name="chevron-down" size={18} color={C.textSecondary} />}
            />
          </View>
        </FormField>

        {/* Floor — chip quick-select + manual fallback */}
        <FormField label="Floor" icon="layers-outline" required error={fieldErrors.floor} hint="Tap a chip or type manually">
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
            keyboardType="default"
            style={[fs.input, fieldErrors.floor && fs.inputError]}
          />
        </FormField>

        <FormField label="Room Number" icon="open-outline" required error={fieldErrors.roomNumber}>
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
            placeholder={`Describe the problem clearly (min ${MIN_DESC_LENGTH} characters)…`}
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
                    backgroundColor: descProgress === 1 ? C.success : C.accent,
                  },
                ]}
              />
            </View>
            <Text style={[fs.charCount, description.length >= MIN_DESC_LENGTH && { color: C.success }]}>
              {description.length} chars
            </Text>
          </View>
        </FormField>

        {/* ── SECTION: GPS ── */}
        <SectionHeader icon="navigate-outline" title="GPS Location" />

        <LocationCard loading={loadingGps} location={gpsLocation} onRetry={fetchGps} />
        {fieldErrors.gps && (
          <Text style={[fs.fieldError, { marginTop: -8, marginBottom: 16 }]}>{fieldErrors.gps}</Text>
        )}

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
    flexDirection: "row", alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 18, paddingHorizontal: 16,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  headerIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "rgba(245,158,11,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  headerRight: { width: 60, alignItems: "flex-end" },
  progressLabel: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "700" },

  // Progress
  progressTrack: { height: 3, backgroundColor: C.surface },
  progressFill: { height: 3, backgroundColor: C.accent, borderRadius: 2 },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  // Info Banner
  infoBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "rgba(245,158,11,0.07)",
    borderWidth: 1, borderColor: "rgba(245,158,11,0.22)",
    borderRadius: 12, padding: 14, marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: C.textSecondary, lineHeight: 20 },

  // Section header
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 16 },
  sectionIconWrap: {
    width: 28, height: 28, borderRadius: 7,
    backgroundColor: "rgba(245,158,11,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  sectionTitle: {
    fontSize: 13, fontWeight: "700", color: C.textSecondary,
    letterSpacing: 0.8, textTransform: "uppercase",
  },
  optionalBadge: {
    fontSize: 10, color: C.textMuted, fontWeight: "600",
    backgroundColor: C.surface, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5,
  },

  // Field
  fieldWrapper: { marginBottom: 18 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  label: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  required: { color: C.error },
  hint: { fontSize: 12, color: C.textMuted, marginBottom: 8 },
  fieldError: { fontSize: 12, color: C.error, marginTop: 4, marginLeft: 2 },

  // Inputs
  pickerBox: {
    backgroundColor: C.surface, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
  },
  input: {
    backgroundColor: C.surface, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    paddingVertical: 14, paddingHorizontal: 14,
    fontSize: 15, color: C.textPrimary, fontWeight: "500",
  },
  textArea: {
    backgroundColor: C.surface, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    padding: 14, fontSize: 15, color: C.textPrimary,
    minHeight: 130, textAlignVertical: "top", lineHeight: 22,
  },
  inputError: { borderColor: C.error },

  // Chips
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  chipText: { fontSize: 13, color: C.textSecondary, fontWeight: "600" },

  // Desc meta
  descMeta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  descProgressTrack: { flex: 1, height: 3, backgroundColor: C.border, borderRadius: 2 },
  descProgressFill: { height: 3, borderRadius: 2 },
  charCount: { fontSize: 12, color: C.textMuted, fontWeight: "500" },

  // Location
  locationCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 16,
  },
  locationPending: { backgroundColor: C.surface, borderColor: C.border },
  locationSuccess: { backgroundColor: "rgba(52,211,153,0.08)", borderColor: "rgba(52,211,153,0.3)" },
  locationError:   { backgroundColor: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)" },
  locationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.success },
  locationText: { fontSize: 14, fontWeight: "600" },
  locationCoords: {
    fontSize: 11, color: C.textMuted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", marginTop: 2,
  },

  // Photos
  photoRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  photoBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.surface,
    borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingVertical: 14,
  },
  photoBtnText: { fontSize: 14, color: C.accent, fontWeight: "600" },
  thumbGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  thumb: { position: "relative", width: 88, height: 88, borderRadius: 10, overflow: "hidden" },
  thumbImage: { width: "100%", height: "100%" },
  thumbRemove: { position: "absolute", top: 4, right: 4, backgroundColor: C.bg, borderRadius: 10 },
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