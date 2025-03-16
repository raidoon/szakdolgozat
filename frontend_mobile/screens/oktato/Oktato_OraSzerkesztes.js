import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient colors={['#6495ED', '#ffff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
          placeholderTextColor="#999"
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
    backgroundColor: "#0057FF", // Slightly lighter green for buttons
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#2e7d32", // Same green as regular button
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