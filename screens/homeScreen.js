import {
  Animated,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useContext } from "react";
import { useState, useEffect } from "react";
import { Colors } from "../utils/Colors";
import PwCardMini from "../components/pw-card-mini";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { DATA, NewData } from "../sample/data";
import NewPwCard from "../components/new-pw-card";
import { ActivityIndicator } from "react-native";
import { FIREBASE_URL } from "@env";
import { AuthContext } from "../context/AuthContext";
import { getAllPwData, getPwDataWithId } from "../utils/databaseHelper";
import { useFocusEffect } from "@react-navigation/native";
import { LinearTransition } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { decrypt, encryptData, generateKey } from "../utils/crypoHelper";
import { Security } from "../utils/securityStore";

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);
  const [accountPwData, setAccountPwData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchDataAsync() {
        let data = await getAllPwData();
        setAccountPwData(data);
        setIsLoading(false);
      }
      fetchDataAsync();
    }, [])
  );

  useEffect(() => {
    async function getAndSetKey() {
      try {
        if (!authCtx?.user?.password) {
          console.log("Error Ctx null");
          //Todo: check how to get Ctx here if null?
          return null;
        }
        const key = await generateKey(authCtx.user.password, Security.Salt);
        authCtx.setKey(key);
      } catch (error) {
        console.error("Error setting key:", error);
      }
    }
    getAndSetKey();
  }, []);

  function deleteAccountPwData(id) {
    const updatedPwData = accountPwData.filter((item) => item.id !== id);
    setAccountPwData(updatedPwData);
  }

  return (
    <LinearGradient
      style={StyleSheet.absoluteFillObject}
      colors={[Colors.white, Colors.primary]}
      start={{ x: 0, y: 0.7 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <Animated.FlatList
            keyboardDismissMode="on-drag"
            data={accountPwData}
            contentContainerStyle={{ gap: 10 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PwCardMini
                avatar={item.avatar}
                title={item.title}
                data={item.pwData}
                id={item.id}
                deleteCard={deleteAccountPwData}
              />
            )}
            style={styles.list}
            ListFooterComponent={
              isLoading ? (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <ActivityIndicator size="large" color={Colors.secondary} />
                  <Text>Loading...</Text>
                </View>
              ) : null
            }
            itemLayoutAnimation={LinearTransition}
          />
        </View>
        <View style={styles.newPwCardContainer}>
          <NewPwCard />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  list: {
    width: "100%",
  },
  newPwCardContainer: {
    height: 120,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    backgroundColor: Colors.primary,
  },
});
