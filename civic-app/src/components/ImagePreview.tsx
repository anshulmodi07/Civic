import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  uri: string;
  style?: any;
  size?: number;
  borderRadius?: number;
  showOverlay?: boolean;
  onPress?: (uri: string) => void;
  onRemove?: (uri: string) => void;
};

export default function ImagePreview({
  uri,
  style,
  size = 100,
  borderRadius = 12,
  showOverlay = false,
  onPress,
  onRemove,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!uri) return null;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius,
  };

  const imageStyle = {
    width: size,
    height: size,
    borderRadius,
  };

  const handlePress = () => {
    if (onPress) onPress(uri);
  };

  const handleRemove = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove(uri);
  };

  if (hasError) {
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          styles.errorContainer,
          style,
        ]}
      >
        <Ionicons name="image-outline" size={32} color="#94a3b8" />
      </View>
    );
  }

  const ImageComponent = (
    <View style={[styles.container, containerStyle, style]}>
      <Image
        source={{ uri }}
        style={imageStyle}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        resizeMode="cover"
      />

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#2563eb" />
        </View>
      )}

      {/* Overlay */}
      {showOverlay && !isLoading && (
        <View style={styles.overlay}>
          <Ionicons name="expand-outline" size={18} color="#fff" />
        </View>
      )}

      {/* Remove Button */}
      {onRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={22} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        {ImageComponent}
      </TouchableOpacity>
    );
  }

  return ImageComponent;
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  loadingOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(248, 250, 252, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
});