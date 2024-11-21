import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Provider } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
//--------------------------------------------------- belépés előtti oldalak importálása
import Bejelentkezes from "./Components/Bejelentkezes";
import Regisztracio from "./Components/Regisztracio";

//--------------------------------------------------- belépés utáni oldalak importálása
import Kezdolap from "./screens/Home/Kezdolap";
import Befizetesek from "./screens/Home/Befizetesek";
import Datumok from "./screens/Home/Datumok";
import Profil from "./screens/Home/Profile";
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

//IDE MÉG NEM A TAB NAVIGÁTOR KELL, HANEM EGY STACK NAVIGÁTOR, AMIBEN BENNE VAN A BEJELENTKEZÉS, A REGISZTRÁCIÓ ÉS AZ ALAP HOME OLDAL, AMIBEN A FELHASZNÁLÓ KI TUDJA VÁLASZTANI, HOGY BEJELENTKEZNI AKAR VAGY REGISZTRÁLNI !!!

// A TAB NAVIGÁTOR LEGYEN EGY KÜLÖN FUNCTION, AMI NEM AKKOR JÖN BE, AMIKOR BELÉPÜNK AZ APPBA, HANEM AKKOR, HA A BEJELENTKEZÉS SIKERES VOLT

/*

//------------- ez a tabnavigatoros HomeScreen egy sikeres bejelentkezés után

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

*/

//----------------------------------------------- emlékeztető teszt app
/*
export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="Bejelentkezes" component={Bejelentkeztetes} />
          <Stack.Screen name="Regisztracio" component={Regisztracio} />
          <Stack.Screen name="Kezdolap" component={Kezdolap} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}*/

//------------------------------ új teszt app
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
