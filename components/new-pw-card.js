import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../utils/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-paper";
import QuardBtn from "./quardBtn";
import { useNavigation } from "@react-navigation/native";
import { addNewPwData } from "../utils/databaseHelper";
import { PwData, User, Credential, randomAvatar } from "../model/pwData";

export default function NewPwCard() {
  const [categoryName, setCategoryName] = useState("");
  const navigation = useNavigation();

  function addNewCategoryHandler() {
    const avatar = randomAvatar();
    //Todo: Check if category name already exists
    const sample = new PwData(avatar, categoryName, []);
    addNewPwData(sample);
    setCategoryName("");
    navigation.navigate("PwDetails", {
      accounts: sample.pwData,
      category: sample.title,
      id: sample.id,
    });
    // navigation.navigate("PwDetails", { accounts: [], category: categoryName });
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <MaterialCommunityIcons
          name="new-box"
          size={24}
          color={Colors.secondary}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          label="Add new"
          mode="outlined"
          value={categoryName}
          onChangeText={setCategoryName}
          activeOutlineColor={Colors.secondary}
          placeholder="Add new"
          style={styles.textInput}
        />
      </View>
      <View style={styles.btn}>
        <QuardBtn
          name="plus"
          size={24}
          onPress={addNewCategoryHandler}
          color={Colors.primary}
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
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    boxShadow: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  avatar: {
    width: 55,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    marginVertical: 12,
    marginLeft: 10,
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
    backgroundColor: Colors.primary100,
  },
});
