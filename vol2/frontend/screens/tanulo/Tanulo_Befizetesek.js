import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../../Styles";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

export default function Tanulo_Befizetesek() {
  return(
     <View style={{}}>

     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 60,
  },
  keret: {
    margin: 5,
    borderWidth: 2,
    borderColor: "#d9b3ff",
    padding: 20,
    borderRadius: 20,
    width: "90%",
  },
  input: {
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
