import { Button, StyleSheet, Text, View, Keyboard } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../utils/Colors";
import PwCardDetails from "../components/pw-card-detail";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";
// import { ActivityIndicator } from "react-native-paper";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native";

export default function PwDetailsScreen({ navigation, route }) {
  const [accountList, setAccountList] = useState([]);
  const [category, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (route?.params?.accounts) {
      setAccountList(route.params.accounts);
    }
    if (route?.params?.category && route?.params?.category !== "") {
      setCategoryName(route.params.category);
    }
  }, [route?.params?.accounts, route?.params?.category]);

  useEffect(() => {
    setIsLoading(false);
  }, [accountList]);

  function addNewAccountHandler({ newAccount }) {
    let account = [
      {
        id: accountList.length,
        userName: newAccount.userName,
        password: newAccount.password,
      },
    ];
    setAccountList((prevAccounts) => [...prevAccounts, ...account]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleText}>
        <Text style={styles.title}>{category}</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={accountList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PwCardDetails
              user={item.userName}
              password={item.password}
              isNewCardMode={false}
            />
          )}
          style={styles.list}
          contentContainerStyle={{ gap: 10 }}
          ListFooterComponent={
            isLoading ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={Colors.info} />
                <Text>Loading...</Text>
              </View>
            ) : null
          }
        />
      </View>
      <View style={styles.newCardContainer}>
        <PwCardDetails
          user=""
          password=""
          isNewCardMode={true}
          onPress={addNewAccountHandler}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  listContainer: {
    flex: 2,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  titleText: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  list: {
    width: "100%",
  },

  newCardContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  newCard: {},

  card: {},

  loginBtn: {
    marginTop: 10,
    width: 100,
    backgroundColor: Colors.primary,
  },
});
