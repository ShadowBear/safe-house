import {
  Animated,
  Button,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../utils/Colors";
import PwCardDetails from "../components/pw-card-detail";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import {
  deletePwData,
  getPwDataWithId,
  updatePwData,
} from "../utils/databaseHelper";
import { PwData, Credential } from "../sample/pwData";
import { LinearTransition } from "react-native-reanimated";
import { FAB } from "react-native-paper";
import { BlurView } from "expo-blur";

export default function PwDetailsScreen({ navigation, route }) {
  const [accountList, setAccountList] = useState([]);
  const [category, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pwDataCollectionId, setPwDataCollectionId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetInputs, setResetInputs] = useState(false);

  useEffect(() => {
    if (route?.params?.accounts) {
      setAccountList(route.params.accounts);
    }
    if (route?.params?.category && route?.params?.category !== "") {
      setCategoryName(route.params.category);
      navigation.setOptions({
        headerTitle: route?.params?.category,
        headerLargeTitle: true,
      });
    }

    if (route?.params?.id) {
      setPwDataCollectionId(route?.params?.id);
    }
  }, [route?.params?.accounts, route?.params?.category, route?.params?.id]);

  useEffect(() => {
    setIsLoading(false);
  }, [accountList]);

  const modalClose = () => {
    setModalVisible(false);
    setResetInputs(true);
    Keyboard.dismiss();
    setResetInputs(false);
  };

  async function addNewAccountHandler({ newAccount }) {
    //Check for correct account entry
    if (!newAccount?.userName || !newAccount?.password) return false;

    //Create new credential element
    try {
      const pwDataId = pwDataCollectionId;
      let newCredentialsElement = new Credential(
        newAccount.userName,
        newAccount.password
      );
      const dataRef = await getPwDataWithId(pwDataId);
      dataRef.pwData.push(newCredentialsElement);
      const result = await updatePwData(pwDataId, dataRef);
      if (result) {
        setAccountList((prevAccounts) => [
          ...prevAccounts,
          newCredentialsElement,
        ]);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error occurred: ", error);
    }
  }

  //Todo: Adjust Update to handle nested credentials

  async function updatePwDataHandler({ updatedPwData }) {
    try {
      const pwDataId = pwDataCollectionId;
      //Get original object
      const dataRef = await getPwDataWithId(pwDataId);

      //Create new credential
      dataRef.pwData.forEach((element) => {
        if (element.id === updatedPwData.id) {
          element.userName = updatedPwData.userName;
          element.password = updatedPwData.password;
        }
      });

      const result = await updatePwData(pwDataId, dataRef);
      if (result) {
        setAccountList(
          accountList.map((item) =>
            item.id === updatedPwData.id
              ? { ...item, pwData: updatedPwData.pwData }
              : item
          )
        );
      }
      //Todo: add user Feedback
    } catch (error) {
      console.error("Error while updating data: ", error);
    }
  }

  //Todo: Adjust Delete to handle nested credentials
  async function deletePwDataHandler({ id }) {
    try {
      const filteredList = accountList.filter((item) => item.id !== id);
      const pwDataId = pwDataCollectionId;
      const dataRef = await getPwDataWithId(pwDataId);

      dataRef.pwData = filteredList;
      const result = await updatePwData(pwDataId, dataRef);
      if (result) setAccountList(filteredList);
    } catch (error) {
      console.error("Error while deleting data: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Animated.FlatList
          data={accountList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PwCardDetails
              user={item.userName}
              password={item.password}
              isNewCardMode={false}
              onPressSave={updatePwDataHandler}
              onPressDelete={deletePwDataHandler}
              id={item.id}
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
          itemLayoutAnimation={LinearTransition}
        />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={modalClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={modalClose}
          activeOpacity={1}
        >
          <BlurView intensity={60} tint="light" style={styles.modal}>
            <TouchableWithoutFeedback>
              <PwCardDetails
                user=""
                password=""
                isNewCardMode={true}
                onPressNew={addNewAccountHandler}
                resetInputs={resetInputs}
              />
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableOpacity>
      </Modal>
      {/* <View style={styles.newCardContainer}>
        
      </View> */}
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

  modal: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  list: {
    width: "100%",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    margin: 10,
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
