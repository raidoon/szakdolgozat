import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/Log/Login";
import Regisztracio from "./screens/Log/Regisztracio";
import Tanulo_Kezdolap from "./screens/tanulo/Tanulo_Kezdolap";
import Oktato_Kezdolap from "./screens/oktato/Oktato_Kezdolap";


const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bejelentkezes">
        <Stack.Screen name="Bejelentkezes" component={LoginScreen}/>
        <Stack.Screen name="Regisztracio" component={Regisztracio}/>
        <Stack.Screen name="Tanulo_Kezdolap" component={Tanulo_Kezdolap}/>
        <Stack.Screen name="Oktato_Kezdolap" component={Oktato_Kezdolap}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}