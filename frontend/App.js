import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./Components/authContext";
import FoNavigator from "./Components/Fonavigator";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <FoNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}