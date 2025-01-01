import { StyleSheet, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../utils/databaseHelper";
import { Colors } from "../utils/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function HeaderSignout() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        async function signOut() {
          let result = await logout();
          if (result) {
            let currentScreen = navigation.getState().routes.slice(-1)[0];
            if (currentScreen.name !== "Home") {
              //Switch to Home before it gets replaced
              navigation.replace("Home");
            }
          }
        }
        signOut();
      }}
    >
      <MaterialCommunityIcons
        size={24}
        name={"logout-variant"}
        color={Colors.black}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({});
