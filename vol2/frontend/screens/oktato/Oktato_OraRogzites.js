import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

export default function Oktato_OraRogzites({ route }) {
  const { atkuld } = route.params;

  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  const [selectedDiak, setSelectedDiak] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datum, setDatum] = useState("");
  const [ido, setIdo] = useState("");
  const [szoveg, setSzoveg] = useState("");
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    const fetchAdatok = async () => {
      try {
        const response = await fetch(Ipcim.Ipcim + "/valasztTipus");
        const data = await response.json();
        setAdatTomb(data.map((item) => ({ label: item.oratipus_neve, value: item.oratipus_id })));
      } catch (error) {
        console.error("Hiba a valasztTipus adatok betöltésekor:", error);
      }
    };
    fetchAdatok();
  }, []);

  useEffect(() => {
    const fetchDiakok = async () => {
      if (!atkuld || !atkuld.oktato_id) return;
      try {
        var adat = { "oktato_id": atkuld.oktato_id };
        const response = await fetch(`${Ipcim.Ipcim}/aktualisDiakok`, {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const data = await response.json();
        setDiakTomb(data.map((item) => ({ label: item.tanulo_neve, value: item.tanulo_id })));
      } catch (error) {
        console.error("Hiba az aktualisDiakok adatok betöltésekor:", error);
      }
    };
    fetchDiakok();
  }, [atkuld]);

  const felvitel = async () => {
    if (!datum || !ido || !selectedValue || !selectedDiak) {
      alert("A kötelező mezőket töltsd ki!");
      return;
    }
    const adatok = {
      bevitel1: selectedValue,
      bevitel2: atkuld.oktato_id,
      bevitel3: selectedDiak,
      bevitel4: `${datum} ${ido}`,
    };

    try {
      const response = await fetch(Ipcim.Ipcim + "/oraFelvitel", {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const text = await response.text();
      alert("Óra sikeresen rögzítve: " + text);
    } catch (error) {
      console.error("Hiba az óra rögzítésében:", error);
    }
  };

  const valtozikDatum = (event, selectedDatum) => {
    if (selectedDatum) {
      setShowDatePicker(false);
      setDatum(
        `${selectedDatum.getFullYear()}-${selectedDatum.getMonth() + 1}-${selectedDatum.getDate()}`
      );
    }
  };

  const valtozikIdo = (event, selectedIdo) => {
    if (selectedIdo) {
      setShowTimePicker(false);
      setIdo(`${selectedIdo.getHours()}:${selectedIdo.getMinutes()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Új óra rögzítése:</Text>
      <Text>{atkuld ? `Felhasználó ID: ${atkuld.oktato_id}` : "Nincs adat"}</Text>

      <Text style={styles.label}>Válassz típust:</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={adatTomb}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="-- Válassz --"
        value={selectedValue}
        onChange={(item) => setSelectedValue(item.value)}
      />

      <Text style={styles.label}>Válassz diákot:</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={diakTomb}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="-- Válassz diákot --"
        value={selectedDiak}
        onChange={(item) => setSelectedDiak(item.value)}
      />

      <Button title="Dátum kiválasztása" onPress={() => setShowDatePicker(true)} />
      {datum ? <Text style={styles.date}>{datum}</Text> : null}
      <Button title="Idő kiválasztása" onPress={() => setShowTimePicker(true)} />
      {ido ? <Text style={styles.date}>{ido}</Text> : null}

      <Button title="Új óra felvitele" onPress={felvitel} />
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" is24Hour onChange={valtozikDatum} />
      )}
      {showTimePicker && (
        <DateTimePicker value={date} mode="time" is24Hour onChange={valtozikIdo} />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: "brown",
    padding: 10,
  },
  clearText: {
    color: "white",
  },
  date: {
    backgroundColor: "yellow",
    padding: 5,
    textAlign: "center",
    marginVertical: 10,
  },
});
