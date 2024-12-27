import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Numberfield({ number, size, color, onPress }) {
  return (
    <View>
      <Pressable onPress={() => onPress(number)}>
        <MaterialCommunityIcons
          size={size}
          color={color}
          name={`numeric-${number}-box-outline`}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
