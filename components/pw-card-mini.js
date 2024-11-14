import { Pressable, StyleSheet, Text, ToastAndroid, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../utils/Colors";
import QuardBtn from "./quardBtn";
import { useNavigation } from "@react-navigation/native";
import { deletePwData } from "../utils/databaseHelper";

export default function PwCardMini({ id, avatar, title, data, deleteCard }) {
  const navigation = useNavigation();

  function showDetailsHandler() {
    navigation.navigate("PwDetails", {
      id: id,
      accounts: data,
      category: title,
    });
  }

  return (
    <Pressable onPress={showDetailsHandler}>
      <View style={styles.cardContainer}>
        <View style={styles.innerCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name={avatar}
              size={30}
              color={Colors.primary}
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
            color={Colors.info}
            style={styles.icon}
          />
          <QuardBtn
            name={"content-copy"}
            size={25}
            onPress={() => {
              if (data.length > 0) {
                ToastAndroid.show(
                  `Copied password for ${data[0].userName}`,
                  ToastAndroid.SHORT
                );
                //navigator.clipboard.setString(data[0].password);
              } else {
                ToastAndroid.show("No password available", ToastAndroid.SHORT);
              }
            }}
            color={Colors.info}
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
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.info,
  },
  avatar: {
    width: 50,
    height: 50,
    borderColor: Colors.info,
    backgroundColor: Colors.info2,
    borderRadius: 50,
    borderWidth: 0,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 60,
    height: 60,
    borderColor: Colors.info,
    backgroundColor: Colors.lightGrey,
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
