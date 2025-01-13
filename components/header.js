import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Colors } from "../utils/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";

export default function CustomHeader() {
  const navigation = useNavigation();
  const route = useRoute();
  const netInfo = useNetInfo();
  const [offline, setOffline] = useState(false);

  const goToUserSettings = () => {
    navigation.navigate("UserDetails");
  };

  const banner = (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        Offline, please connect to the internet!
      </Text>
    </View>
  );

  useEffect(() => {
    setOffline(!netInfo.isConnected);
  }, [netInfo.isConnected]);

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
      {offline && banner}
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
  banner: {
    backgroundColor: Colors.red,
    padding: 4,
    position: "absolute",
    top: 7,
    left: 45,
    borderRadius: 4,
  },
  bannerText: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.white,
  },
});
