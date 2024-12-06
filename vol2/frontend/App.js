import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/Log/Login";
import Regisztracio from "./screens/Log/Regisztracio";

import Tanulo_BejelentkezesUtan from "./screens/tanulo/Tanulo_BejelentkezesUtan";

import Oktato_BejelentkezesUtan from "./screens/oktato/Oktato_BejelentkezesUtan";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bejelentkezes" screenOptions={{
    headerShown: false,
  }}>
        <Stack.Screen name="Bejelentkezes"  component={LoginScreen}/>
        <Stack.Screen name="Regisztracio" component={Regisztracio}/>
        <Stack.Screen name="Tanulo_BejelentkezesUtan" component={Tanulo_BejelentkezesUtan}/>
        <Stack.Screen name="Oktato_BejelentkezesUtan" component={Oktato_BejelentkezesUtan}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}