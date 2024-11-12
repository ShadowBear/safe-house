import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function QuardBtn({ name, size, onPress, color, style }) {
  return (
    <Pressable style={[style, styles.container]} onPress={onPress}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: "0e0e0e#",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
