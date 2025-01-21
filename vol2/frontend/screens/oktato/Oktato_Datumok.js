import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

export default function OktatoDatumok() {
  const [adatTomb, setAdatTomb] = useState([]);
  const [szoveg, setSzoveg] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [datum, setDatum] = useState("");
  const [isChecked, setChecked] = useState(false);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("feladatok", jsonValue);
    } catch (e) {
      console.error("Adat mentési hiba:", e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("feladatok");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Adat beolvasási hiba:", e);
    }
  };

  useEffect(() => {
    getData().then((adat) => {
      setAdatTomb(adat);
    });
  }, []);

  const felvitel = () => {
    if (!szoveg || !datum) {
      alert("Minden mezőt tölts ki!");
      return;
    }
    const uj = [
      ...adatTomb,
      { id: Date.now(), feladat: szoveg, datum: datum, kesz: 0 },
    ];
    uj.sort((a, b) => new Date(a.datum) - new Date(b.datum));
    setAdatTomb(uj);
    storeData(uj);
    setSzoveg("");
    setDatum("");
    alert("Sikeres felvitel!");
  };

  const torles = () => {
    setAdatTomb([]);
    storeData([]);
    alert("Sikeres törlés!");
  };

  const valtozikDatum = (event, selectedDatum) => {
    if (selectedDatum) {
      setShow(false);
      setDatum(
        `${selectedDatum.getFullYear()}-${
          selectedDatum.getMonth() + 1
        }-${selectedDatum.getDate()}`
      );
    }
  };

  const befejezVagyVissza = (id) => {
    const uj = adatTomb.map((elem) =>
      elem.id === id ? { ...elem, kesz: elem.kesz === 0 ? 1 : 0 } : elem
    );
    setAdatTomb(uj);
    storeData(uj);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elkövetkezendő órák:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Óra megnevezése"
          onChangeText={setSzoveg}
          value={szoveg}
        />
        <TouchableOpacity onPress={() => setSzoveg("")} style={styles.clearButton}>
          <Text style={styles.clearText}>x</Text>
        </TouchableOpacity>
      </View>
      <Button title="Dátum kiválasztása" onPress={() => setShow(true)} />
      {datum ? <Text style={styles.date}>{datum}</Text> : null}
      <Button title="Új óra felvitele" onPress={felvitel} />
      <Checkbox value={isChecked} onValueChange={setChecked} />
      <Text>Korábbiak megjelenítése</Text>
      <TouchableOpacity onPress={torles} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Minden törlése</Text>
      </TouchableOpacity>
      <FlatList
        data={adatTomb}
        renderItem={({ item }) =>
          isChecked || !item.kesz ? (
            <View style={styles.item}>
              <Text style={styles.itemDate}>{item.datum}</Text>
              <Text style={styles.itemText}>{item.feladat}</Text>
              <TouchableOpacity
                onPress={() => befejezVagyVissza(item.id)}
                style={styles.statusButton}
              >
                <Text style={styles.statusText}>
                  {item.kesz ? "visszaállít" : "befejez"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        keyExtractor={(item) => item.id.toString()}
      />
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
  deleteButton: {
    backgroundColor: "brown",
    padding: 10,
    marginVertical: 10,
  },
  deleteText: {
    color: "white",
  },
  item: {
    padding: 20,
    borderColor: "#d9b3ff",
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 5,
  },
  itemDate: {
    color: "blue",
  },
  itemText: {
    fontSize: 18,
  },
  statusButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 5,
  },
  statusText: {
    textAlign: "center",
    color: "white",
  },
});
