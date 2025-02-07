import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Styles from "../Styles";

export default function Regisztracio() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const validatePassword = (pass) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return passwordRegex.test(pass);
  };

  const handleRegistration = () => {
    let valid = true;

    if (!validatePhoneNumber(phone)) {
      setPhoneError("Hibás telefonszám! Kérlek, adj meg egy 10 számjegyű számot.");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("A jelszónak 8-20 karakteresnek kell lennie, tartalmaznia kell legalább egy nagybetűt és egy számot.");
      valid = false;
    } else if (password !== confirmPassword) {
      setPasswordError("A jelszavak nem egyeznek meg.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      // Ide jöhet az API hívás vagy a regisztrációs logika
      Alert.alert("Sikeres regisztráció!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regisztráció</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Felhasználónév"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email cím"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefonszám"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Jelszó"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Jelszó megerősítése"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Regisztráció</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}> 
        <Text style={styles.link}>Vissza a bejelentkezéshez</Text>
      </TouchableOpacity>
    </View>
  );
} 
