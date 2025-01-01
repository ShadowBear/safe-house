import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { Colors } from "../utils/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CustomHeader() {
  const navigation = useNavigation();
  const route = useRoute();

  const goToUserSettings = () => {
    navigation.navigate("UserDetails");
  };

  return (
    <>
      {route.name === "Home" && (
        <Pressable onPress={goToUserSettings}>
          <MaterialCommunityIcons
            style={styles.userIcon}
            name="account-circle"
            size={40}
            color={Colors.secondary}
          />
        </Pressable>
      )}
      <Text style={styles.text}>SafeHouse</Text>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    textAlign: "left",
    color: Colors.black,
  },
});
