import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, Button } from "react-native";
import Tanulo_Kezdolap from "./Tanulo_Kezdolap";
import Tanulo_Profil from "./Tanulo_Profil";
import Tanulo_Datumok from "./Tanulo_Datumok";
import Tanulo_Befizetesek from "./Tanulo_Befizetesek";
import Ipcim from "../../Ipcim";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect } from "react";
import Styles from "../../Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const Tanulo_BejelentkezesUtan = ({ navigation, route }) => {
  const [adatok, setAdatok] = useState(null);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);

  const sajatAdatokBetoltese = async () => {
    try {
      const adatok = await AsyncStorage.getItem("bejelentkezve");
      if (adatok) {
        console.log(adatok);
        const user = JSON.parse(adatok);
        const response = await fetch(Ipcim.Ipcim + "/sajatAdatokT", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ felhasznalo_id: user.felhasznalo_id }), // 'user' objektum
        });

        if (!response.ok) {
          throw new Error("Hiba történt az adatok betöltésekor.");
        }

        const data = await response.json();
        setAdatok(data[0]);
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

  //AMIKOR MÉG TÖLTŐDNEK AZ ADATOK, AKKOR EZ A SCREEN FOG MEGJELENNI --> ide mehetne pl valami loading image vagy animáció! :)
  if (betolt) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Adatok betöltése folyamatban...</Text>
      </View>
    );
  }
  //AMIKOR HIBÁT KAPTUNK ADATBETÖLTÉS KÖZBEN VAGY UTÁN, AKKOR EZ A SCREEN FOG MEGJELENNI
  if (hiba) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Hiba: {hiba}</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Tanulo_Kezdolap") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Tanulo_Profil") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Tanulo_Datumok") {
            iconName = focused ? "car-sport" : "car-sport-outline";
          } else if (route.name === "Tanulo_Befizetesek") {
            iconName = focused ? "cash" : "cash-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        //tabBarActiveTintColor: "#0077B6", //kékeszöld
        //tabBarActiveTintColor: "#5c4ce3", // sötét lila
        tabBarActiveTintColor: "#6A5AE0", //árnyalatnyival világosabb lila
        //tabBarActiveTintColor: '#FF6B6B',
        //tabBarActiveTintColor: "tomato",
        //tabBarActiveTintColor: "#fff",
        //tabBarActiveTintColor: '#3BC14A', // zöld
        //tabBarActiveTintColor: "#183A37", //feketének tűnik de sötét zöld
        //tabBarActiveBackgroundColor: '#6A5AE0', // sötét lila háttér
        //tabBarActiveBackgroundColor: '#183A37', //sötét zöld ?
        //tabBarActiveBackgroundColor: '#776472', //earth vibe
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Tanulo_Kezdolap"
        options={{ headerShown: false, title: "Kezdőlap" }}
        children={() => <Tanulo_Kezdolap atkuld={adatok} />}
      />

      <Tab.Screen
        name="Tanulo_Datumok"
        options={{
          title: "Vezetés",
          headerShown: true,
          headerTitle: "Vezetési órarend",
          headerStyle:{
            backgroundColor: '#5c4ce3'
          },
          headerTintColor: '#fff',
          headerTitleStyle:{
            fontWeight: 'bold'
          }
        }}
        children={() => <Tanulo_Datumok atkuld={adatok} />}
      />

      <Tab.Screen
        name="Tanulo_Befizetesek"
        options={{ headerShown: false, title: "Pénzügy" }}
        children={() => <Tanulo_Befizetesek atkuld={adatok} />}
      />

      <Tab.Screen
        name="Tanulo_Profil"
        options={{ title: "Beállítások" }}
        children={() => <Tanulo_Profil atkuld={adatok} />}
      />
    </Tab.Navigator>
  );
};

export default Tanulo_BejelentkezesUtan;
