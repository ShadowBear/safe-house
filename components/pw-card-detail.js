import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Colors } from "../utils/Colors";
import { showPasswordHandler } from "../utils/pwHelper";
import { AuthContext } from "../context/AuthContext";
import { decrypt } from "../utils/crypoHelper";

export default function PwCardDetails({
  user,
  password,
  onPressSave,
  onPressDelete,
  id,
  resetInputs,
}) {
  const [userName, setUserName] = useState(user);
  const [pwIsVisible, setPasswordIsVisible] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [pw, setPW] = useState(password);
  const pwRef = useRef(null);
  const [isEditMode, setEditMode] = useState(false);
  const [prevUserName, setPrevUserName] = useState("");
  const [prevPw, setPrevPw] = useState("");
  const authCtx = useContext(AuthContext);

  let actionButton = null;
  let editButton = null;

  useEffect(() => {
    if (resetInputs) {
      setPW("");
      setUserName("");
    }
  }, [resetInputs]);

  useEffect(() => {
    async function showDecrypt() {
      if (!authCtx.key) return;
      const decryptedPw = await decrypt(password, authCtx.key);
      setPW(decryptedPw);
    }
    showDecrypt();
  }, [password]);

  if (isEditMode) {
    actionButton = (
      <Button
        icon="cancel"
        mode="elevated"
        onPress={() => {
          // Reset Inputs and switch to none Edit Mode
          setUserName(prevUserName);
          setPW(prevPw);
          setEditMode(false);
        }}
        contentStyle={styles.secondaryButton}
        textColor={Colors.white}
      >
        Cancel
      </Button>
    );
    editButton = (
      <Button
        icon="content-save-outline"
        mode="elevated"
        onPress={() => {
          setEditMode(false);
          // Todo: Save and update current Credentials change
          onPressSave({
            updatedPwData: { id: id, userName: userName, password: pw },
          });
        }}
        contentStyle={styles.button}
        textColor={Colors.white}
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
        mode="elevated"
        onPress={() => {
          onPressDelete({ id: id });
        }}
        contentStyle={styles.secondaryButton}
        textColor={Colors.white}
      >
        Delete
      </Button>
    );
    editButton = (
      <Button
        icon="note-edit-outline"
        mode="elevated"
        onPress={() => {
          editModeHandler();
        }}
        contentStyle={styles.button}
        textColor={Colors.white}
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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          activeOutlineColor={Colors.secondary}
          outlineColor={Colors.primary}
          mode="outlined"
          label="User"
          placeholder="User"
          onChangeText={(text) => {
            if (isEditMode) setUserName(text);
          }}
          value={userName}
          style={styles.inputAcc}
        />
        <TextInput
          ref={pwRef}
          activeOutlineColor={Colors.secondary}
          outlineColor={Colors.primary}
          mode="outlined"
          label="Password"
          placeholder="Password"
          onChangeText={(text) => {
            if (isEditMode) setPW(text);
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
    width: "auto",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    margin: 5,
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
    backgroundColor: Colors.secondary,
  },
  secondaryButton: {
    flexDirection: "row-reverse",
    backgroundColor: Colors.primary,
  },
  inputAcc: {
    alignSelf: "stretch",
  },
  inputPw: {
    alignSelf: "stretch",
  },
});
