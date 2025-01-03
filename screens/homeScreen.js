import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import { Colors } from "../utils/Colors";
import PwCardMini from "../components/pw-card-mini";
import { DATA, NewData } from "../sample/data";
import NewPwCard from "../components/new-pw-card";
import { AuthContext } from "../context/AuthContext";
import { getAllPwData, getPwDataWithId, logout } from "../utils/databaseHelper";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { LinearTransition } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import {
  decrypt,
  encryptData,
  generateKey,
  PW_KEY,
} from "../utils/crypoHelper";
import { Security } from "../utils/securityStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InactivityContext } from "../context/InactivityContext";

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);
  const [accountPwData, setAccountPwData] = useState([]);
  const [filteredData, setFilteredPwData] = useState(accountPwData);
  const [filter, setFilter] = useState("");
  const { resetTimer, setPreviousRoute, setClearTimeout } =
    useContext(InactivityContext);

  // Check if User has security code set and registration is completed
  useFocusEffect(
    useCallback(() => {
      async function fetchDataAsync() {
        try {
          const passed = await checkSecuritySet();
          if (!passed) {
            navigation.navigate("Lock", { isSetLockState: true });
            return;
          }
          let userObject = JSON.parse(
            await AsyncStorage.getItem(Security.PW_KEY_User)
          );
          const registered = await checkRegistration(userObject.user);
          if (!registered) {
            navigation.navigate("Registration");
            return;
          }

          let data = await getAllPwData();
          setAccountPwData(data);
          setIsLoading(false);
          resetTimer();
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }
      fetchDataAsync();
    }, [])
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search Password",
        hideWhenScrolling: true,
        onChangeText: (text) => {
          text.persist();
          const plainText = text.nativeEvent?.text;
          setFilter(plainText ?? "");
        },
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (filter !== "") {
      setFilteredPwData(
        accountPwData.filter((text) => {
          return text.title.toLowerCase().startsWith(filter.toLowerCase());
        })
      );
    } else {
      setFilteredPwData(accountPwData);
    }
  }, [filter, accountPwData]);

  useEffect(() => {
    async function getAndSetKey() {
      try {
        //Don´t create a new key if it already exists
        if (authCtx?.key) return;

        const userPWJson = await AsyncStorage.getItem(Security.PW_KEY_User);
        const userData = userPWJson !== null ? JSON.parse(userPWJson) : null;
        if (!userData?.password || !userData?.user) {
          logout();
          return;
        }
        let key = await generateKey(userData.password, Security.Salt);
        authCtx.setKey(key);
      } catch (error) {
        console.error("Error setting key:", error);
      }
    }
    getAndSetKey();
  }, [authCtx.key]);

  function deleteAccountPwData(id) {
    const updatedPwData = accountPwData.filter((item) => item.id !== id);
    setAccountPwData(updatedPwData);
  }

  const checkSecuritySet = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem(Security.PW_KEY_User));
      const userProfil = JSON.parse(await AsyncStorage.getItem(user.user));
      const securityPin = userProfil?.securityPin;
      if (securityPin === null) {
        setPreviousRoute(null);
        setClearTimeout();
        return false;
      }
      return true;
    } catch (error) {}
  };

  const checkRegistration = async (userName) => {
    try {
      const userProfilData = await AsyncStorage.getItem(userName);
      return userProfilData !== null;
    } catch (error) {
      console.error("Error getting user profile data", error);
      return false;
    }
  };

  return (
    <LinearGradient
      style={StyleSheet.absoluteFillObject}
      colors={[Colors.white, Colors.primary]}
      start={{ x: 0, y: 0.7 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={styles.container} onTouchStart={resetTimer}>
        <View style={styles.listContainer}>
          <Animated.FlatList
            keyboardDismissMode="on-drag"
            data={filteredData}
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
