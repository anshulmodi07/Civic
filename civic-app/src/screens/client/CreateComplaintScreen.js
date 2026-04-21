import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { ISSUE_TYPES } from "../../utils/constants";
// import { createComplaint } from "../../api/complaint.api";
import api from "../../api/axios";

export default function CreateComplaintScreen({ navigation }) {
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState(null);
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // 📍 Get GPS
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location access is needed to report issues");
        setLoadingLocation(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
      } catch (error) {
        Alert.alert("Location Error", "Unable to get current location");
      }
      setLoadingLocation(false);
    })();
  }, []);

  // 🖼 Pick Image
  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit Reached", "Maximum 5 images allowed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  // 📸 Take Photo
  const takePhoto = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit Reached", "Maximum 5 images allowed");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera access is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  // 🗑 Remove Image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 🚀 Submit Complaint
  const submitComplaint = async () => {
  if (!description.trim()) {
    Alert.alert("Validation Error", "Please provide a description");
    return;
  }

  if (!issueType) {
    Alert.alert("Validation Error", "Please select an issue type");
    return;
  }

  if (!location) {
    Alert.alert("Location Required", "Please enable location services");
    return;
  }

  setIsSubmitting(true);

  const formData = new FormData();

  formData.append("description", description);
  formData.append("issueType", issueType);

  formData.append(
    "location",
    JSON.stringify({
      lat: location.lat,
      lng: location.lng,
    })
  );

  images.forEach((img) => {
    formData.append("images", {
      uri: img.uri,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    });
  });

  try {
    await api.post("/complaints", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Alert.alert(
      "Success",
      "Your complaint has been submitted successfully",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);

    Alert.alert(
      "Submission Failed",
      "Unable to submit complaint. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Raise Complaint</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#2563eb" />
          <Text style={styles.infoText}>
            Help us serve you better by providing detailed information
          </Text>
        </View>

        {/* Issue Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Ionicons name="list" size={16} color="#334155" /> Issue Type *
          </Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(value) => setIssueType(value)}
              items={ISSUE_TYPES}
              placeholder={{
                label: "Select an issue type...",
                value: null,
                color: '#94a3b8',
              }}
              style={pickerSelectStyles}
              Icon={() => <Ionicons name="chevron-down" size={20} color="#64748b" />}
            />
          </View>
          {issueType && (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={styles.selectedText}>{ISSUE_TYPES.find(t => t.value === issueType)?.label}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Ionicons name="document-text" size={16} color="#334155" /> Description *
          </Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              style={styles.textArea}
              placeholder="Describe the issue in detail..."
              placeholderTextColor="#94a3b8"
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.charCount}>{description.length} characters</Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Ionicons name="location" size={16} color="#334155" /> Location *
          </Text>
          <View style={styles.locationCard}>
            {loadingLocation ? (
              <View style={styles.locationLoading}>
                <ActivityIndicator color="#2563eb" />
                <Text style={styles.locationLoadingText}>Getting your location...</Text>
              </View>
            ) : location ? (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Location Captured</Text>
                  <Text style={styles.locationCoords}>
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Ionicons name="alert-circle" size={24} color="#ef4444" />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Location Not Available</Text>
                  <Text style={styles.locationError}>Please enable location services</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Ionicons name="image" size={16} color="#334155" /> Evidence Photos ({images.length}/5)
          </Text>
          
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={takePhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={24} color="#2563eb" />
              <Text style={styles.imageActionText}>Take Photo</Text>
            </TouchableOpacity>

            
          </View>

          {images.length > 0 && (
            <View style={styles.imagesGrid}>
              {images.map((img, i) => (
                <View key={i} style={styles.imagePreview}>
                  <Image source={{ uri: img.uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(i)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={submitComplaint}
          disabled={isSubmitting}
          activeOpacity={0.8}
          style={styles.submitButtonWrapper}
        >
          <LinearGradient
            colors={isSubmitting ? ['#94a3b8', '#64748b'] : ['#2563eb', '#1e40af']}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Submit Complaint</Text>
              </>
            )}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  selectedText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#15803d',
    fontWeight: '600',
  },
  textAreaWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    minHeight: 140,
  },
  charCount: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'right',
    fontWeight: '500',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationLoadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  locationCoords: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  locationError: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  imageActionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imagePreview: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  submitButtonWrapper: {
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: '#1e293b',
    fontWeight: '500',
    paddingRight: 40,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#1e293b',
    fontWeight: '500',
    paddingRight: 40,
  },
  iconContainer: {
    top: '50%',
    marginTop: -10,
    right: 16,
  },
  placeholder: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500',
  },
};