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
  onPressNew,
  onPressSave,
  onPressDelete,
  id,
}) {
  const [userName, setUserName] = useState(user);
  const [pwIsVisible, setPasswordIsVisible] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [pw, setPW] = useState(password);
  const pwRef = useRef(null);
  const [isEditMode, setEditMode] = useState(false);
  const [prevUserName, setPrevUserName] = useState("");
  const [prevPw, setPrevPw] = useState("");

  let actionButton = null;
  let editButton = null;
  let newPwText = null;

  // New Card Mode:
  if (isNewCardMode) {
    newPwText = <Text style={styles.newLabel}>New Password</Text>;
    actionButton = (
      <Button
        icon="key-plus"
        mode="outlined"
        onPress={() => {
          onPressNew({ newAccount: { userName: userName, password: pw } });
          setPW("");
          setUserName("");
          Keyboard.dismiss();
        }}
        contentStyle={styles.button}
      >
        Add
      </Button>
    );
    editButton = <View></View>;
  }
  // Edit Mode Card Buttons:
  else if (isEditMode) {
    actionButton = (
      <Button
        icon="cancel"
        mode="outlined"
        onPress={() => {
          // Reset Inputs and switch to none Edit Mode
          setUserName(prevUserName);
          setPW(prevPw);
          setEditMode(false);
        }}
        contentStyle={styles.button}
      >
        Cancel
      </Button>
    );
    editButton = (
      <Button
        icon="content-save-outline"
        mode="outlined"
        onPress={() => {
          setEditMode(false);
          // Todo: Save and update current Credentials change
          onPressSave({
            updatedPwData: { id: id, userName: userName, password: pw },
          });
        }}
        contentStyle={styles.button}
      >
        Save
      </Button>
    );
  }
  // Default Edit and Delete Mode Card Buttons
  else {
    actionButton = (
      <Button
        icon="delete-outline"
        mode="outlined"
        onPress={() => {
          onPressDelete({ id: id });
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
          editModeHandler();
        }}
        contentStyle={styles.button}
      >
        Edit
      </Button>
    );
  }

  function editModeHandler() {
    //change Buttons to save/cancel and save original data for cancel
    setEditMode(true);
    setPrevPw(pw);
    setPrevUserName(userName);
    pwRef.current.focus();
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
          onChangeText={(text) => {
            if (isEditMode || isNewCardMode) setUserName(text);
          }}
          value={userName}
          style={styles.inputAcc}
        />
        <TextInput
          ref={pwRef}
          activeOutlineColor={Colors.info}
          mode="outlined"
          label="Password"
          placeholder="Password"
          // onChangeText={setPW}
          onChangeText={(text) => {
            if (isEditMode || isNewCardMode) setPW(text);
          }}
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
