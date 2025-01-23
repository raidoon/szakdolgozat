import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import React, { useState, useEffect } from "react";
import Ipcim from "../../Ipcim";
import Styles from "../../Styles";

const Tanulo_Datumok = ({atkuld}) => {
  const [korabbiOrak, setKorabbiOrak] = useState(false);
  const [kivalasztottDatum, setKivalasztottDatum] = useState("");
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [frissites, setFrissites] = useState(false);
  //------------------------------------------------------------- CHECKBOX
  function SajatCheckbox({ label, isChecked, onPress }) {
    return (
      <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
        <Text style={{ fontSize: 17 }}>{label}</Text>
      </TouchableOpacity>
    );
  }
  //------------------------------------------------------------- A TANULÓ ÓRÁINAK BETÖLTÉSE
  const adatokBetoltese = async () => {
    try {
      const adat = {
        tanuloid: atkuld.tanuloid,
      };
      if (adat) {
        const orak = await fetch(Ipcim.Ipcim + "/egyTanuloOrai", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (!orak.ok) {
          throw new Error("Hiba történt az órák betöltése közben!");
        }
        const orakValasz = await orak.json();
        setKorabbiOrak(orakValasz);
        console.log("órák eddig: ", orakValasz);
      }
    } catch (err) {
      setHiba(err.message);
    } finally {
      setBetolt(false);
    }
  };

  useEffect(() => {
    adatokBetoltese();
  }, []);
  //-------------------------
  if (betolt) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Korábbi órák betöltése folyamatban...</Text>
      </View>
    );
  }

  if (hiba) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Hiba: {hiba}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.teljesdiv}>
      <View style={styles.datumdiv}>
        <Calendar
          style={styles.kalendar}
          onDayPress={(day) => {
            console.log("selected day", day);
            setKivalasztottDatum(day);
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
            [kivalasztottDatum]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "orange",
            },
            "2025-01-10": {
              selected: true,
              marked: true,
              selectedColor: "green",
            },
            "2025-01-17": { marked: true },
            "2025-01-16": { marked: true },
            "2025-01-15": { marked: true },
          }}
        ></Calendar>
      </View>

      <View style={styles.orakdiv}>
        <SajatCheckbox
          label="Korábbi órák betöltése"
          isChecked={korabbiOrak}
          onPress={() => {
            if (korabbiOrak) {
              setKorabbiOrak(false);
            } else setKorabbiOrak(true);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  teljesdiv: {
    flex: 1,
    backgroundColor: "green",
    marginTop: 40,
  },
  datumdiv: {
    backgroundColor: "orange",
    height: "auto",
  },
  orakdiv: {
    backgroundColor: "lightblue",
    flex: 2,
    flexDirection: "column",
  },
  kalendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: "auto",
    width: "100%",
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
});

export default Tanulo_Datumok;
