import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../utils/Colors";

export default function QuardBtn({
  name,
  size,
  onPress,
  color,
  style,
  backgroundColor,
}) {
  let btnColor = Colors.white;
  if (backgroundColor) btnColor = backgroundColor;

  return (
    <Pressable style={[style, styles.container]} onPress={onPress}>
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={[btnColor, btnColor]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.linearGradient}>
          <MaterialCommunityIcons name={name} size={size} color={color} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    overflow: "hidden",
  },

  linearGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
