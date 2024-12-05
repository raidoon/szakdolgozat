import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://your-backend-url.com/api/login', { email, password });
      const { token } = response.data;
      await AsyncStorage.setItem('userToken', token); // Store the token
      Alert.alert('Login Successful');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Please try again.');
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
