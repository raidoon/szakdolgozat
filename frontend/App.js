import * as React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

//--------------------------------------------------- oldalak importálása

import Kezdolap from "./screens/Kezdolap";
import Profil from "./screens/Profile";
import Datumok from "./screens/Datumok";
import Befizetesek from "./screens/Befizetesek";

//--------------------------------------------------- kinézet import
import Styles from './Styles';

//---------------------------------------------------  navigátorok
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); 

//--------------------------------------------------- fő app
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