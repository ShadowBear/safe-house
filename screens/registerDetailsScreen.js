import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Colors } from "../utils/Colors";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { InactivityContext } from "../context/InactivityContext";
import CustomInputFieldCard from "../components/customInputFieldCard";
import { Button } from "react-native-paper";
import { UserProfileData } from "../model/userProfileData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Security } from "../utils/securityStore";
import { useNavigation } from "@react-navigation/native";
import { saveUserProfile } from "../utils/saveHelper";

export default function RegisterDetailsScreen() {
  const { resetTimer } = useContext(InactivityContext);
  const [validInput, setValidInput] = useState(true);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Germany", value: "germany" },
    { label: "Spain", value: "spain" },
    { label: "France", value: "france" },
    { label: "Italy", value: "italy" },
    { label: "United Kingdom", value: "united_kingdom" },
    { label: "Netherlands", value: "netherlands" },
    { label: "Sweden", value: "sweden" },
    { label: "Belgium", value: "belgium" },
    { label: "Austria", value: "austria" },
    { label: "Switzerland", value: "switzerland" },
  ]);
  const navigation = useNavigation();

  const saveData = async () => {
    // Save user data to the database
    try {
      let validData = fielValidation();
      if (validData) {
        setValidInput(true);
        const userString = await AsyncStorage.getItem(Security.PW_KEY_User);
        const user = JSON.parse(userString);
        const userProfile = new UserProfileData(
          user.user,
          user.password,
          firstname,
          lastname,
          dateOfBirth,
          street,
          city,
          phone,
          value
        );
        console.log(userProfile);
        saveUserProfile(userProfile);
        navigation.replace("Home");
      } else {
        setValidInput(false);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const fielValidation = () => {
    return (
      firstname !== "" &&
      lastname !== "" &&
      dateOfBirth !== "" &&
      street !== "" &&
      city !== "" &&
      phone !== "" &&
      value !== null
    );
  };

  return (
    <View style={styles.container} onTouchStart={resetTimer}>
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={[Colors.white, Colors.primary]}
        start={{ x: 0, y: 0.7 }}
        end={{ x: 0, y: 0 }}
      >
        <KeyboardAvoidingView
          style={StyleSheet.absoluteFillObject}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        ></KeyboardAvoidingView>
        <View>
          <Text style={styles.text}>User Profile Data</Text>
          <CustomInputFieldCard
            title={"First Name"}
            avatar={"human-greeting"}
            style={styles.inputs}
            value={firstname}
            onChangeText={setFirstname}
            outlineColor={
              !validInput && firstname === "" ? Colors.error : Colors.darkGrey
            }
          />
          <CustomInputFieldCard
            title={"Last Name"}
            avatar={"human-greeting"}
            style={styles.inputs}
            value={lastname}
            onChangeText={setLastname}
            outlineColor={
              !validInput && lastname === "" ? Colors.error : Colors.darkGrey
            }
          />
          <CustomInputFieldCard
            title={"Date of birth"}
            avatar={"cake"}
            style={styles.inputs}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            outlineColor={
              !validInput && dateOfBirth === "" ? Colors.error : Colors.darkGrey
            }
          />
          <CustomInputFieldCard
            title={"Street"}
            avatar={"road-variant"}
            style={styles.inputs}
            value={street}
            onChangeText={setStreet}
            outlineColor={
              !validInput && street === "" ? Colors.error : Colors.darkGrey
            }
          />
          <CustomInputFieldCard
            title={"City"}
            avatar={"city"}
            style={styles.inputs}
            value={city}
            onChangeText={setCity}
            outlineColor={
              !validInput && city === "" ? Colors.error : Colors.darkGrey
            }
          />
          <CustomInputFieldCard
            title={"Phone"}
            avatar={"cellphone"}
            style={styles.inputs}
            value={phone}
            onChangeText={setPhone}
            outlineColor={
              !validInput && phone === "" ? Colors.error : Colors.darkGrey
            }
          />
          <View style={styles.dropdownContainer}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons
                name="globe-model"
                size={24}
                color={Colors.secondary}
              />
            </View>
            <View style={styles.dropdown}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={
                  !validInput && value === null
                    ? { borderColor: Colors.error }
                    : { borderColor: Colors.darkGrey }
                }
              />
            </View>
          </View>
          <View style={styles.btnContainer}>
            <Button
              mode="elevated"
              contentStyle={styles.btn}
              onPress={saveData}
              icon={"content-save-outline"}
              buttonColor={Colors.primary}
              textColor={Colors.white}
            >
              Save
            </Button>
          </View>
          {!validInput && (
            <Text style={styles.validatorText}>
              *All fields are required, please check your Inputs
            </Text>
          )}
        </View>
        <KeyboardAvoidingView />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputs: {
    marginHorizontal: 10,
    marginVertical: 2.5,
    width: "auto",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  validatorText: {
    color: Colors.error,
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
  },
  btn: {
    width: 150,
    height: 40,
  },
  btnContainer: {
    marginTop: 10,
    width: "auto",
    marginHorizontal: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "start",
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 2.5,
    paddingHorizontal: 35,
    paddingVertical: 5,
    backgroundColor: Colors.white,
    height: 65,
    width: "auto",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 9999,
  },
  dropdown: {
    marginLeft: 10,
    marginRight: 15,
    height: "auto",
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 0,
  },
});
