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
import Ipcim from "../../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';


export default function Oktato_OraRogzites({ route }) {
  const { atkuld } = route.params;
  const navigation = useNavigation();
  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  const [selectedDiak, setSelectedDiak] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datum, setDatum] = useState("");
  const [ido, setIdo] = useState("");
  const [cim, setCim] = useState(""); // Opcionális cím mező

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
      alert("Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    const adatok = {
      bevitel1: selectedValue,
      bevitel2: atkuld.oktato_id,
      bevitel3: selectedDiak,
      bevitel4: `${datum} ${ido}`,
      bevitel5: cim || " ", // Ha nincs cím, egy default szöveg kerül be
    };

    try {
      const response = await fetch(Ipcim.Ipcim + "/oraFelvitel", {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const text = await response.text();
      alert("Óra sikeresen rögzítve!");
      navigation.goBack(); // Visszalép az előző oldalra
    } catch (error) {
      console.error("Hiba az óra rögzítésében:", error);
    }
  };

  const valtozikDatum = (event, selectedDatum) => {
    if (selectedDatum) {
      setShowDatePicker(false);
      const year = selectedDatum.getFullYear();
      const month = String(selectedDatum.getMonth() + 1).padStart(2, "0"); // 2 számjegyű hónap
      const day = String(selectedDatum.getDate()).padStart(2, "0"); // 2 számjegyű nap
      setDatum(`${year}-${month}-${day}`);
    }
  };

  const valtozikIdo = (event, selectedIdo) => {
    if (selectedIdo) {
      setShowTimePicker(false);
      const hours = String(selectedIdo.getHours()).padStart(2, "0"); // 2 számjegyű óra
      const minutes = String(selectedIdo.getMinutes()).padStart(2, "0"); // 2 számjegyű perc
      setIdo(`${hours}:${minutes}`);
    }
  };

  return (
    <LinearGradient colors={['#2a5298', '#FDEEDC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Új óra rögzítése</Text>

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

        <Text style={styles.label}>Óra helyszíne (opcionális):</Text>
        <TextInput
          style={styles.input}
          placeholder="Írd be a címet (nem kötelező)"
          placeholderTextColor="#999"
          value={cim}
          onChangeText={setCim}
        />

        <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>Dátum kiválasztása</Text>
        </TouchableOpacity>
        {datum ? <Text style={styles.date}>{datum}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.buttonText}>Idő kiválasztása</Text>
        </TouchableOpacity>
        {ido ? <Text style={styles.date}>{ido}</Text> : null}

        <TouchableOpacity style={styles.saveButton} onPress={felvitel}>
          <Text style={styles.buttonText}>Óra rögzítése</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker value={date} mode="date" is24Hour onChange={valtozikDatum} />
        )}
        {showTimePicker && (
          <DateTimePicker value={date} mode="time" is24Hour onChange={valtozikIdo} />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: "#fff",
    fontWeight: "600",
  },
  dropdown: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    backgroundColor: "#fff",
    padding: 10,
    textAlign: "center",
    borderRadius: 8,
    marginVertical: 5,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    color: "#333",
  },
});