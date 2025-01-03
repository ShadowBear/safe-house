import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../utils/Colors";
import Numberfield from "../components/lockComponents/numberfield";
import LottieView from "lottie-react-native";
import SimpleModal from "../components/simpleModal";
import { InactivityContext } from "../context/InactivityContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Security } from "../utils/securityStore";
import { logout } from "../utils/databaseHelper";
import { UserProfileData } from "../model/userProfileData";

const LockScreen = ({ navigation, route }) => {
  const DOTNUMBER = 4;
  const dotColor = Colors.primary200;
  const numberSize = 70;
  const numberPad = [
    [1, 4, 7],
    [2, 5, 8, 0],
    [3, 6, 9],
  ];
  const [dotSelectColor, setDotSelectColor] = useState(Colors.primary);
  const [enteredLock, setEnteredLock] = useState([]);
  const [dotUI, setDotUI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const { handleUnlock } = useContext(InactivityContext);
  const [titleText, setTitleText] = useState("");
  const [setRound, setSetRound] = useState(0);
  const [newCode, setNewCode] = useState([]);
  const [isSetLockState, setIsSetLockState] = useState(null);

  useEffect(() => {
    checkIsSetLockState();
  }, [route?.params?.isSetLockState, setRound]);

  const checkIsSetLockState = () => {
    const lockState = route?.params?.isSetLockState;
    let title = "";
    if (lockState) {
      title = setRound === 0 ? "Set a new Pin: " : "Confirm new Pin:";
    } else {
      title = "Enter your Login Pin: ";
    }
    setTitleText(title);
    setIsSetLockState(lockState);
  };

  //Prevent Backbutton handling
  useEffect(() => {
    const onBackPress = () => {
      return true; // prevents the default back behavior
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, []);

  useLayoutEffect(() => {
    let dots = isLoading ? (
      <LottieView
        source={require("../assets/lottie/dotLoading.json")}
        autoPlay={true}
        loop={true}
        style={styles.lottieDots}
      />
    ) : (
      dotCreater()
    );
    setDotUI(dots);
  }, [enteredLock, dotSelectColor, isLoading]);

  const dotCreater = () => {
    return (
      <>
        {enteredLock.map((code, index) => (
          <MaterialCommunityIcons
            key={`${code}-${index}`}
            name="circle"
            color={dotSelectColor}
            size={30}
            style={styles.dot}
          />
        ))}
        {Array.from({ length: DOTNUMBER - enteredLock.length }).map(
          (code, i) => (
            <MaterialCommunityIcons
              key={`${code}-${i}`}
              name="circle"
              color={dotColor}
              size={30}
              style={styles.dot}
            />
          )
        )}
      </>
    );
  };

  const handleNumberPress = async (number) => {
    if (enteredLock.length >= DOTNUMBER) return;
    const newLockCode = [...enteredLock, number];
    setEnteredLock(newLockCode);
    console.log(newLockCode);

    //Check if all digits set and try login
    if (newLockCode.length !== DOTNUMBER) return;

    if (!isSetLockState) {
      checkLogin(newLockCode.join(""));
      return;
    }
    switch (setRound) {
      case 0:
        setSetRound(1);
        setNewCode(newLockCode.join(""));
        setEnteredLock([]);
        break;
      case 1:
        if (newCode === newLockCode.join("")) {
          try {
            const user = JSON.parse(
              await AsyncStorage.getItem(Security.PW_KEY_User)
            );
            const userProfil = JSON.parse(
              await AsyncStorage.getItem(user.user)
            );
            if (!userProfil)
              userProfil = new UserProfileData(
                user.user,
                userProfil.password,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                newCode
              );
            userProfil.securityPin = newCode;
            await AsyncStorage.setItem(user.user, JSON.stringify(userProfil));
            // await AsyncStorage.setItem(Security.SecurityPin, newCode);
          } catch (error) {
            console.error("error setting new security pin", error);
            Alert.error(error);
          }
          Alert.alert("Pin Confirmed", "Your PIN has been set successfully", [
            { text: "OK", onPress: () => navigation.replace("Home") },
          ]);
          setIsSetLockState(false);
        } else {
          Alert.alert("Pins don´t match", "Please try again", [
            { text: "OK", onPress: () => {} },
          ]);
          setNewCode([]);
          setEnteredLock([]);
          setIsSetLockState(true);
        }
        setSetRound(0);
        break;
      default:
        break;
    }
  };

  const handleBackPressed = () => {
    if (enteredLock.length > 0) {
      const newLockCode = enteredLock.slice(0, -1);
      setEnteredLock(newLockCode);
      console.log(newLockCode);
    }
  };

  const checkLogin = async (lockCode) => {
    setIsLoading(true);
    let success = await checkForLogin(lockCode);
    setTimeout(() => {
      setIsLoading(false);
      console.log(success);
      setDotSelectColor(success ? Colors.success : Colors.error);
      setTimeout(() => {
        setEnteredLock([]);
        setDotSelectColor(Colors.primary);
        if (success) handleUnlock();
      }, 1500);
    }, 2000);
  };

  const renderColumn = (dataArray) => {
    return dataArray.map((number) => (
      <Numberfield
        key={number}
        number={number}
        color={Colors.black}
        size={numberSize}
        onPress={handleNumberPress}
      />
    ));
  };

  const handlePinReset = async () => {
    try {
      let userObject = JSON.parse(
        await AsyncStorage.getItem(Security.PW_KEY_User)
      );
      const userProfil = JSON.parse(
        await AsyncStorage.getItem(userObject.user)
      );
      userProfil.securityPin = null;
      await AsyncStorage.setItem(userObject.user, JSON.stringify(userProfil));
      //await AsyncStorage.removeItem();
      Alert.alert(
        "Success:",
        "Your login pin has been reset. You can set a new Pin while your next login!"
      );
      await logout();
      navigation.replace("Home");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error:",
        "An unknown error occurred please try again or reset your login pin"
      );
    }
  };

  const checkForLogin = async (lockCode) => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem(Security.PW_KEY_User));
      const userProfil = JSON.parse(await AsyncStorage.getItem(user.user));
      const loginPin = userProfil.securityPin; //await AsyncStorage.getItem(Security.SecurityPin);
      console.log("Stored Login Pin ", loginPin);
      console.log("Entered Pin: ", lockCode);
      return lockCode === loginPin ? true : false;
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error:",
        "An unknown error occurred please try again or reset your login pin"
      );
    }
  };

  return (
    <View style={[styles.screenContainer, styles.borderClass]}>
      <View style={[styles.title, styles.borderClass]}>
        <Text style={styles.text}>{titleText}</Text>
      </View>
      <View style={[styles.innerContentContainer, styles.borderClass]}>
        <View style={[styles.lockDots, styles.borderClass]}>{dotUI}</View>
        <View style={[styles.lockPad, styles.borderClass]}>
          <View style={styles.column}>
            {renderColumn(numberPad[0])}
            <MaterialCommunityIcons
              name="square"
              color={Colors.background}
              size={numberSize}
            />
          </View>
          <View style={styles.column}>{renderColumn(numberPad[1])}</View>
          <View style={styles.column}>
            {renderColumn(numberPad[2])}
            <Pressable onPress={handleBackPressed}>
              <MaterialCommunityIcons
                name="keyboard-backspace"
                color={Colors.black}
                size={numberSize}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={[styles.actionButtonContainer, styles.borderClass]}>
        {!isSetLockState && (
          <Pressable onPress={() => setModalVisibility(true)}>
            <Text style={styles.rememberTxt}>Can´t Remember your Pin?</Text>
          </Pressable>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibility}
        onRequestClose={() => setModalVisibility(false)}
      >
        <SimpleModal
          title="Reset Login Pin:"
          body="Are you sure you want to reset?"
          onOk={handlePinReset}
          onCancel={() => {
            setModalVisibility(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  title: { flex: 1, justifyContent: "flex-start" },
  innerContentContainer: { flex: 7 },
  lockDots: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    marginHorizontal: 11,
  },
  lottieDots: {
    flex: 1,
    width: "100%",
    height: "100%",
    transform: [{ scale: 2 }],
  },
  lockPad: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  actionButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  borderClass: {
    borderWidth: 0,
    borderColor: "black",
  },
  column: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.black,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 20,
    margin: 10,
  },
  rememberTxt: {
    fontSize: 16,
    fontWeight: "light",
    fontStyle: "italic",
    underline: "underline",
    textAlign: "center",
    color: Colors.primary800,
  },
});
