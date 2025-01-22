import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";  // Remove "web" import
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import Styles from "../../Styles";

const Tanulo_Datumok = () => {
  const [korabbiOrak, setKorabbiOrak] = useState(false);
//------------------------------------------------------------- CHECKBOX
  function SajatCheckbox({ label, isChecked, onPress }) {
    return (
      <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
        <Text style={{ fontSize: 17 }}>{label}</Text>
      </TouchableOpacity>
    );
  }
const [selected, setSelected] = useState("");
return (
  <View style={Styles.bejelentkezes_Container}>
    <View>
      <Calendar
        style={{
          borderWidth: 1,
          borderColor: "gray",
          height: 350,
          width: '100%'
        }}
        onDayPress={(day) => {
          console.log("selected day", day);
          setSelected(day)
        }}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "purple",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#dd99ee",
        }}
        markedDates={{
          [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'},
          "2025-01-10": {selected: true,marked: true, selectedColor: "green",},
          "2025-01-17": { marked: true },
          "2025-01-16": { marked: true },
          "2025-01-15": { marked: true },
        }}
        >
      </Calendar>
    </View>
    <View style={[{flex: 1 , marginTop: 20, }]}>
    <SajatCheckbox
                label="Korábbi órák betöltése"
                isChecked={korabbiOrak}
                onPress={() => {
                  if(korabbiOrak){
                    setKorabbiOrak(false)
                  }
                  else setKorabbiOrak(true)
                
                }}
              />
      <Text></Text>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop:0
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
    borderRadius: 30,
  },
  checkedCheckbox: {
    backgroundColor: "#5c4ce3",
  },
  checkboxView: {
    flexDirection: "row",
    alignContent: "space-between",
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContainer: {
    padding: 20,
  },
  "event-day": {
    backgroundColor: 'lightblue',
  },
});

export default Tanulo_Datumok;
