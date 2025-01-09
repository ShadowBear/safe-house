import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../utils/Colors";
import { TextInput } from "react-native-paper";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function CustomDatePickerCard({
  avatar,
  style,
  dateTxt,
  onDateChange,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDatePicked = (selected) => {
    setShowDatePicker(false);
    let selectedDate = new Date(selected.nativeEvent.timestamp);
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.innerCard}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name={avatar}
            size={30}
            color={Colors.secondary}
          />
        </View>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View style={styles.labelContainer}>
            <View style={styles.inputField}>
              <Text style={styles.dateTxt}>{dateTxt}</Text>
            </View>
            {showDatePicker && (
              <RNDateTimePicker
                mode="date"
                value={date}
                onChange={handleDatePicked}
              />
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "100%",
    height: 65,
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
  inputField: {
    marginHorizontal: 15,
  },
  dateTxt: {
    fontSize: 17,
    color: Colors.darkestGrey,
  },
  labelContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "left",
    borderWidth: 1,
    marginVertical: 5,
    borderColor: Colors.darkGrey,
    borderRadius: 4,
    marginHorizontal: 10,
    backgroundColor: Colors.innerBackground,
    width: 293,
  },
});
