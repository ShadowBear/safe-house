import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Colors } from "../utils/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showPasswordHandler } from "../utils/pwHelper";
import {
  Checkbox,
  SegmentedButtons,
  TextInput,
  Button,
} from "react-native-paper";
import { Link } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [pwIsVisible, setPasswordIsVisible] = useState(true);
  const [rePwIsVisible, setRePasswordIsVisible] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [eyeIconRe, setEyeIconRe] = useState("eye");
  const [checked, setChecked] = useState(true);
  const [segmentValue, setSegmentValue] = useState("Login");
  const [pw, setPw] = useState("");
  const [rePw, setRePw] = useState("");
  const [userName, setUserName] = useState("");

  const inputRef = useRef(null);
  const reInputRef = useRef(null);

  function LoginHandler() {
    navigation.navigate("Home", { userName: "Ben", password: "Hallo123!" });
  }

  function clearPwFields() {
    setPw("");
    setRePw("");
  }

  function loginOrRegisterInputs() {
    if (segmentValue === "Login") {
      return (
        <>
          <View style={styles.checkboxLabel}>
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
              color={Colors.info}
            />
            <Text>Remember Me</Text>
          </View>
          <View style={styles.link}>
            <Link to={{ screen: "Home" }}>Password Forgotten..</Link>
          </View>
        </>
      );
    }
    return (
      <>
        <TextInput
          ref={reInputRef}
          style={styles.inputFields}
          label="Re-Enter Password"
          placeholder="Password"
          mode="outlined"
          secureTextEntry={rePwIsVisible}
          value={rePw}
          onChangeText={setRePw}
          right={
            <TextInput.Icon
              icon={eyeIconRe}
              onPress={() =>
                showPasswordHandler({
                  pwIsVisible: rePwIsVisible,
                  setPassword: setRePasswordIsVisible,
                  setIcon: setEyeIconRe,
                  ref: reInputRef,
                })
              }
            />
          }
          activeOutlineColor={Colors.info}
        />
      </>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <View>
          <Text style={styles.welcomeText}>Welcome to SafeHouse</Text>
        </View>
        <SegmentedButtons
          style={styles.segment}
          onValueChange={setSegmentValue}
          value={segmentValue}
          buttons={[
            {
              label: "Login",
              value: "Login",
              onPress: () => {
                console.log("Login pressed");
                clearPwFields();
              },
              checkedColor: Colors.white,
              uncheckedColor: Colors.info,
              style:
                segmentValue === "Login"
                  ? styles.segmentButtonSelected
                  : styles.segmentButton,
            },
            {
              label: "Register",
              value: "Register",
              onPress: () => {
                console.log("Register Pressed");
                clearPwFields();
              },
              checkedColor: Colors.info,
              style: [
                segmentValue === "Register"
                  ? styles.segmentButtonSelected
                  : styles.segmentButton,
              ],
              checkedColor: Colors.white,
              uncheckedColor: Colors.info,
            },
          ]}
        />

        <Text style={styles.detailText}>
          SafeHouse stores all your passwords with the highest security and is
          still easy to access
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputFields}
            label="User Name"
            placeholder="User Name"
            mode="outlined"
            value={userName}
            onChangeText={setUserName}
            activeOutlineColor={Colors.info}
          />
          <TextInput
            ref={inputRef}
            style={styles.inputFields}
            label="Password"
            placeholder="Password"
            mode="outlined"
            value={pw}
            onChangeText={setPw}
            secureTextEntry={pwIsVisible}
            right={
              <TextInput.Icon
                icon={eyeIcon}
                onPress={() =>
                  showPasswordHandler({
                    pwIsVisible: pwIsVisible,
                    setPassword: setPasswordIsVisible,
                    setIcon: setEyeIcon,
                    ref: inputRef,
                  })
                }
              />
            }
            activeOutlineColor={Colors.info}
          />
        </View>
        <View style={styles.checkboxContainer}>{loginOrRegisterInputs()}</View>
        <View style={styles.btnContainer}>
          <Button
            icon={segmentValue === "Login" ? "login-variant" : "file-sign"}
            onPress={LoginHandler}
            mode="contained"
            contentStyle={styles.loginBtn}
          >
            {segmentValue}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    width: "100%",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  formContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputContainer: {
    alignSelf: "stretch",
    paddingHorizontal: 20,
    marginBottom: 0,
    height: 150,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 70,
  },
  detailText: {
    fontSize: 16,
    textAlign: "left",
    marginHorizontal: 40,
    marginVertical: 20,
  },
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 80,
  },
  segment: {
    paddingHorizontal: 20,
  },
  segmentButton: {
    backgroundColor: Colors.white,
  },
  segmentButtonSelected: {
    backgroundColor: Colors.info,
  },

  loginBtn: {
    backgroundColor: Colors.info,
    flexDirection: "row-reverse",
  },
  btnContainer: {
    marginRight: 20,
    marginTop: 20,
    marginLeft: "auto",
    marginBottom: 20,
    width: 180,
    height: 50,
  },
  checkboxLabel: {
    marginRight: 10,
    marginLeft: 40,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  link: {
    flex: 1,
    alignContent: "center",
    justifyContent: "flex-end",
    textDecorationLine: "underline",
  },
  inputFields: { height: 50, width: "100%", marginTop: 15 },
});
