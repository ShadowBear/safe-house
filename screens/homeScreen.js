import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { Colors } from "../utils/Colors";
import PwCardMini from "../components/pw-card-mini";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { DATA } from "../sample/data";
import NewPwCard from "../components/new-pw-card";
import { ActivityIndicator } from "react-native";

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [DATA]);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={DATA}
          contentContainerStyle={{ gap: 6 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PwCardMini
              avatar={item.avatar}
              title={item.category}
              data={item.account}
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
