import * as React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
//--------------------------------------------------- oldalak importálása
import Kezdolap from "./screens/App/Kezdolap";
import Befizetesek from "./screens/App/Befizetesek";
import Datumok from "./screens/App/Datumok";
import Profil from "./screens/App/Profile";
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
//--------------------------------------------------- bejelentkeztetes
function Bejelentkeztetes(){
  return(
    <>
      <StatusBar/>
      <SafeAreaView>
        <View>
          <Text>Bejelentkezés</Text>
        </View>
      </SafeAreaView>
    </>
  );
}
//--------------------------------------------------- regisztráció
function Regisztracio(){
  return(
    <>
      <SafeAreaView>
        <View>
          <Text>Regisztráció</Text>
        </View>
      </SafeAreaView>
    </>
  );
}
//--------------------------------------------------- fő app


//IDE MÉG NEM A TAB NAVIGÁTOR KELL, HANEM EGY STACK NAVIGÁTOR, AMIBEN BENNE VAN A BEJELENTKEZÉS, A REGISZTRÁCIÓ ÉS AZ ALAP HOME OLDAL, AMIBEN A FELHASZNÁLÓ KI TUDJA VÁLASZTANI, HOGY BEJELENTKEZNI AKAR VAGY REGISZTRÁLNI !!!

// A TAB NAVIGÁTOR LEGYEN EGY KÜLÖN FUNCTION, AMI NEM AKKOR JÖN BE, AMIKOR BELÉPÜNK AZ APPBA, HANEM AKKOR, HA A BEJELENTKEZÉS SIKERES VOLT


export default function App() {
  return(
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Kezdőlap") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Dátumok"){
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Befizetések"){
              iconName = focused ? "cash" : "cash-outline";
            }
            // ikon komponens renderelés
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
        >
        <Tab.Screen name="Kezdőlap" component={Kezdolap} />
        <Tab.Screen name="Dátumok" component={Datumok}/>
        <Tab.Screen name="Befizetések" component={Befizetesek}/>
        <Tab.Screen name="Profil" component={Profil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}