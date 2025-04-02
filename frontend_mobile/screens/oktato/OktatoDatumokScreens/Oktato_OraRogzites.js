import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Modal,
  Pressable
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Oktato_OraRogzites({ route }) {
  const { atkuld } = route.params;
  const navigation = useNavigation();
  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDiak, setSelectedDiak] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datum, setDatum] = useState("");
  const [ido, setIdo] = useState("");
  const [cim, setCim] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusDiak, setIsFocusDiak] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'

  const isFormValid = datum && ido && selectedValue && selectedDiak;

  // Custom Alert Component
  const CustomAlert = ({ visible, title, message, type, onClose }) => {
    if (!visible) return null;

    const backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';

    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.alertOverlay}>
          <View style={[styles.alertContainer, { backgroundColor }]}>
            <Ionicons 
              name={type === 'success' ? "checkmark-circle" : "alert-circle"} 
              size={40} 
              color="#fff" 
              style={styles.alertIcon}
            />
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>
            <Pressable
              style={styles.alertButton}
              onPress={onClose}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const showAlert = (title, message, type) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    if (alertType === 'success') {
      navigation.goBack();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Új óra rögzítése",
      headerShown: true,
      headerStyle: { backgroundColor: '#1e90ff' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    });

    const fetchAdatok = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchTipusok(), fetchDiakok()]);
      } catch (error) {
        console.error("Error loading data:", error);
        showAlert("Hiba", "Nem sikerült betölteni az adatokat", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAdatok();
  }, [navigation]);

  const fetchTipusok = async () => {
    const response = await fetch(Ipcim.Ipcim + "/valasztTipus");
    const data = await response.json();
    setAdatTomb(data.map((item) => ({ label: item.oratipus_neve, value: item.oratipus_id })));
  };

  const fetchDiakok = async () => {
    if (!atkuld?.oktato_id) return;
    const adat = { "oktato_id": atkuld.oktato_id };
    const response = await fetch(`${Ipcim.Ipcim}/aktualisDiakok`, {
      method: "POST",
      body: JSON.stringify(adat),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    const data = await response.json();
    setDiakTomb(data.map((item) => ({ label: item.tanulo_neve, value: item.tanulo_id })));
  };

  const felvitel = async () => {
    if (!isFormValid) {
      showAlert("Hiányzó adatok", "Minden kötelező mezőt ki kell tölteni!", "error");
      return;
    }

    try {
      const adatok = {
        bevitel1: selectedValue,
        bevitel2: atkuld.oktato_id,
        bevitel3: selectedDiak,
        bevitel4: `${datum} ${ido}`,
        bevitel5: cim || " ",
      };

      const response = await fetch(Ipcim.Ipcim + "/oraFelvitel", {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      const text = await response.text();

      if (response.status === 400) {
        showAlert("Hiba", text, "error");
      } else if (response.ok) {
        showAlert("Siker", "Óra sikeresen rögzítve!", "success");
      } else {
        throw new Error("Ismeretlen hiba");
      }
    } catch (error) {
      console.error("Hiba az óra rögzítésében:", error);
      showAlert("Hiba", "Hiba az óra rögzítésében. Kérjük, próbálja újra.", "error");
    }
  };

  const valtozikDatum = (event, selectedDatum) => {
    if (selectedDatum) {
      setShowDatePicker(false);
      const year = selectedDatum.getFullYear();
      const month = String(selectedDatum.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDatum.getDate()).padStart(2, "0");
      setDatum(`${year}-${month}-${day}`);
    }
  };

  const valtozikIdo = (event, selectedIdo) => {
    if (selectedIdo) {
      setShowTimePicker(false);
      const hours = String(selectedIdo.getHours()).padStart(2, "0");
      const minutes = String(selectedIdo.getMinutes()).padStart(2, "0");
      setIdo(`${hours}:${minutes}`);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Óratípus*</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="school-outline" size={20} color="#999" style={styles.icon} />
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: '#fff' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={adatTomb}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Válassz típust"
              value={selectedValue}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSelectedValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <Text style={styles.label}>Diák*</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
            <Dropdown
              style={[styles.dropdown, isFocusDiak && { borderColor: '#fff' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={diakTomb}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Válassz diákot"
              searchPlaceholder="Keresés..."
              value={selectedDiak}
              onFocus={() => setIsFocusDiak(true)}
              onBlur={() => setIsFocusDiak(false)}
              onChange={item => {
                setSelectedDiak(item.value);
                setIsFocusDiak(false);
              }}
            />
          </View>

          <Text style={styles.label}>Helyszín (opcionális)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Óra helyszíne"
              placeholderTextColor="#999"
              value={cim}
              onChangeText={setCim}
            />
          </View>

          <Text style={styles.label}>Dátum*</Text>
          <TouchableOpacity 
            style={styles.datumGomb}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.datumText}>
              {datum || "Válassz dátumot"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Idő*</Text>
          <TouchableOpacity 
            style={styles.datumGomb}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.datumText}>
              {ido || "Válassz időpontot"}
            </Text>
          </TouchableOpacity>

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

        <TouchableOpacity 
          style={[
            styles.mentesGomb,
            isFormValid ? styles.aktivGomb : styles.passzivGomb
          ]}
          onPress={isFormValid ? felvitel : null}
        >
          <Text style={styles.mentesGombText}>
            <Ionicons name="save-outline" size={20} /> Óra rögzítése
          </Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          type={alertType}
          onClose={hideAlert}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    fontWeight: '600',
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  dropdown: {
    flex: 1,
    height: 50,
    color: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  datumGomb: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  datumText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  mentesGomb: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  aktivGomb: {
    backgroundColor: '#2ecc71',
  },
  passzivGomb: {
    backgroundColor: '#95a5a6',
  },
  mentesGombText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Alert styles
  alertOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  alertContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  alertIcon: {
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  alertButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});