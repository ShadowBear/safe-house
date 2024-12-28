import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../utils/Colors";

export default function UserDetailsScreen({ navigation }) {
  function LoginHandler() {}

  return (
    <View style={styles.container}>
      <Text>UserDetailsScreen</Text>
      <Button styles={styles.loginBtn} title="Login" onPress={LoginHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loginBtn: {
    marginTop: 10,
    width: 100,
    backgroundColor: Colors.primary,
  },
});
