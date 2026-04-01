import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ImagePreview({ 
  uri, 
  style, 
  size = 100, 
  borderRadius = 12,
  showOverlay = false,
  onPress,
  onRemove
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!uri) return null;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: borderRadius,
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius,
  };

  const handlePress = () => {
    if (onPress) onPress(uri);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(uri);
  };

  if (hasError) {
    return (
      <View style={[styles.container, containerStyle, styles.errorContainer, style]}>
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
      
      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#2563eb" />
        </View>
      )}

      {/* Interactive Overlay */}
      {showOverlay && !isLoading && (
        <View style={styles.overlay}>
          <Ionicons name="expand-outline" size={20} color="#fff" />
        </View>
      )}

      {/* Remove Button */}
      {onRemove && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={handleRemove}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={24} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {ImageComponent}
      </TouchableOpacity>
    );
  }

  return ImageComponent;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
});