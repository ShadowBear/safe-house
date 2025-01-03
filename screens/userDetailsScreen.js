import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Colors } from "../utils/Colors";
import { InactivityContext } from "../context/InactivityContext";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import UserDetailsCard from "../components/userDetailsCard";
import { Button } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Security } from "../utils/securityStore";
import { UserProfileData } from "../model/userProfileData";
import { getUserProfile, saveUserProfile } from "../utils/saveHelper";

export default function UserDetailsScreen({ navigation }) {
  const { resetTimer } = useContext(InactivityContext);
  const [userProfilData, setUserProfilData] = useState(null);

  useEffect(() => {
    async function getUserProfileAsync() {
      try {
        let userObject = JSON.parse(
          await AsyncStorage.getItem(Security.PW_KEY_User)
        );
        let profile = await getUserProfile(userObject.user);
        if (!profile) {
          console.log("No user profile");
        }
        setUserProfilData(profile);
      } catch (error) {
        console.error("Error Loading user profile");
      }
    }
    getUserProfileAsync();
  }, []);

  useEffect(() => {
    async function saveUserProfileAsync() {
      if (!userProfilData) return;
      try {
        await saveUserProfile(userProfilData);
      } catch (error) {
        console.error("Error saving user profile", error);
      }
    }
    saveUserProfileAsync();
  }, [
    userProfilData?.userName,
    userProfilData?.password,
    userProfilData?.firstName,
    userProfilData?.lastName,
    userProfilData?.phone,
    userProfilData?.country,
  ]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function updateUserProfil(attribute, value) {
    let prop = attribute.toLowerCase();
    setUserProfilData((prev) => ({
      ...prev,
      [prop]: value,
    }));
  }

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
        >
          {!isKeyboardVisible && (
            <View style={styles.profileContainer}>
              <MaterialCommunityIcons
                name="shield-account-outline"
                color={Colors.white}
                size={120}
              />
              <Text style={styles.profileText}>User Profil</Text>
            </View>
          )}
          <View style={styles.userDetailCardsContainer}>
            <View>
              <UserDetailsCard
                title="Username"
                avatar="account-outline"
                value={userProfilData?.username}
                style={styles.userDetailCard}
                onSave={updateUserProfil}
              />
              <UserDetailsCard
                title="Password"
                avatar="lock"
                value={userProfilData?.password}
                isPassword={true}
                style={styles.userDetailCard}
                onSave={updateUserProfil}
              />
              <UserDetailsCard
                title="Name"
                avatar="badge-account-horizontal-outline"
                value={
                  userProfilData?.firstname + " " + userProfilData?.lastname
                }
                style={styles.userDetailCard}
                onSave={updateUserProfil}
              />
              <UserDetailsCard
                title="Phone"
                avatar="cellphone"
                value={userProfilData?.phone}
                style={styles.userDetailCard}
                onSave={updateUserProfil}
              />
              <UserDetailsCard
                title="Country"
                avatar="globe-model"
                value={userProfilData?.country}
                style={styles.userDetailCard}
                onSave={updateUserProfil}
              />
            </View>
          </View>
          {!isKeyboardVisible && (
            <View style={styles.deleteButtonContainer}>
              <Button
                icon="delete"
                mode="elevated"
                onPress={() => console.log("Delete Profile")}
                contentStyle={styles.deleteButton}
                textColor={Colors.white}
                buttonColor={Colors.delete}
              >
                Delete Profile
              </Button>
            </View>
          )}
        </KeyboardAvoidingView>
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

  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.black,
    marginTop: 20,
  },

  deleteBtn: {
    backgroundColor: Colors.red,
    height: 40,
  },

  userDetailCardsContainer: {
    flex: 2,
  },

  deleteButtonContainer: {
    marginHorizontal: 10,

    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
  },
  userDetailCard: {
    marginHorizontal: 10,
    marginBottom: 5,
    width: "auto",
  },
});
