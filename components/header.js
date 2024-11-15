import { StyleSheet, Text } from "react-native";
import React from "react";
import { Colors } from "../utils/Colors";

export default function CustomHeader() {
  return <Text style={styles.text}>SafeHouse</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    textAlign: "left",
    color: Colors.black,
  },
});
