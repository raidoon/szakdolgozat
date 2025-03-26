import { useEffect, useState } from "react";
import {Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,View,KeyboardAvoidingView,Platform,} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ipcim from "../../../Ipcim";
import DateTimePicker from "@react-native-community/datetimepicker";
import HibaModal from "../../../extra/HibaModal";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Oktato_BefizetesRogzites({ route }) {
  const { atkuld } = route.params;
  const [hibaModalLathato, setHibaModalLathato] = useState(false);
  const [hibaModalSzoveg, setHibaModalSzoveg] = useState("");
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
      setHibaModalLathato(true);
      setHibaModalSzoveg('Minden mező kitöltése kötelező!');
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
      alert("Befizetés sikeresen rögzítve: " + text);
      // Reset form after successful submission
      setSelectedValue(null);
      setSelectedDiak(null);
      setDatum("");
      setOraPerc("");
      setOsszeg("");
    } catch (error) {
      console.error("Hiba a befizetés rögzítésében:", error);
      setHibaModalLathato(true);
      setHibaModalSzoveg('Hiba történt a befizetés rögzítése közben. Kérjük próbálja újra.');
    }
  };

  return (
    <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Új befizetés rögzítése</Text>
            <Text style={styles.subtitle}>Töltsd ki az alábbi mezőket</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Óratípus</Text>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: '#fff' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={adatTomb}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Válassz típust' : '...'}
              value={selectedValue}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSelectedValue(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <Ionicons 
                  name="school-outline" 
                  size={20} 
                  color={isFocus ? '#fff' : '#999'} 
                  style={styles.icon} 
                />
              )}
            />

            <Text style={styles.label}>Diák</Text>
            <Dropdown
              style={[styles.dropdown, isDiakFocus && { borderColor: '#fff' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={diakTomb}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isDiakFocus ? 'Válassz diákot' : '...'}
              value={selectedDiak}
              onFocus={() => setIsDiakFocus(true)}
              onBlur={() => setIsDiakFocus(false)}
              onChange={item => {
                setSelectedDiak(item.value);
                setIsDiakFocus(false);
              }}
              renderLeftIcon={() => (
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isDiakFocus ? '#fff' : '#999'} 
                  style={styles.icon} 
                />
              )}
            />

            <Text style={styles.label}>Összeg (Ft)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder=" "
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={osszeg}
                onChangeText={setOsszeg}
              />
            </View>

            <Text style={styles.label}>Dátum és idő</Text>
            <View style={styles.datetimeContainer}>
              <TouchableOpacity 
                style={styles.datetimeButton} 
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                <Text style={styles.datetimeButtonText}>
                  {datum ? datum : 'Dátum'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.datetimeButton} 
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#fff" />
                <Text style={styles.datetimeButtonText}>
                  {oraPerc ? oraPerc : 'Idő'}
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

          <HibaModal
            visible={hibaModalLathato}
            onClose={() => setHibaModalLathato(false)}
            title={'Hiba!'}
            body={hibaModalSzoveg}
            buttonText={"Értem"}
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
    flexGrow: 1,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
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
    fontWeight: "600",
    color: "#fff",
  },
  dropdown: {
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#fff',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 10,
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
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: 50,
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
    backgroundColor: '#7f8c8d',
    opacity: 0.7,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});