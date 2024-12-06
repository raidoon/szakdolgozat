import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/Log/Login";
import Regisztracio from "./screens/Log/Regisztracio";

import Tanulo_BejelentkezesUtan from "./screens/tanulo/Tanulo_BejelentkezesUtan";
import Tanulo_Kezdolap from "./screens/tanulo/Tanulo_Kezdolap";
import Tanulo_Datumok from "./screens/tanulo/Tanulo_Datumok";
import Tanulo_Befizetesek from "./screens/tanulo/Tanulo_Befizetesek";
import Tanulo_Profil from "./screens/tanulo/Tanulo_Profil";

import Oktato_BejelentkezesUtan from "./screens/oktato/Oktato_BejelentkezesUtan";
import Oktato_Kezdolap from "./screens/oktato/Oktato_Kezdolap";
import Oktato_Datumok from "./screens/oktato/Oktato_Datumok";
import Oktato_Kifizetesek from "./screens/oktato/Oktato_Kifizetesek";
import Oktato_Profil from "./screens/oktato/Oktato_Profil";


const Stack = createStackNavigator();


function TanuloMenusStack(){
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
      <Stack.Screen name={"Tanulo_Kezdolap"} component={Tanulo_Kezdolap}/>
      <Stack.Screen name={"Tanulo_Datumok"} component={Tanulo_Datumok}/>
      <Stack.Screen name={"Tanulo_Befizetesek"} component={Tanulo_Befizetesek}/>
      <Stack.Screen name={"Tanulo_Profil"} component={Tanulo_Profil}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}

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
        <Stack.Screen name="Tanuló menük" component={TanuloMenusStack}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}