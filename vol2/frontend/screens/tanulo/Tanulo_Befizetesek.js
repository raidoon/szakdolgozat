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

export default function Tanulo_Befizetesek() {
  const [adatTomb, setAdatTomb] = useState([]);
  const [szoveg, setSzoveg] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [datum, setDatum] = useState("");
  const [isChecked, setChecked] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
    setMode("date");
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("feladatok", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("feladatok");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    /*
      let szemely={
        "id":0,
        "nev":"Ani",
        "email":"nahajia@gmail.com"
      }
      storeData(szemely)
    */
    /*
    let tomb=[
      {
        "id":0,
        "feladat":"verseny Debrecen",
        "datum":"2024.11.8",
        "kesz":0
      },
      {
        "id":1,
        "feladat":"fogászat",
        "datum":"2024.11.12",
        "kesz":0
      },      
    ]
      storeData(tomb)
*/

    getData().then((adat) => {
      //alert(JSON.stringify(adat))
      setAdatTomb(adat);
    });
  }, []);

  const felvitel = () => {
    let uj = [...adatTomb];
    uj.push({
      id: uj.length,
      feladat: szoveg,
      datum: datum,
      kesz: 0,
    });
    /*
      function custom_sort(a, b) {
        return new Date(a.datum).getTime() - new Date(b.datum).getTime();
      }
      uj.sort(custom_sort);
      */
    /*
      uj.sort((a, b) => {
        const dateA = new Date(a.datum);
        const dateB = new Date(b.datum);
        return dateA - dateB;
      });
      */

    uj.sort((a, b) => new Date(a.datum) - new Date(b.datum));

    setAdatTomb(uj);
    storeData(uj);
    alert("Sikeres felvitel!");
  };

  const torles = () => {
    let uj = [];
    setAdatTomb(uj);
    storeData(uj);
    alert("Sikeres törlés!");
  };

  const valtozikDatum = (event, datum) => {
    //alert(datum)
    setShow(false);
    setDatum(
      datum.getFullYear() + "-" + (datum.getMonth() + 1) + "-" + datum.getDate()
    );
  };

  const befejezVagyVissza = (id) => {
    //alert(id)
    let uj = [...adatTomb];
    for (elem of uj) {
      if (elem.id == id) {
        if (elem.kesz == 0) elem.kesz = 1;
        else elem.kesz = 0;
      }
    }
    setAdatTomb(uj);
    storeData(uj);
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "blue", textAlign: "left" }}>
        Befizetni kívánt összeg:
      </Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 8 }}>
          <TextInput
            style={styles.input}
            onChangeText={setSzoveg}
            value={szoveg}
          />
        </View>
        <View style={{ flex: 2 }}>
          <TouchableOpacity
            onPress={() => setSzoveg("")}
            style={{
              backgroundColor: "brown",
              margin: 15,
              padding: 5,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>x</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="DÁTUM" onPress={showMode} />
      <Text
        style={{
          backgroundColor: "yellow",
          margin: 5,
          padding: 5,
          width: "50%",
          textAlign: "center",
        }}
      >
        {datum}
      </Text>
      <Button title="BEFIZETÉS" onPress={felvitel} />

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 6 }}>
          <Checkbox
            style={{ margin: 5 }}
            value={isChecked}
            onValueChange={setChecked}
          />
          <Text>korábbiak</Text>
        </View>
        <View style={{ flex: 4 }}>
          <TouchableOpacity
            onPress={torles}
            style={{
              backgroundColor: "brown",
              margin: 5,
              padding: 5,
            }}
          >
            <Text style={{ color: "white" }}>Összes befizetés törlése</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={{ width: "90%" }}
        data={adatTomb}
        renderItem={({ item, index }) => (
          <View>
            {isChecked || !item.kesz ? (
              <View style={styles.keret}>
                <Text style={{ color: "blue" }}>{item.datum}</Text>
                <Text style={{ fontSize: 20 }}>{item.feladat}</Text>
                {item.kesz ? (
                  <TouchableOpacity onPress={() => befejezVagyVissza(item.id)}>
                    <Text
                      style={{
                        backgroundColor: "grey",
                        width: "40%",
                        padding: 5,
                        borderRadius: 5,
                      }}
                    >
                      visszaállít
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => befejezVagyVissza(item.id)}>
                    <Text
                      style={{
                        backgroundColor: "orange",
                        width: "40%",
                        padding: 5,
                        borderRadius: 5,
                      }}
                    >
                      elfogadásra vár
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>
        )}
        keyExtractor={(item, index) => index}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={(event, datum) => valtozikDatum(event, datum)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 60,
  },
  keret: {
    margin: 5,
    borderWidth: 2,
    borderColor: "#d9b3ff",
    padding: 20,
    borderRadius: 20,
    width: "90%",
  },
  input: {
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
