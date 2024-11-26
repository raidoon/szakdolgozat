import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Provider } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthProvider } from "./Components/authContext";
import FoNavigator from "./Components/Fonavigator";
//--------------------------------------------------- kinézet import
import Styles from './Styles';

//--------------------------------------------------- ide jön a connection

/*

PÉLDA:

--------> Your Parse initialization configuration goes here

Parse.setAsyncStorage(AsyncStorage);

const PARSE_APPLICATION_ID = 'YOUR_PARSE_APPLICATION_ID';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_ID = 'YOUR_PARSE_JAVASCRIPT_ID';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_ID);
Parse.serverURL = PARSE_HOST_URL; 

------------> KOYEB Node.JS: 

.ENV

DATABASE_HOST="<DB_HOSTNAME>"
DATABASE_USER="<DB_ROLE>"
DATABASE_PASSWORD="<DB_PASSWORD>"
DATABASE_NAME="<DB_DATABASE_NAME>"

INDEX.TS

import postgres from 'postgres'
 
const sql = postgres({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: 'require',
})
*/

//---------------------------------------------------  navigátorok
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//--------------------------------------------------- fő app

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>  {/* Itt kell maradnia a NavigationContainer-nek */}
        <FoNavigator />  {/* Az egész navigációs logikát itt kezeljük */}
      </NavigationContainer>
    </AuthProvider>
  );
}
//------------------------------ új teszt app
/*
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bejelentkezes">
        <Stack.Screen
          name="Bejelentkezes"
          component={Bejelentkezes}
          options={{ title: "Bejelentkezés" }}
        ></Stack.Screen>

        <Stack.Screen
          name="Regisztracio"
          component={Regisztracio}
          options={{ title: "Regisztráció" }}
        ></Stack.Screen>

        <Stack.Screen
        name="BejelentkezesUtan"
        component={BejelentkezesUtan}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/
