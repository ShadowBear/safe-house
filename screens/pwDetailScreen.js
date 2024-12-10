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
  Platform,
} from "react-native";
import React, { useContext, useEffect } from "react";
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
import { PwData, Credential } from "../model/pwData";
import { LinearTransition } from "react-native-reanimated";
import { FAB } from "react-native-paper";
import { BlurView } from "expo-blur";
import NewPwCardDetails from "../components/new-detailed-pw-card";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { encryptData } from "../utils/crypoHelper";

export default function PwDetailsScreen({ navigation, route }) {
  const [accountList, setAccountList] = useState([]);
  const [category, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pwDataCollectionId, setPwDataCollectionId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetInputs, setResetInputs] = useState(false);
  const [focus, setFocus] = useState(false);

  const authCtx = useContext(AuthContext);

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
    setFocus(false);
  };

  async function addNewAccountHandler({ newAccount }) {
    //Check for correct account entry
    if (!newAccount?.userName || !newAccount?.password || !authCtx?.key)
      return false;

    //Create new credential element
    try {
      const pwDataId = pwDataCollectionId;
      const key = authCtx.key;
      const pw = await encryptData(newAccount.password, key);
      let newCredentialsElement = new Credential(newAccount.userName, pw);
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

      const key = authCtx.key;
      const pw = await encryptData(updatedPwData.password, key);

      //Create new credential
      dataRef.pwData.forEach((element) => {
        if (element.id === updatedPwData.id) {
          element.userName = updatedPwData.userName;
          element.password = pw;
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
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={[Colors.white, Colors.primary]}
        start={{ x: 0, y: 0.7 }}
        end={{ x: 0, y: 0 }}
      >
        <KeyboardAvoidingView
          style={StyleSheet.absoluteFillObject}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={StyleSheet.absoluteFillObject}>
            <Animated.FlatList
              removeClippedSubviews={false}
              windowSize={3}
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
            <FAB
              icon="plus"
              style={styles.fab}
              onPress={() => {
                setModalVisible(true);
                setFocus(true);
              }}
              color={Colors.white}
            />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={modalClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={modalClose}
          activeOpacity={1}
        >
          <BlurView intensity={80} tint="light" style={styles.modal}>
            <TouchableWithoutFeedback>
              <NewPwCardDetails
                onPressNew={addNewAccountHandler}
                resetInputs={resetInputs}
                focus={true}
                onCancel={modalClose}
              />
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleText: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },

  modal: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  list: {
    paddingHorizontal: 5,
    flex: 1,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    margin: 10,
    backgroundColor: Colors.secondary,
  },
});
