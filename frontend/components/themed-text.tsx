import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({ style, type = "default", ...rest }: ThemedTextProps) {
  return (
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 17,
    lineHeight: 26,
  },
  defaultSemiBold: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "600",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 26,
    fontSize: 17,
  },
});
