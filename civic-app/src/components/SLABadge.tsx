import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  breached: boolean;
  showIcon?: boolean;
  compact?: boolean;
};

export default function SLABadge({
  breached,
  showIcon = true,
  compact = false,
}: Props) {
  const config = breached
    ? {
        bg: "#fee2e2",
        text: "#dc2626",
        border: "#fecaca",
        icon: "alert-circle",
        label: "SLA Breach",
      }
    : {
        bg: "#dcfce7",
        text: "#15803d",
        border: "#bbf7d0",
        icon: "checkmark-circle",
        label: "On Time",
      };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        compact && styles.compact,
      ]}
    >
      {showIcon && (
        <Ionicons
          name={config.icon as any}
          size={compact ? 12 : 14}
          color={config.text}
          style={styles.icon}
        />
      )}

      {/* DOT / PULSE */}
      <View style={[styles.pulse, { backgroundColor: config.text }]}>
        {breached && (
          <View
            style={[styles.pulseRing, { borderColor: config.text }]}
          />
        )}
      </View>

      <Text
        style={[
          styles.text,
          { color: config.text },
          compact && styles.textCompact,
        ]}
      >
        {config.label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  compact: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  icon: {
    marginRight: 6,
  },

  pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    position: "relative",
  },

  pulseRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    top: -3,
    left: -3,
    opacity: 0.5,
  },

  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  textCompact: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
});