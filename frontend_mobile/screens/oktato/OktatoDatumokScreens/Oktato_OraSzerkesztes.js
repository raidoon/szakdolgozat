import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View,
  ActivityIndicator
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Oktato_OraSzerkesztes({ route, navigation }) {
  const { ora } = route.params;
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedDiak, setSelectedDiak] = useState(ora.tanulo_id);
  const [date, setDate] = useState(new Date(ora.ora_datuma));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datum, setDatum] = useState("");
  const [ido, setIdo] = useState("");
  const [cim, setCim] = useState(ora.ora_kezdeshelye);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const originalDate = new Date(ora.ora_datuma);
    setDatum(
      `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, "0")}-${String(originalDate.getDate()).padStart(2, "0")}`
    );
    setIdo(
      `${String(originalDate.getHours()).padStart(2, "0")}:${String(originalDate.getMinutes()).padStart(2, "0")}`
    );
  }, []);

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

  const frissites = async () => {
    if (isLoading) return;

    if (!datum || !ido || !selectedDiak) {
      Alert.alert("Hiányzó adatok", "Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${Ipcim.Ipcim}/oraSzerkesztes`, {
        method: "POST",
        body: JSON.stringify({
          bevitel1: selectedDiak,
          bevitel2: `${datum} ${ido}`,
          bevitel3: cim || " ",
          bevitel4: ora.ora_id,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      if (!response.ok) throw new Error("Hiba a frissítés során");

      Alert.alert("Siker", "Óra sikeresen frissítve!");
      navigation.goBack();
    } catch (error) {
      console.error("Hiba:", error);
      Alert.alert("Hiba", "Nem sikerült frissíteni az órát.");
    } finally {
      setIsLoading(false);
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

  const valtozikIdo = (event, selectedIdo) => {
    if (selectedIdo) {
      setShowTimePicker(false);
      setIdo(
        `${String(selectedIdo.getHours()).padStart(2, "0")}:${String(selectedIdo.getMinutes()).padStart(2, "0")}`
      );
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#E8F5E9']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Óra szerkesztése</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Diák kiválasztása</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: '#4CAF50' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={diakTomb}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Válassz diákot' : '...'}
            value={selectedDiak}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setSelectedDiak(item.value);
              setIsFocus(false);
            }}
          />

          <Text style={styles.label}>Dátum és idő</Text>
          <View style={styles.datumContainer}>
            <TouchableOpacity 
              style={styles.datumGomb} 
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#4CAF50" />
              <Text style={styles.datumGombText}>
                {datum || "Válassz dátumot"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.datumGomb} 
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={18} color="#4CAF50" />
              <Text style={styles.datumGombText}>
                {ido || "Válassz időpontot"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Helyszín</Text>
          <TextInput
            style={styles.input}
            placeholder="Írd be a címet"
            placeholderTextColor="#999"
            value={cim}
            onChangeText={setCim}
          />

          <TouchableOpacity 
            style={styles.mentesGomb} 
            onPress={frissites} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.mentesGombText}> Mentés</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
  },
  dropdown: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  datumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datumGomb: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 5,
  },
  datumGombText: {
    marginLeft: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
    marginBottom: 15,
  },
  mentesGomb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mentesGombText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
});