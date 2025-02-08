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

export default function Oktato_BefizetesRogzites({ route }) {
  const { atkuld } = route.params;

  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]); // Új állapot a diákok dropdownhoz
  const [selectedValue, setSelectedValue] = useState(1); //tipus
  const [selectedDiak, setSelectedDiak] = useState(null); // Új állapot a kiválasztott diákhoz
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [datum, setDatum] = useState("");
  const [osszeg, setOsszeg] = useState("");
  const [szoveg, setSzoveg] = useState("");
  const [isChecked, setChecked] = useState(false);

  // Típusok betöltése
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

  // Diákok betöltése az oktató alapján
  useEffect(() => {
    const fetchDiakok = async () => {
      if (!atkuld || !atkuld.oktato_id) return;

      try {
        var adat={
          "oktato_id":atkuld.oktato_id
      }
        const response = await fetch(`${Ipcim.Ipcim}/aktualisDiakok`, {
          method: "POST",
          body: JSON.stringify(adat),
          headers: {"Content-type": "application/json; charset=UTF-8"}
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
    if (!datum || !selectedValue || !selectedDiak|| !osszeg) {
      alert("A kötelező mezőket töltsd ki!");
      return;
    }
//alert(selectedValue)
    const adatok = {
      bevitel1: selectedDiak,
      bevitel2: atkuld.oktato_id,
      bevitel3: selectedValue,
      bevitel4: osszeg,
      bevitel5: datum
      
      //megjegyzes: szoveg || "",
    };

    try {
      const response = await fetch(Ipcim.Ipcim + "/befizetesFelvitel", {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const text = await response.text();
      alert("Befizetés sikeresen rögzítve: " + text);
    } catch (error) {
      console.error("Hiba a befizetés rögzítésében:", error);
    }
  };

  const valtozikDatum = (event, selectedDatum) => {
    if (selectedDatum) {
      setShow(false);
      setDatum(
        `${selectedDatum.getFullYear()}-${selectedDatum.getMonth() + 1}-${selectedDatum.getDate()}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Új befizetés rögzítése:</Text>
      <Text>{atkuld ? `Felhasználó ID: ${atkuld.oktato_id}` : "Nincs adat"}</Text>

      {/* Dropdown: Óratípus */}
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

      {/* Dropdown: Diákok */}
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

      <TextInput
              style={styles.input}
              placeholder="Összeg"
              keyboardType="numeric"
              value={osszeg}
              onChangeText={setOsszeg}
            />

      <Button title="Dátum kiválasztása" onPress={() => setShow(true)} />
      {datum ? <Text style={styles.date}>{datum}</Text> : null}

      <Button title="Új befizetés felvitele" onPress={felvitel} />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour
          onChange={valtozikDatum}
        />
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
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});
