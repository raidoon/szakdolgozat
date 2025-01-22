import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Ipcim from "../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

export default function Oktato_OraRogzites({ route }) {
  const { atkuld } = route.params; // Paraméter fogadása

  const [adatTomb, setAdatTomb] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [datum, setDatum] = useState("");
  const [szoveg, setSzoveg] = useState("");
  const [isChecked, setChecked] = useState(false);

  const felvitel = async () => {
    if (!datum) {
      alert("A kötelező mezőket töltsd ki!");
      return;
    }

    const adatok = {
      bevitel2: atkuld.oktato_id,
      bevitel4: datum,
      megjegyzes: szoveg || "",
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
      setShow(false);
      setDatum(
        `${selectedDatum.getFullYear()}-${selectedDatum.getMonth() + 1}-${selectedDatum.getDate()}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Új óra rögzítése:</Text>
      <Text>{atkuld ? `Felhasználó ID: ${atkuld.oktato_id}` : "Nincs adat"}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Megjegyzés (opcionális)"
          onChangeText={setSzoveg}
          value={szoveg}
        />
        <TouchableOpacity onPress={() => setSzoveg("")} style={styles.clearButton}>
          <Text style={styles.clearText}>Törlés</Text>
        </TouchableOpacity>
      </View>
      <Button title="Dátum kiválasztása" onPress={() => setShow(true)} />
      {datum ? <Text style={styles.date}>{datum}</Text> : null}
      <Button title="Új óra felvitele" onPress={felvitel} />
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
