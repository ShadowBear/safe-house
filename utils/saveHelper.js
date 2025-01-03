import AsyncStorage from "@react-native-async-storage/async-storage";
import { Security } from "./securityStore";
import { UserProfileData } from "../model/userProfileData";

export async function saveUserProfile(userProfile) {
  try {
    if (!userProfile) return;
    let userProfileString = JSON.stringify(userProfile);
    await AsyncStorage.setItem(userProfile.username, userProfileString);
    return true;
  } catch (error) {
    console.error("Error saving user profile", error);
    return false;
  }
}

export async function getUserProfile(userName) {
  try {
    let userProfileString = await AsyncStorage.getItem(userName);
    if (!userProfileString) return null;
    let userObject = JSON.parse(userProfileString);
    let userProfile = new UserProfileData(
      userObject.username,
      userObject.password,
      userObject.firstname,
      userObject.lastname,
      userObject.dateOfBirth,
      userObject.street,
      userObject.city,
      userObject.phone,
      userObject.country,
      userObject.securityPin
    );
    return userProfile;
  } catch (error) {
    console.error("Error retrieving user profile");
    return null;
  }
}
