import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import QuardBtn from "./quardBtn";
import { Colors } from "../utils/Colors";
import { TextInput } from "react-native-paper";

export default function CustomInputFieldCard({
  title,
  avatar,
  style,
  value,
  onChangeText,
  outlineColor,
}) {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.innerCard}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name={avatar}
            size={30}
            color={Colors.secondary}
          />
        </View>
        <View style={styles.labelContainer}>
          <TextInput
            label={title}
            value={value}
            placeholder={title}
            onChangeText={onChangeText}
            mode="outlined"
            activeOutlineColor={Colors.secondary}
            style={styles.inputField}
            outlineColor={outlineColor}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "100%",
    height: 65,
    flexDirection: "row",
  },
  innerCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderColor: Colors.primary,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    borderWidth: 0,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 0,
  },
  icon: {
    width: 55,
    height: 55,
  },
  inputField: {
    marginHorizontal: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    color: Colors.black,
    flex: 1,
    textAlign: "start",
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 15,
  },
  labelContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "left",
  },
  value: {
    fontSize: 16,
    color: Colors.grey,
    marginTop: 0,
    marginBottom: 5,
    textAlign: "left",
    marginLeft: 10,
    flex: 1,
    fontWeight: "normal",
  },
});
