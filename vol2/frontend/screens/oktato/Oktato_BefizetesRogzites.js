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

export default function Oktato_BefizetesRogzites({ route }) {
  const { atkuld } = route.params;

  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  const [selectedDiak, setSelectedDiak] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datum, setDatum] = useState("");
  const [oraPerc, setOraPerc] = useState("");
  const [osszeg, setOsszeg] = useState("");

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
        const adat = { oktato_id: atkuld.oktato_id };
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
    if (!datum || !oraPerc || !selectedValue || !selectedDiak || !osszeg) {
      alert("A kötelező mezőket töltsd ki!");
      return;
    }

    const adatok = {
      bevitel1: selectedDiak,
      bevitel2: atkuld.oktato_id,
      bevitel3: selectedValue,
      bevitel4: osszeg,
      bevitel5: `${datum} ${oraPerc}`
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
      setShowDatePicker(false);
      setDatum(
        `${selectedDatum.getFullYear()}-${String(selectedDatum.getMonth() + 1).padStart(2, "0")}-${String(selectedDatum.getDate()).padStart(2, "0")}`
      );
    }
  };

  const valtozikIdo = (event, selectedTime) => {
    if (selectedTime) {
      setShowTimePicker(false);
      setOraPerc(
        `${String(selectedTime.getHours()).padStart(2, "0")}:${String(selectedTime.getMinutes()).padStart(2, "0")}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Új befizetés rögzítése:</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Összeg"
        keyboardType="numeric"
        value={osszeg}
        onChangeText={setOsszeg}
      />

      <Button title="Dátum kiválasztása" onPress={() => setShowDatePicker(true)} />
      {datum ? <Text style={styles.date}>{datum}</Text> : null}

      <Button title="Idő kiválasztása" onPress={() => setShowTimePicker(true)} />
      {oraPerc ? <Text style={styles.date}>{oraPerc}</Text> : null}

      <Button title="Új befizetés felvitele" onPress={felvitel} />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour
          onChange={valtozikDatum}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour
          onChange={valtozikIdo}
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
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  date: {
    backgroundColor: "yellow",
    padding: 5,
    textAlign: "center",
    marginVertical: 10,
  },
});

