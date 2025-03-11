import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, } from "react-native";
import Tanulo_Kezdolap from "./Tanulo_Kezdolap";
import Tanulo_Profil from "./Tanulo_Profil";
import Tanulo_Datumok from "./Tanulo_Datumok";
import Ipcim from "../../Ipcim";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect } from "react";
import Styles from "../../Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tanulo_KinekAkarszBefizetni from "./Tanulo_KinekAkarszBefizetni";
import { ActivityIndicator } from "react-native";
import SikerModal from "../../extra/SikerModal";
const Tab = createBottomTabNavigator();
const Tanulo_BejelentkezesUtan = ({ navigation, route }) => {
  const [adatok, setAdatok] = useState(null);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [sikerModalLathato, setSikerModalLathato] = useState(false);
  //--------------------------------------------- ADATOK BETÖLTÉSE ----------------------
  const sajatAdatokBetoltese = async () => {
    try {
      const adatok = await AsyncStorage.getItem("bejelentkezve");
      if (adatok) {
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
    const ellenorizSikeresBejelentkezes = async () => {
      const showModal = await AsyncStorage.getItem('showSuccessModal');
      if (showModal === 'true') {
        setSikerModalLathato(true);
        await AsyncStorage.removeItem('showSuccessModal'); // Törlés, hogy csak egyszer jelenjen meg
      }
    };
    ellenorizSikeresBejelentkezes();
  }, []);
  //AMIKOR MÉG TÖLTŐDNEK AZ ADATOK, AKKOR EZ A SCREEN FOG MEGJELENNI --> ide mehetne pl valami loading image vagy animáció! :)
  if (betolt) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{
          fontSize: 16,
          color: "#666",
          textAlign: "center",
          marginTop: 20,
        }}>Adatok betöltése folyamatban...</Text>
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
    <>
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
          } else if (route.name === "Tanulo_KinekAkarszBefizetni") 
          {
            iconName = focused ? "cash" : "cash-outline";
            
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
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
            backgroundColor: '#6495ED',
          },
          headerTintColor: '#fff',
          headerTitleStyle:{
            fontWeight: 'bold'
          }
        }}
        children={() => <Tanulo_Datumok atkuld={adatok} />}
      />
      <Tab.Screen
        name="Tanulo_KinekAkarszBefizetni"
        options={{ headerShown: false, title: "Pénzügy" }}
        children={() => <Tanulo_KinekAkarszBefizetni atkuld={adatok} />}
      />
      <Tab.Screen
        name="Tanulo_Profil"
        options={{ 
          title: "Beállítások",
          headerShown: true, 
          headerTitle: "Beállítások",
          headerStyle:{
            backgroundColor: '#6495ED',
          },
          headerTintColor: '#fff',
          headerTitleStyle:{
            fontWeight: 'bold'
          }
        }}
        children={() => <Tanulo_Profil atkuld={adatok} />}
      />
    </Tab.Navigator>
    <SikerModal
      visible={sikerModalLathato}
      onClose={()=>setSikerModalLathato(false)}
      title={'Sikeres bejelentkezés!'}
      body={`Üdvözöljük kedves tanuló!`}
      buttonText={"Oké"}
    />
    </>
  );
};
export default Tanulo_BejelentkezesUtan;