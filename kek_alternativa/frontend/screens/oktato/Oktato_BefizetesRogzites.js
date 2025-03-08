import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
      if (!atkuld?.oktato_id) return;

      try {
        const response = await fetch(`${Ipcim.Ipcim}/aktualisDiakok`, {
          method: "POST",
          body: JSON.stringify({ oktato_id: atkuld.oktato_id }),
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

    try {
      const response = await fetch(Ipcim.Ipcim + "/befizetesFelvitel", {
        method: "POST",
        body: JSON.stringify({
          bevitel1: selectedDiak,
          bevitel2: atkuld.oktato_id,
          bevitel3: selectedValue,
          bevitel4: osszeg,
          bevitel5: `${datum} ${oraPerc}`,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const text = await response.text();
      alert("Befizetés sikeresen rögzítve: " + text);
    } catch (error) {
      console.error("Hiba a befizetés rögzítésében:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Új befizetés rögzítése</Text>

      <Text style={styles.label}>Válassz típust:</Text>
      <Dropdown
        style={styles.dropdown}
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

      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Dátum kiválasztása</Text>
      </TouchableOpacity>
      {datum ? <Text style={styles.dateText}>{datum}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.buttonText}>Idő kiválasztása</Text>
      </TouchableOpacity>
      {oraPerc ? <Text style={styles.dateText}>{oraPerc}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={felvitel}>
        <Text style={styles.submitButtonText}>Új befizetés rögzítése</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour
          onChange={(event, selectedDatum) => {
            if (selectedDatum) {
              setShowDatePicker(false);
              setDatum(selectedDatum.toISOString().split("T")[0]);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour
          onChange={(event, selectedTime) => {
            if (selectedTime) {
              setShowTimePicker(false);
              setOraPerc(
                `${String(selectedTime.getHours()).padStart(2, "0")}:${String(selectedTime.getMinutes()).padStart(2, "0")}`
              );
            }
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
    flexGrow: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#5ca683",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#a65c98",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 5,
  },
});
