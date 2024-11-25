import { Pressable, StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../utils/Colors";
import QuardBtn from "./quardBtn";
import { useNavigation } from "@react-navigation/native";
import { deletePwData } from "../utils/databaseHelper";
import * as Clipboard from "expo-clipboard";
import { decrypt } from "../utils/crypoHelper";
import { AuthContext } from "../context/AuthContext";

export default function PwCardMini({ id, avatar, title, data, deleteCard }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  function showDetailsHandler() {
    navigation.navigate("PwDetails", {
      id: id,
      accounts: data,
      category: title,
    });
  }

  function clipboardHandler() {
    async function copyClipboard() {
      if (!authCtx?.key) {
        ToastAndroid.show("No encryption key available", ToastAndroid.SHORT);
        return;
      }
      const pw = await decrypt(data[0].password, authCtx.key);
      await Clipboard.setStringAsync(pw);
      ToastAndroid.show(
        `Copied password for ${data[0].userName}`,
        ToastAndroid.SHORT
      );
    }
    if (data.length > 0) {
      copyClipboard();
    } else {
      ToastAndroid.show("No password available", ToastAndroid.SHORT);
    }
  }

  return (
    <Pressable onPress={showDetailsHandler}>
      <View style={styles.cardContainer}>
        <View style={styles.innerCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name={avatar}
              size={30}
              color={Colors.secondary}
            />
          </View>
          <Text style={styles.text}>{title}</Text>
          <QuardBtn
            name={"delete-outline"}
            size={28}
            onPress={() => {
              const result = deletePwData(id);
              if (result) deleteCard(id);
            }}
            color={Colors.delete}
            style={styles.icon}
            backgroundColor={Colors.white}
          />
          <QuardBtn
            name={"content-copy"}
            size={25}
            onPress={clipboardHandler}
            color={Colors.primary}
            style={styles.icon}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "100%",
    height: 80,
    flexDirection: "row",
  },
  innerCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderColor: Colors.primary,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    borderWidth: 0,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 0,
  },
  icon: {
    width: 55,
    height: 55,
  },
  text: {
    fontSize: 18,
    color: Colors.black,
    flex: 1,
    textAlign: "start",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
