import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./screens/Log/authContext";
import FoNavigator from "./screens/Log/Fonavigator";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <FoNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}