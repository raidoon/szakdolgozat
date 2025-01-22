import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const BefizetesForm = () => {
  const [tanuloID, setTanuloID] = useState('');
  const [oktatoID, setOktatoID] = useState('');
  const [tipusID, setTipusID] = useState('');
  const [osszeg, setOsszeg] = useState('');
  const [ideje, setIdeje] = useState('');

  // Az adatok küldése a backendnek a fetch segítségével
  const handleSubmit = async () => {
    const adat = {
      befizetesek_tanuloID: tanuloID,
      befizetesek_oktatoID: oktatoID,
      befizetesek_tipusID: tipusID,
      befizetesek_osszeg: osszeg,
      befizetesek_ideje: ideje,
    };

    try {
      const response = await fetch('http://YOUR_SERVER_URL/tanuloBefizetesFelvitel', {
        method: 'POST',
        body: JSON.stringify(adat),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      const responseData = await response.json();
      
      if (response.ok) {
        Alert.alert('Siker', 'A befizetés felvitele sikerült!');
      } else {
        Alert.alert('Hiba', responseData.message || 'A befizetés felvitele nem sikerült.');
      }
    } catch (error) {
      Alert.alert('Hiba', 'Hiba történt a hálózati kérés során.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Tanuló ID"
        value={tanuloID}
        onChangeText={setTanuloID}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Oktató ID"
        value={oktatoID}
        onChangeText={setOktatoID}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Típus ID"
        value={tipusID}
        onChangeText={setTipusID}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Összeg"
        value={osszeg}
        onChangeText={setOsszeg}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Befizetés Ideje"
        value={ideje}
        onChangeText={setIdeje}
      />
      <Button title="Befizetés Felvitele" onPress={handleSubmit} />
    </View>
  );
};

export default BefizetesForm;
