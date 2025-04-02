import { useEffect, useState } from "react";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  Modal 
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomAlert = ({ visible, title, message, onClose, type = 'error' }) => {
  if (!visible) return null;

  const alertConfig = {
    error: {
      icon: 'alert-circle',
      color: '#e74c3c',
      gradient: ['#e74c3c', '#c0392b'],
    },
    success: {
      icon: 'checkmark-circle',
      color: '#2ecc71',
      gradient: ['#2ecc71', '#27ae60'],
    },
    info: {
      icon: 'information-circle',
      color: '#3498db',
      gradient: ['#3498db', '#2980b9'],
    }
  };

  const config = alertConfig[type] || alertConfig.error;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.alertOverlay}>
        <LinearGradient 
          colors={config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.alertContainer}
        >
          <View style={styles.alertIconContainer}>
            <Ionicons name={config.icon} size={48} color="#fff" />
          </View>
          
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          
          <TouchableOpacity 
            style={styles.alertButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.alertButtonText}>Értem</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default function Oktato_BefizetesRogzites({ route }) {
  const { atkuld } = route.params;
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [alertTitle, setAlertTitle] = useState("Hiba!");
  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDiak, setSelectedDiak] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datum, setDatum] = useState("");
  const [oraPerc, setOraPerc] = useState("");
  const [osszeg, setOsszeg] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isDiakFocus, setIsDiakFocus] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Befizetés rögzítése",
      headerShown: true,
      headerStyle: { backgroundColor: '#1e90ff' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    });

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
  }, [navigation]);

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
      showAlert('Hiba!', 'Minden mező kitöltése kötelező!', 'error');
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
      showAlert('Siker!', 'Befizetés sikeresen rögzítve!', 'success');
      // Reset form after successful submission
      setSelectedValue(null);
      setSelectedDiak(null);
      setDatum("");
      setOraPerc("");
      setOsszeg("");
    } catch (error) {
      console.error("Hiba a befizetés rögzítésében:", error);
      showAlert('Hiba!', 'Hiba történt a befizetés rögzítése közben. Kérjük próbálja újra.', 'error');
    }
  };

  const showAlert = (title, message, type) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  return (
    <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Óratípus*</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="school-outline" size={20} color="#fff" style={styles.icon} />
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
              <Ionicons name="person-outline" size={20} color="#fff" style={styles.icon} />
              <Dropdown
                style={[styles.dropdown, isDiakFocus && { borderColor: '#fff' }]}
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
                onFocus={() => setIsDiakFocus(true)}
                onBlur={() => setIsDiakFocus(false)}
                onChange={item => {
                  setSelectedDiak(item.value);
                  setIsDiakFocus(false);
                }}
              />
            </View>

            <Text style={styles.label}>Összeg (Ft)*</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Írd be az összeget"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="numeric"
                value={osszeg}
                onChangeText={setOsszeg}
              />
            </View>

            <Text style={styles.label}>Dátum és idő*</Text>
            <View style={styles.datetimeContainer}>
              <TouchableOpacity 
                style={styles.datetimeButton} 
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                <Text style={styles.datetimeButtonText}>
                  {datum || "Válassz dátumot"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.datetimeButton} 
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#fff" />
                <Text style={styles.datetimeButtonText}>
                  {oraPerc || "Válassz időpontot"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!datum || !oraPerc || !selectedValue || !selectedDiak || !osszeg) && styles.disabledButton
              ]}
              onPress={felvitel}
              disabled={!datum || !oraPerc || !selectedValue || !selectedDiak || !osszeg}
            >
              <Text style={styles.submitButtonText}>
                <Ionicons name="save-outline" size={20} /> Befizetés rögzítése
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              is24Hour
              display="spinner"
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
              display="spinner"
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

          <CustomAlert
            visible={alertVisible}
            onClose={() => setAlertVisible(false)}
            title={alertTitle}
            message={alertMessage}
            type={alertType}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "600",
    color: "#fff",
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
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datetimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
  },
  datetimeButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Alert styles
  alertOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  alertContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  alertIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  alertButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});