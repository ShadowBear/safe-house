import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Colors } from "../utils/Colors";
import { BlurView } from "expo-blur";

export default function DeleteModal({ title, body, onDelete, onCancel }) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [inputText, setInputText] = useState("");

  const handleChangeText = (text) => {
    console.log(text);
    setInputText(text);
    let isDisable = text !== "Delete";
    console.log("Is Disable: " + isDisable);
    setIsDisabled(isDisable);
  };

  return (
    <TouchableOpacity
      style={styles.screen}
      onPress={onCancel}
      activeOpacity={1}
    >
      <BlurView intensity={80} tint="light" style={styles.modal}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.title}>
              <Text style={styles.titleTxt}>{title}</Text>
            </View>
            <View style={styles.body}>
              <Text>{body}</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                value={inputText}
                style={styles.textInput}
                onChangeText={handleChangeText}
              />
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.divider}>
                <Button
                  mode="contained"
                  onPress={onCancel}
                  contentStyle={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
              <View style={styles.divider}>
                <Button
                  mode="contained"
                  onPress={onDelete}
                  contentStyle={styles.okButton}
                  disabled={isDisabled}
                >
                  Delete
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    width: "auto",
    margin: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 6,
    height: "auto",
  },
  title: {
    height: 25,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleTxt: {
    fontSize: 15,
    fontWeight: "bold",
  },
  textInputContainer: {
    width: "auto",
    height: 50,
  },
  textInput: {
    width: "auto",
    height: 40,
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    height: "auto",
  },
  buttonContainer: {
    height: 40,
    width: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 0,
    borderColor: Colors.darkGrey,
    paddingHorizontal: 20,
  },
  okButton: { backgroundColor: Colors.primary, width: "100" },
  cancelButton: { backgroundColor: Colors.error, width: "100" },
  divider: { marginHorizontal: 10 },

  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
