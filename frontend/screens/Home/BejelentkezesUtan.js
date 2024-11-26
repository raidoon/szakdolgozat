import { Tab } from "react-native";
export default function BejelentkezesUtan() {
    return(
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Kezdőlap") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Dátumok") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Befizetések") {
              iconName = focused ? "cash" : "cash-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Kezdőlap" component={Kezdolap} />
        <Tab.Screen name="Dátumok" component={Datumok} />
        <Tab.Screen name="Befizetések" component={Befizetesek} />
        <Tab.Screen name="Profil" component={Profil} />
      </Tab.Navigator>
    );
  }
  