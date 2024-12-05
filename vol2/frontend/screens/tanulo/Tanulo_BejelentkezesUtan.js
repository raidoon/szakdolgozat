import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Tanulo_Kezdolap from "./Tanulo_Kezdolap";
import Tanulo_Profil from "./Tanulo_Profil";
import Tanulo_Datumok from "./Tanulo_Datumok";
import Tanulo_Befizetesek from "./Tanulo_Befizetesek";

import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function Tanulo_BejelentkezesUtan({navigation, route}) {
  //const { atkuld } = route.params;
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
        <Tab.Screen name="Tanulo_Kezdolap" component={Tanulo_Kezdolap} />
        <Tab.Screen name="Tanulo_Datumok" component={Tanulo_Datumok} />
        <Tab.Screen name="Tanulo_Befizetesek" component={Tanulo_Befizetesek} />
        <Tab.Screen name="Tanulo_Profil" component={Tanulo_Profil} />
      </Tab.Navigator>
    );
  }