import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [felhasznalonev, setFelhasznalonev] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [adatok,setAdatok] = useState([]);
//192.168.1.190 ||192.168.10.57 ||192.168.10.58
  const handleLogin = async () => {
    const adatok={
        felhasznalonev: felhasznalonev,
        jelszo: jelszo
    }
    try{
        const response = await fetch("http://192.168.1.190:3000/bejelentkezes", {
            method: "POST",
            body: JSON.stringify(adatok),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
          const adat = await response.json();
          setAdatok(adat);
          if (adat.length > 0) {
            if(adat.felhasznalo_tipus==1){
                navigation.navigate("",);
            }
            else{
                navigation.navigate("",);
            }
          } else {
            alert("Hibás felhasználónév vagy jelszó!");
          }
    }
    catch (error) {
        console.error("Bejelentkezési hiba:", error);
        alert("Hiba történt a bejelentkezés során!");
    }
};

  return (
    <View>
      <Text>Felhasználónév:</Text>
      <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Text>Jelszó:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Regisztráió" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
