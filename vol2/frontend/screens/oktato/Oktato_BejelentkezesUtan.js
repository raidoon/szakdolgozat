import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Oktato_Kezdolap from "./Oktato_Kezdolap";
import Oktato_Datumok from "./Oktato_Datumok";
import Oktato_Profil from "./Oktato_Profil";
import Oktato_Kifizetesek from "./Oktato_Kifizetesek";
import Oktato_Diakok from "./Oktato_Diakok";

import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function Oktato_BejelentkezesUtan({ route}) {
  const { atkuld } = route.params;
  //const { navigation } = route.params;
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
            } else if (route.name === "Oktato_Kifizetesek") {
              iconName = focused ? "cash" : "cash-outline";
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
            children={() => <Oktato_Kezdolap atkuld={atkuld} />}/>

        <Tab.Screen 
            name="Oktato_Datumok" 
            options={{title:"Dátumok"}}
            children={() => <Oktato_Datumok atkuld={atkuld} />} />

        <Tab.Screen
            name="Oktato_Kifizetesek" 
            options={{title:"Kifizetések"}} 
            children={() => <Oktato_Kifizetesek atkuld={atkuld} />} />

        <Tab.Screen 
            name="Oktato_Profil" 
            options={{title:"Oktatói Profil"}} 
            children={() => <Oktato_Profil atkuld={atkuld} />} />

      </Tab.Navigator>
    );
  }