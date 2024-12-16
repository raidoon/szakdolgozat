import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from 'react-native';
import Tanulo_Kezdolap from "./Tanulo_Kezdolap";
import Tanulo_Profil from "./Tanulo_Profil";
import Tanulo_Datumok from "./Tanulo_Datumok";
import Tanulo_Befizetesek from "./Tanulo_Befizetesek";
import Ipcim from "../../Ipcim";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState,useEffect } from "react";
import Styles from "../../Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default function Tanulo_BejelentkezesUtan({navigation, route}) {
  const { atkuld } = route.params;
  console.log("Fogadott adat: ", atkuld); //kapott id



  const [adatok, setAdatok] = useState([]);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  
  const sajatAdatokBetoltese = async () => {
    try {
      setBetolt(true);
      var adatok = {
        "felhasznaloID": atkuld,
      };
      const x = await fetch(Ipcim.Ipcim + "/sajatAdatokT", {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (!x.ok) {
        throw new Error('Hiba történt az adatok betöltése közben');
      }
      const data = await x.json();
      setAdatok(data);
      setBetolt(false);
    } catch (err) {
      setHiba(err.message);
      setBetolt(false);
    }
  };
  
  useEffect(() => {
    if (atkuld) {
      sajatAdatokBetoltese();
    }
  }, [atkuld]);
  
  //AMIKOR MÉG TÖLTŐDNEK AZ ADATOK, AKKOR EZ A SCREEN FOG MEGJELENNI --> ide mehetne pl valami loading image vagy animáció! :)
  if (betolt) {
    return(
      <View style={Styles.bejelentkezes_Container}>
        <Text>Adatok betöltése folyamatban...</Text>
      </View>
    ) 
  }
  //AMIKOR HIBÁT KAPTUNK ADATBETÖLTÉS KÖZBEN VAGY UTÁN, AKKOR EZ A SCREEN FOG MEGJELENNI
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
            if (route.name === "Tanulo_Kezdolap") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Tanulo_Profil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Tanulo_Datumok") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Tanulo_Befizetesek") {
              iconName = focused ? "cash" : "cash-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
            name="Tanulo_Kezdolap"
            options={{ title: "Kezdőlap" }}
            children={() => <Tanulo_Kezdolap atkuld={adatok} />}/>
        
        <Tab.Screen 
        name="Tanulo_Datumok" 
        options={{title:"Óráim"}} 
        children={() => <Tanulo_Datumok atkuld={adatok} />}/>
        
        <Tab.Screen 
            name="Tanulo_Befizetesek" 
            options={{title:"Befizetéseim"}} 
            children={() => <Tanulo_Befizetesek atkuld={adatok} />}/>
        
        <Tab.Screen 
            name="Tanulo_Profil" 
            options={{title:"Profil"}} 
            children={() => <Tanulo_Profil atkuld={adatok} />}/>

      </Tab.Navigator>
    );
  }