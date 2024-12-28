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

export default function NewPwCardDetails({
  onPressNew,
  resetInputs,
  focus,
  onCancel,
}) {
  const [userName, setUserName] = useState("");
  const [pwIsVisible, setPwIsVisible] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [pw, setPW] = useState("");
  const pwRef = useRef(null);
  const userNameInputRef = useRef(null);

  useEffect(() => {
    if (resetInputs) {
      setPW("");
      setUserName("");
    }
  }, [resetInputs]);

  useEffect(() => {
    if (focus) {
      setTimeout(() => userNameInputRef.current.focus(), 100);
    }
  }, [focus]);

  return (
    <View style={styles.newContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.newLabel}>New Password</Text>
        <TextInput
          ref={userNameInputRef}
          activeOutlineColor={Colors.secondary}
          outlineColor={Colors.primary}
          mode="outlined"
          label="User"
          placeholder="User"
          onChangeText={setUserName}
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
                  setPassword: setPwIsVisible,
                  setIcon: setEyeIcon,
                  ref: pwRef,
                })
              }
            />
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.divider}>
          <Button
            icon="cancel"
            mode="elevated"
            onPress={() => {
              setUserName("");
              setPW("");
              onCancel();
            }}
            contentStyle={styles.secondaryButton}
            textColor={Colors.white}
          >
            Cancel
          </Button>
        </View>
        <View style={styles.divider}>
          <Button
            icon="note-plus-outline"
            mode="elevated"
            onPress={() => {
              onPressNew({ newAccount: { userName: userName, password: pw } });
              setPW("");
              setUserName("");
              Keyboard.dismiss();
            }}
            contentStyle={styles.button}
            textColor={Colors.white}
          >
            Add
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  newContainer: {
    height: 210,
    width: "100%",
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
