import { useAuth } from "./authContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Bejelentkezes from "./Bejelentkezes";
import Regisztracio from "./Regisztracio";
import BejelentkezesUtan from "../screens/Home/BejelentkezesUtan";
const Stack = createStackNavigator();
export default function FoNavigator() {
    const { isAuthenticated } = useAuth();
    return (
      <>
        {isAuthenticated ? (
          <BejelentkezesUtan />
        ) : (
          <Stack.Navigator initialRouteName="Bejelentkezes">
            <Stack.Screen
              name="Bejelentkezes"
              component={Bejelentkezes}
              options={{ title: "Bejelentkezés" }}
            />
            <Stack.Screen
              name="Regisztracio"
              component={Regisztracio}
              options={{ title: "Regisztráció" }}
            />
          </Stack.Navigator>
        )}
      </>
    );
}