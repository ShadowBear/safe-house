import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../utils/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-paper";
import QuardBtn from "./quardBtn";
import { useNavigation } from "@react-navigation/native";

export default function NewPwCard() {
  const [categoryName, setCategoryName] = useState("");
  const navigation = useNavigation();

  function addNewCategoryHandler() {
    navigation.navigate("PwDetails", { accounts: [], category: categoryName });
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <MaterialCommunityIcons name="new-box" size={24} color={Colors.info} />
      </View>
      <View style={styles.textInputContainer}>
        {/* <Text>Sample Mitte</Text> */}
        <TextInput
          label="Add new"
          mode="outlined"
          value={categoryName}
          onChangeText={setCategoryName}
          activeOutlineColor={Colors.info}
          placeholder="Add new"
          style={styles.textInput}
        />
      </View>
      <View style={styles.btn}>
        <QuardBtn
          name="key-plus"
          size={24}
          onPress={addNewCategoryHandler}
          color={Colors.info}
          style={styles.addBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    marginVertical: 15,
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.info,
  },
  avatar: {
    width: "15%",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    width: "70%",
    paddingHorizontal: 10,
    paddingBottom: 5,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textInput: {
    width: "100%",
  },
  btn: {
    width: "15%",
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: 55,
    height: 55,
    borderColor: Colors.info,
    backgroundColor: Colors.lightGrey,
  },
});
