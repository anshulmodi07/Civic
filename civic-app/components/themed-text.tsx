import { Text, type TextProps, StyleSheet } from "react-native";

type ThemedTextProps = TextProps & {
  type?: "default" | "defaultSemiBold" | "title" | "subtitle" | "link";
};

export function ThemedText({ style, type = "default", ...rest }: ThemedTextProps) {
  return <Text style={[styles.default, styles[type], style]} {...rest} />;
}

export default ThemedText;

const styles = StyleSheet.create({
  default: {
    color: "#11181c",
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  link: {
    color: "#0a7ea4",
  },
});
