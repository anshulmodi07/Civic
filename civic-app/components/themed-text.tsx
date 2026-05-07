import { Text, type TextProps } from "react-native";

type ThemedTextProps = TextProps & {
  type?: "default" | "defaultSemiBold" | "title" | "subtitle" | "link";
};

export function ThemedText({ style, type = "default", ...props }: ThemedTextProps) {
  const fontWeight = type === "defaultSemiBold" || type === "title" ? "700" : "400";
  const fontSize = type === "title" ? 24 : type === "subtitle" ? 18 : 14;

  return <Text style={[{ fontSize, fontWeight, color: "#11181c" }, style]} {...props} />;
}

export default ThemedText;
