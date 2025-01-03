import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, {
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Colors } from "../utils/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showPasswordHandler } from "../utils/pwHelper";
import {
  Checkbox,
  SegmentedButtons,
  TextInput,
  Button,
  HelperText,
} from "react-native-paper";
import { Link, useFocusEffect, useNavigation } from "@react-navigation/native";
import { login, logout, register } from "../utils/databaseHelper";
import { AuthContext } from "../context/AuthContext";
import { generateKey, PW_KEY } from "../utils/crypoHelper";
import { Security } from "../utils/securityStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "../utils/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { InactivityContext } from "../context/InactivityContext";

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
  const [validLogin, setValidLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [matching, setMatching] = useState(true);

  const inputRef = useRef(null);
  const reInputRef = useRef(null);

  const { setClearTimeout } = useContext(InactivityContext);

  useFocusEffect(
    useCallback(() => {
      clearFields();
      setClearTimeout();
    }, [])
  );

  const LoginHandler = useCallback(async () => {
    //Debug Logic:
    let userPW = pw;
    let user = userName;

    if (pw.length === 0 && userName.length === 0) {
      user = "boyo@byom.de";
      userPW = "Test123!";
    } else {
      let valid = checkValidate();
      if (!valid) {
        console.log("Login or Register was not valid");
        return;
      }
    }
    try {
      const jsonUser = JSON.stringify({ user: user, password: userPW });
      await AsyncStorage.setItem(Security.PW_KEY_User, jsonUser);
      if (segmentValue === "Login") {
        await login(user, userPW);
        if (!auth?.currentUser?.emailVerified) {
          //Todo give better user feedback with modal?
          Alert.alert(
            "Email not verified",
            "Please verify your email to continue",
            [{ text: "OK", onPress: () => console.log("Ok Pressed") }]
          );
          return;
        }
      } else if (segmentValue === "Register" && pw === rePw) {
        await register(userName, pw);
        setSegmentValue("Login");
        Alert.alert(
          "Registration successful",
          "An email has been send to finish registration",
          [{ text: "OK", onPress: () => console.log("Ok Pressed") }]
        );
      }
    } catch (error) {
      console.error("Login or Register failed", error);
    }
  }, [segmentValue, userName, pw, rePw, navigation]);

  const clearFields = () => {
    setPw("");
    setRePw("");
    setErrorMessage("");
    setValidLogin(true);
    setPasswordIsVisible(true);
    setRePasswordIsVisible(true);
    setEyeIcon("eye");
    setEyeIconRe("eye");
  };

  useEffect(() => {
    setMatching(pw === rePw);
  }, [pw, rePw]);

  const checkValidate = () => {
    const pwRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&}<>{=()[\]])[A-Za-z\d@$!%*?&}<>{=()[\]]+$/;
    let pwValidate = pwRegex.test(pw);
    let valid =
      userName.length > 5 &&
      pw.length > 7 &&
      userName.includes("@") &&
      pwValidate;

    if (!pwValidate) {
      setErrorMessage(
        "Missing Password complexity press info for more details:"
      );
    } else if (!valid) {
      setErrorMessage("Password or Email is not valid!");
    }

    setValidLogin(valid);
    return valid;
  };

  // const handleCheckboxPress = useCallback(() => {
  //   setChecked(!checked);
  // }, [checked]);

  // const handleSegmentChange = useCallback(() => {
  //   setSegmentValue(value);
  //   clearFields();
  // }, []);

  const loginOrRegisterInputs = useMemo(() => {
    return segmentValue === "Login" ? (
      <>
        <View style={styles.checkboxLabel}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked((prev) => !prev)}
            color={Colors.secondary}
          />
          <Text>Remember Me</Text>
        </View>
        <View style={styles.link}>
          <Link to={{ screen: "Home" }}>Password Forgotten..</Link>
        </View>
      </>
    ) : (
      <>
        <View style={{ flex: 1, width: "100%", marginTop: 15 }}>
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
            activeOutlineColor={Colors.secondary}
          />
          <HelperText type="error" visible={!matching}>
            Passwords don´t match
          </HelperText>
        </View>
      </>
    );
  }, [
    segmentValue,
    rePw,
    checked,
    eyeIconRe,
    rePwIsVisible,
    reInputRef,
    matching,
  ]);

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
                clearFields();
              },
              checkedColor: Colors.white,
              uncheckedColor: Colors.secondary,
              style:
                segmentValue === "Login"
                  ? styles.segmentButtonSelected
                  : styles.segmentButton,
            },
            {
              label: "Register",
              value: "Register",
              onPress: () => {
                clearFields();
              },
              checkedColor: Colors.secondary,
              style: [
                segmentValue === "Register"
                  ? styles.segmentButtonSelected
                  : styles.segmentButton,
              ],
              checkedColor: Colors.white,
              uncheckedColor: Colors.secondary,
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
            label="Email"
            placeholder="Email"
            mode="outlined"
            value={userName}
            onChangeText={setUserName}
            activeOutlineColor={Colors.secondary}
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
            activeOutlineColor={Colors.secondary}
          />
          <View>
            {validLogin ? null : (
              <View style={styles.errorContainer}>
                <HelperText type="error">{errorMessage}</HelperText>
                <MaterialCommunityIcons
                  name="information-outline"
                  color={Colors.error}
                  size={25}
                  style={{ paddingRight: 5, paddingTop: 1 }}
                  onPress={() =>
                    Alert.alert(
                      "Higher Security Required:",
                      " Password must contain at least: \n 1 uppercase letters\n 1 lowercase letters\n 1 special character\n 1 digit",
                      [{ text: "OK", onPress: () => console.log("Ok Pressed") }]
                    )
                  }
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.checkboxContainer}>{loginOrRegisterInputs}</View>
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
  errorContainer: {
    flexDirection: "row",
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
    backgroundColor: Colors.primary,
  },

  loginBtn: {
    backgroundColor: Colors.primary,
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
