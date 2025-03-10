import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Oktato_OraRogzites({ route }) {
  const { atkuld } = route.params;
  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDiak, setSelectedDiak] = useState(null);
  const [datum, setDatum] = useState("");
  const [ido, setIdo] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Oktató adatok
  const oktatoNev = atkuld ? atkuld.oktato_neve : "Oktato";
  const oktatoEmail = atkuld ? atkuld.oktato_email : "oktato@example.com";

  // Dinamikus User-Agent generálása
  const userAgent = `${oktatoNev}/1.0 (${oktatoEmail})`;

  // Hungary's coordinates and region
  const hungaryRegion = {
    latitude: 47.1625,
    longitude: 19.5033,
    latitudeDelta: 5.0,
    longitudeDelta: 5.0,
  };

  useEffect(() => {
    const fetchAdatok = async () => {
      try {
        const response = await fetch(Ipcim.Ipcim + "/valasztTipus");
        const data = await response.json();
        setAdatTomb(data.map((item) => ({ label: item.oratipus_neve, value: item.oratipus_id })));
      } catch (error) {
        console.error("Hiba a típusok betöltésekor:", error);
      }
    };
    fetchAdatok();
  }, []);

  useEffect(() => {
    const fetchDiakok = async () => {
      if (!atkuld || !atkuld.oktato_id) return;
      try {
        const response = await fetch(`${Ipcim.Ipcim}/aktualisDiakok`, {
          method: "POST",
          body: JSON.stringify({ oktato_id: atkuld.oktato_id }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            'User-Agent': userAgent,
          },
        });
        const data = await response.json();
        setDiakTomb(data.map((item) => ({ label: item.tanulo_neve, value: item.tanulo_id })));
      } catch (error) {
        console.error("Hiba a diákok betöltésekor:", error);
      }
    };
    fetchDiakok();
  }, [atkuld, userAgent]);

  const valtozikDatum = (event, selectedDatum) => {
    if (selectedDatum) {
      setDatum(`${selectedDatum.getFullYear()}-${selectedDatum.getMonth() + 1}-${selectedDatum.getDate()}`);
      setShowDatePicker(false);
    }
  };

  const valtozikIdo = (event, selectedIdo) => {
    if (selectedIdo) {
      setIdo(`${selectedIdo.getHours()}:${selectedIdo.getMinutes()}`);
      setShowTimePicker(false);
    }
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': userAgent,
          },
        }
      );
      const data = await response.json();
      const address = data.address;
      const formattedAddress = `${address.road || ''} ${address.house_number || ''}, ${address.city || address.town || ''}`;
      setPlaceName(formattedAddress || "Ismeretlen hely");
    } catch (error) {
      console.error("Hiba a helynév lekérésekor:", error);
    }
  };

  const felvitel = async () => {
    if (!datum || !ido || !selectedValue || !selectedDiak || !placeName) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }

    const adatok = {
      bevitel1: selectedValue,
      bevitel2: atkuld.oktato_id,
      bevitel3: selectedDiak,
      bevitel4: `${datum} ${ido}`,
      bevitel5: placeName,
    };

    try {
      const response = await fetch(Ipcim.Ipcim + "/oraFelvitel", {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'User-Agent': userAgent,
        },
      });
      const text = await response.text();
      alert("Óra sikeresen rögzítve: " + text);
    } catch (error) {
      console.error("Hiba az óra rögzítésében:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Új óra rögzítése</Text>

      <Text style={styles.label}>Válassz típust:</Text>
      <Dropdown
        style={styles.dropdown}
        data={adatTomb}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="-- Válassz típust --"
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
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
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        value={selectedDiak}
        onChange={(item) => setSelectedDiak(item.value)}
      />

      <Text style={styles.label}>Válassz helyszínt:</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={hungaryRegion}
          onPress={handleMapPress}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} title={placeName} />}
        </MapView>
      </View>
      <Text style={styles.placeName}>Kiválasztott helyszín: {placeName || "Nincs kiválasztva"}</Text>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Dátum kiválasztása</Text>
      </TouchableOpacity>
      {datum ? <Text style={styles.selectedDate}>{datum}</Text> : null}

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.buttonText}>Idő kiválasztása</Text>
      </TouchableOpacity>
      {ido ? <Text style={styles.selectedDate}>{ido}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={felvitel}>
        <Text style={styles.buttonText}>Új óra felvitele</Text>
      </TouchableOpacity>

      {showDatePicker && <DateTimePicker value={new Date()} mode="date" is24Hour onChange={valtozikDatum} />}
      {showTimePicker && <DateTimePicker value={new Date()} mode="time" is24Hour onChange={valtozikIdo} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginVertical: 10,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    color: "#333",
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  placeName: {
    fontSize: 14,
    color: "#666",
    marginVertical: 10,
    textAlign: "center",
  },
  dateButton: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#03dac6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedDate: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
});