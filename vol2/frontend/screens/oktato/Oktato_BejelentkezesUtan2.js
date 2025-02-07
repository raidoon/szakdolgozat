import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Oktato_Befizetesek from "./Oktato_Befizetesek";
import Oktato_Kezdolap from "./Oktato_Kezdolap";
import Oktato_Datumok from "./Oktato_Datumok";
import Oktato_Profil from "./Oktato_Profil";
import Oktato_Diakok from "./Oktato_Diakok";

import Ionicons from "react-native-vector-icons/Ionicons";
import { Text, View, StyleSheet } from 'react-native';
import { useState,useEffect } from "react";
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";

const Tab = createBottomTabNavigator();

const Oktato_BejelentkezesUtan2 = ({ navigation, route }) => {
  const [storedData, setAdatok] = useState(null);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);

  const sajatAdatokBetoltese = async () => {
    try {
      const storedData = await AsyncStorage.getItem('bejelentkezve');
      if (storedData) {
        const user = JSON.parse(storedData);
        const response = await fetch(Ipcim.Ipcim + "/sajatAdatokO", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ felhasznaloID: user.felhasznalo_id }),
        });

        if (!response.ok) {
          throw new Error('Hiba történt az adatok betöltésekor.');
        }

        const data = await response.json();
        setAdatok(data[0]);
        console.log(data[0].felhasznalo_id)
      }
    } catch (err) {
      setHiba(err.message);
    } finally {
      setBetolt(false);
    }
  };

  useEffect(() => {
    sajatAdatokBetoltese();
  }, []);
    
  if (betolt) {
    return(
      <View style={Styles.bejelentkezes_Container}>
        <Text>Adatok betöltése folyamatban...</Text>
      </View>
    ) 
  }

  if (hiba) {
    return(
      <View style={Styles.bejelentkezes_Container}>
        <Text>Hiba: {hiba}</Text>
      </View>
    )
  }

  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Oktato_Kezdolap") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Oktato_Profil") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Oktato_Datumok") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Oktato_Befizetesek") {
            iconName = focused ? "cash" : "cash-outline";
          }else if(route.name === "Oktato_Diakok"){
            iconName = focused ? "people" : "people-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
          name="Oktato_Kezdolap"
          options={{ title: "Kezdőlap" }}
          children={() => <Oktato_Kezdolap atkuld={storedData} />}/>

      <Tab.Screen 
          name="Oktato_Datumok" 
          options={{title:"Dátumok"}}
          children={() => <Oktato_Datumok atkuld={storedData} />} />

      <Tab.Screen
          name="Oktato_Befizetesek" 
          options={{title:"Befizetések"}} 
          children={() => <Oktato_Befizetesek atkuld={storedData} />} />

      <Tab.Screen
            name="Oktato_Diakok" 
            options={{title:"Diákok"}} 
            children={() => <Oktato_Diakok atkuld={storedData} />} />

      <Tab.Screen 
          name="Oktato_Profil" 
          options={{title:"Oktatói Profil"}} 
          children={() => <Oktato_Profil atkuld={storedData} />} />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Oktato_BejelentkezesUtan2;
