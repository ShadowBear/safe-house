import { Animated, StyleSheet, Text, View } from "react-native";
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

  function deleteAccountPwData(id) {
    const updatedPwData = accountPwData.filter((item) => item.id !== id);
    setAccountPwData(updatedPwData);
  }

  return (
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
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={Colors.info} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  },
});
