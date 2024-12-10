import React, { useState } from "react";
import {View, Text, TextInput, Alert, TouchableOpacity, StyleSheet} from "react-native";
import Ripple from "react-native-material-ripple";
import { Octicons, Ionicons } from "@expo/vector-icons";
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";

function CustomCheckbox({ label, isChecked, onPress }) {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onPress}
    >
      <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Regisztracio({ navigation }) {
  const [email, setEmail] = useState("");
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [nev, setNev] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [telefonszam,setTelefonszam] = useState("");
  const [joaJelszo, setJoaJelszo] = useState("");
  const [jelszoMutatasa, setJelszoMutatasa] = useState(false);
  const [masodikJelszoMutatasa, setMasodikJelszoMutatasa] = useState(false);
  const [tanulo, setTanulo] = useState(false);
  const [oktato, setOktato] = useState(false);

  const Regisztralas = async () => {
    const tipus = tanulo ? 2 : oktato ? 1 : null;
    if (!felhasznalonev || !nev || !telefonszam || !email || !jelszo || !tipus) {
      Alert.alert("Kérlek, töltsd ki az összes mezőt!");
      return;
    }
    if (jelszo !== joaJelszo) {
      Alert.alert("A jelszavak nem egyeznek!");
      return;
    }if (!tanulo && !oktato) {
      Alert.alert("Kérlek, válassz egy típust!");
      return;
    }
  
    try {
      const response = await fetch(Ipcim.Ipcim + "/regisztracio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          felhasznalonev,
          telefonszam,
          email,
          jelszo,
          tipus,
          nev
        }),
      });
  
      if (response.ok) {
        Alert.alert("Sikeres regisztráció!");
        navigation.replace("Bejelentkezes");
      } else {
        const errorMessage = await response.text();
        Alert.alert("Hiba", errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hálózati hiba", "Kérjük, próbálkozz újra.");
    }
  };
  

  return (
    <View style={Styles.bejelentkezes_Container}>
      <Text style={Styles.focim}>Regisztráció</Text>
      <Text style={Styles.alcim}>Először add meg az adataidat</Text>

      <View style={styles.inputWrapper}>
        <Octicons name="person" size={20} color="#FF6C00" />
        <TextInput
          style={styles.input}
          placeholder="Felhasználónév"
          value={felhasznalonev}
          onChangeText={setFelhasznalonev}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Octicons name="person" size={20} color="#FF6C00" />
        <TextInput
          style={styles.input}
          placeholder="Teljes név"
          value={nev}
          onChangeText={setNev}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="call-outline" size={20} color="#FF6C00"/>
        <TextInput
          style={styles.input}
          placeholder="Telefonszám"
          keyboardType="numeric"
          value={telefonszam}
          onChangeText={setTelefonszam}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Octicons name="mail" size={20} color="#FF6C00" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Octicons name="lock" size={20} color="#FF6C00" />
        <TextInput
          style={styles.input}
          placeholder="Jelszó"
          secureTextEntry={!jelszoMutatasa}
          value={jelszo}
          onChangeText={setJelszo}
        />
        <TouchableOpacity onPress={() => setJelszoMutatasa(!jelszoMutatasa)}>
          <Ionicons
            name={jelszoMutatasa ? "eye" : "eye-off"}
            size={20}
            color="#FF6C00"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <Octicons name="lock" size={20} color="#FF6C00" />
        <TextInput
          style={styles.input}
          placeholder="Jelszó mégegyszer"
          secureTextEntry={!masodikJelszoMutatasa}
          value={joaJelszo}
          onChangeText={setJoaJelszo}
        />
        <TouchableOpacity
          onPress={() => setMasodikJelszoMutatasa(!masodikJelszoMutatasa)}
        >
          <Ionicons
            name={masodikJelszoMutatasa ? "eye" : "eye-off"}
            size={20}
            color="#FF6C00"
          />
        </TouchableOpacity>
      </View>

      <View>
      <CustomCheckbox
        label="Tanuló vagyok"
        isChecked={tanulo}
        onPress={() => {
          setTanulo(true);
          setOktato(false);
        }}
      />
      <CustomCheckbox
        label="Oktató vagyok"
        isChecked={oktato}
        onPress={() => {
          setOktato(true);
          setTanulo(false);
        }}
      />
    </View>

      <Ripple
        rippleColor="white"
        rippleOpacity={0.2}
        rippleDuration={300}
        style={styles.signupButton}
        onPress={Regisztralas}
      >
        <Text style={styles.signupButtonText}>REGISZTRÁCIÓ</Text>
      </Ripple>

      <TouchableOpacity
        onPress={() => navigation.replace("Bejelentkezes")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.bottomText}>
          Már van fiókod?{" "}
          <Text style={styles.linkText}>Jelentkezz be</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: "#000",
  },
  label: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  signupButton: {
    backgroundColor: "#020202",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomText: {
    color: "#888",
    fontSize: 14,
  },
  linkText: {
    color: "#FF6C00",
    fontWeight: "bold",
  },
});