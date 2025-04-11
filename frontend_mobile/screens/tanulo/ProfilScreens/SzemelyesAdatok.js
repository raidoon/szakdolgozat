import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HibaModal from "../../../extra/HibaModal";
import SikerModal from "../../../extra/SikerModal";

export default function SzemelyesAdatok({ route }) {
  const { atkuld } = route.params;

  // State for editable fields
  const [name, setName] = useState(atkuld.tanulo_neve);
  const [email, setEmail] = useState(atkuld.felhasznalo_email);
  const [phone, setPhone] = useState(atkuld.felhasznalo_telefonszam);

   //------------------------------------------------------------- MODÁLOK
    const [hibaModal, setHibaModal] = useState(false);
    const [hibaModalCim, setHibaModalCim] = useState('');
    const [hibaModalSzoveg, setHibaModalSzoveg] = useState('');
    const [sikerModal, setSikerModal] = useState(false);
    const [sikerModalCim, setSikerModalCim] = useState('');
    const [sikerModalSzoveg, setSikerModalSzoveg] = useState('');

  // Refs for focusing inputs
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Function to handle saving changes
  const handleSave = () => {
    if (!name || !email || !phone) {
      setHibaModalCim('Hiba!');
      setHibaModalSzoveg('Minden mező kitöltése kötelező!');
      setHibaModal(true);
      return;
    }

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      setHibaModalCim('Hiba!');
      setHibaModalSzoveg('Érvénytelen email cím!');
      setHibaModal(true);
      return;
    }

    // Basic phone number validation
    if (isNaN(phone) || phone.length < 6) {
      setHibaModalCim('Hiba!');
      setHibaModalSzoveg('Érvénytelen telefonszám!');
      setHibaModal(true);
      return;
    }

    // TODO: Send updated data to the backend
    setSikerModalCim('Siker!');
    setSikerModalSzoveg('Adatok sikeresen frissítve!');
    setSikerModal(true);
    //console.log("Updated Data:", { name, email, phone });
  };

  return (
    <View style={styles.container}>
      {/* Clear Headline */}
      <Text style={styles.title}>Személyes adatok szerkesztése</Text>
      <Text style={styles.subtitle}>
        Itt módosíthatod a neved, email címed és telefonszámod.
      </Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#4CAF50" />
        <TextInput
          ref={nameInputRef}
          style={styles.input}
          placeholder="Teljes név szerkesztése"
          value={name}
          onChangeText={setName}
          editable={true}
        />
        <TouchableOpacity onPress={() => nameInputRef.current.focus()}>
          <Ionicons name="pencil-outline" size={20} color="#6495ED" />
        </TouchableOpacity>
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#2196F3" />
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="Email cím szerkesztése"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={true}
        />
        <TouchableOpacity onPress={() => emailInputRef.current.focus()}>
          <Ionicons name="pencil-outline" size={20} color="#6495ED" />
        </TouchableOpacity>
      </View>

      {/* Phone Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#FF9800" />
        <TextInput
          ref={phoneInputRef}
          style={styles.input}
          placeholder="Telefonszám szerkesztése"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={true}
        />
        <TouchableOpacity onPress={() => phoneInputRef.current.focus()}>
          <Ionicons name="pencil-outline" size={20} color="#6495ED" />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Változtatások mentése</Text>
      </TouchableOpacity>


      <HibaModal
        visible={hibaModal}
        onClose={() => setHibaModal(false)}
        title={hibaModalCim}
        body={hibaModalSzoveg}
        buttonText={"Rendben"}
      />
      <SikerModal
        visible={sikerModal}
        onClose={() => setSikerModal(false)}
        title={sikerModalCim}
        body={sikerModalSzoveg}
        buttonText={"Rendben"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#6495ED",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});