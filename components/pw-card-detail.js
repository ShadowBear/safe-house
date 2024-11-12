import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Colors } from "../utils/Colors";
import { showPasswordHandler } from "../utils/pwHelper";

export default function PwCardDetails({
  user,
  password,
  isNewCardMode,
  onPress,
}) {
  const [userName, setUserName] = useState(user);
  const [pwIsVisible, setPasswordIsVisible] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [pw, setPW] = useState(password);
  const pwRef = useRef(null);
  const [isEditMode, setEditMode] = useState(false);

  let actionButton = null;
  let editButton = null;
  let newPwText = null;

  if (isNewCardMode) {
    newPwText = <Text style={styles.newLabel}>New Password</Text>;
    actionButton = (
      <Button
        icon="key-plus"
        mode="outlined"
        onPress={() => {
          console.log("Add new PW");
          setPW("");
          setUserName("");
          Keyboard.dismiss();
          onPress({ newAccount: { userName: userName, password: pw } });
        }}
        contentStyle={styles.button}
      >
        Add
      </Button>
    );
    editButton = <View></View>;
  } else {
    actionButton = (
      <Button
        icon="delete-outline"
        mode="outlined"
        onPress={() => {
          console.log("Delete");
        }}
        contentStyle={styles.button}
      >
        Delete
      </Button>
    );
    editButton = (
      <Button
        icon="note-edit-outline"
        mode="outlined"
        onPress={() => {
          console.log("Edit");
          editModeHandler();
        }}
        contentStyle={styles.button}
      >
        Edit
      </Button>
    );
  }

  function editModeHandler() {
    setEditMode(!isEditMode);
    if (isEditMode) {
      pwRef.current.focus();
    }
  }

  return (
    <View style={isNewCardMode ? styles.newContainer : styles.container}>
      <View style={styles.inputContainer}>
        {newPwText}
        <TextInput
          activeOutlineColor={Colors.info}
          mode="outlined"
          label="User"
          placeholder="User"
          onChangeText={setUserName}
          value={userName}
          style={styles.inputAcc}
        />
        <TextInput
          ref={pwRef}
          activeOutlineColor={Colors.info}
          mode="outlined"
          label="Password"
          placeholder="Password"
          onChangeText={setPW}
          value={pw}
          style={styles.inputPw}
          secureTextEntry={pwIsVisible}
          right={
            <TextInput.Icon
              icon={eyeIcon}
              onPress={() =>
                showPasswordHandler({
                  pwIsVisible: pwIsVisible,
                  setPassword: setPasswordIsVisible,
                  setIcon: setEyeIcon,
                  ref: pwRef,
                })
              }
            />
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.divider}>{actionButton}</View>
        <View style={styles.divider}>{editButton}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: "100%",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.info,
    backgroundColor: Colors.info2,
    borderRadius: 8,
  },
  newContainer: {
    height: 210,
    width: "100%",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  newLabel: {
    fontSize: 15,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    height: 62,
    justifyContent: "space-around",
    paddingVertical: 10,
    flexDirection: "row",
  },
  divider: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row-reverse",
  },
  inputAcc: {
    alignSelf: "stretch",
  },
  inputPw: {
    alignSelf: "stretch",
  },
});
