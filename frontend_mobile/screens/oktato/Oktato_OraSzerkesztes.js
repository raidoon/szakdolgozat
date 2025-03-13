import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Oktato_OraSzerkesztes({ route, navigation }) {
  const { ora } = route.params; // Az átadott óra adatai
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedDiak, setSelectedDiak] = useState(ora.tanulo_id);
  const [date, setDate] = useState(new Date(ora.ora_datuma));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datum, setDatum] = useState("");
  const [ido, setIdo] = useState("");
  const [cim, setCim] = useState(ora.ora_kezdeshelye);
  const [isLoading, setIsLoading] = useState(false);

  // Dátum és idő formázása a meglévő adatokból
  useEffect(() => {
    const originalDate = new Date(ora.ora_datuma);
    setDatum(
      `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, "0")}-${String(originalDate.getDate()).padStart(2, "0")}`
    );
    setIdo(
      `${String(originalDate.getHours()).padStart(2, "0")}:${String(originalDate.getMinutes()).padStart(2, "0")}`
    );
  }, []);

  // Diákok betöltése
  useEffect(() => {
    const fetchDiakok = async () => {
      try {
        const response = await fetch(`${Ipcim.Ipcim}/aktualisDiakok`, {
          method: "POST",
          body: JSON.stringify({ oktato_id: ora.oktato_id }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (!response.ok) throw new Error("Hiba a diákok betöltésekor");
        const data = await response.json();
        setDiakTomb(data.map((item) => ({ label: item.tanulo_neve, value: item.tanulo_id })));
      } catch (error) {
        console.error("Hiba:", error);
        Alert.alert("Hiba", "Nem sikerült betölteni a diákokat.");
      }
    };
    fetchDiakok();
  }, []);

  // Óra frissítése
  const frissites = async () => {
    if (isLoading) return;

    if (!datum || !ido || !selectedDiak) {
      Alert.alert("Hiányzó adatok", "Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    const frissitettAdatok = {
      bevitel1: selectedDiak, // ora_diakja
      bevitel2: `${datum} ${ido}`, // ora_datuma
      bevitel3: cim || "Nincs megadva", // ora_kezdeshelye
      bevitel4: ora.ora_id, // ora_id
    };

    setIsLoading(true);
    try {
      const response = await fetch(`${Ipcim.Ipcim}/oraSzerkesztes`, {
        method: "POST",
        body: JSON.stringify(frissitettAdatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      if (!response.ok) throw new Error("Hiba a frissítés során");

      Alert.alert("Siker", "Óra sikeresen frissítve!");
      navigation.goBack(); // Visszalép az előző oldalra
    } catch (error) {
      console.error("Hiba:", error);
      Alert.alert("Hiba", "Nem sikerült frissíteni az órát.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dátum választás
  const valtozikDatum = (event, selectedDatum) => {
    if (selectedDatum) {
      setShowDatePicker(false);
      setDatum(
        `${selectedDatum.getFullYear()}-${String(selectedDatum.getMonth() + 1).padStart(2, "0")}-${String(selectedDatum.getDate()).padStart(2, "0")}`
      );
    }
  };

  // Idő választás
  const valtozikIdo = (event, selectedIdo) => {
    if (selectedIdo) {
      setShowTimePicker(false);
      setIdo(
        `${String(selectedIdo.getHours()).padStart(2, "0")}:${String(selectedIdo.getMinutes()).padStart(2, "0")}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Óra szerkesztése</Text>

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

      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Dátum kiválasztása</Text>
      </TouchableOpacity>
      {datum && <Text style={styles.date}>{datum}</Text>}

      <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.buttonText}>Idő kiválasztása</Text>
      </TouchableOpacity>
      {ido && <Text style={styles.date}>{ido}</Text>}

      <Text style={styles.label}>Óra helyszíne:</Text>
      <TextInput
        style={styles.input}
        placeholder="Írd be a címet"
        value={cim}
        onChangeText={setCim}
      />

      <TouchableOpacity style={styles.saveButton} onPress={frissites} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Feldolgozás..." : "Mentés"}</Text>
      </TouchableOpacity>

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
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: "#555",
  },
  dropdown: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  date: {
    backgroundColor: "#ffc107",
    padding: 8,
    textAlign: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
});