import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/Log/Login";
import Regisztracio from "./screens/Log/Regisztracio";

//teszt
import Oktato_BejelentkezesUtan2 from "./screens/oktato/Oktato_BejelentkezesUtan2";

//tanuloi profilok
import Tanulo_BejelentkezesUtan from "./screens/tanulo/Tanulo_BejelentkezesUtan";
import Tanulo_Kezdolap from "./screens/tanulo/Tanulo_Kezdolap";
import Tanulo_Datumok from "./screens/tanulo/Tanulo_Datumok";
import Tanulo_Befizetesek from "./screens/tanulo/Tanulo_Befizetesek";
import Tanulo_Profil from "./screens/tanulo/Tanulo_Profil";

//tanulo profilon belüli menük
import SzemelyesAdatok from "./screens/tanulo/ProfilScreens/SzemelyesAdatok";
import JelszoMegvaltoztatasa from "./screens/tanulo/ProfilScreens/JelszoMegvaltoztatasa";

import Kapcsolat from "./screens/tanulo/ProfilScreens/Kapcsolat";

//oktato profilok
import Oktato_BejelentkezesUtan from "./screens/oktato/Oktato_BejelentkezesUtan";
import Oktato_Kezdolap from "./screens/oktato/Oktato_Kezdolap";
import Oktato_Datumok from "./screens/oktato/Oktato_Datumok";
import Oktato_Kifizetesek from "./screens/oktato/Oktato_Kifizetesek";
import Oktato_Profil from "./screens/oktato/Oktato_Profil";
import Oktato_Diakok from "./screens/oktato/Oktato_Diakok";
import Oktato_TanuloReszletei from "./screens/oktato/Oktato_TanuloReszletei";
import Oktato_OraRogzites from "./screens/oktato/Oktato_OraRogzites";
import Oktato_AktualisTanulok from "./screens/oktato/Oktato_AktualisTanulok";
import Oktato_TanuloAOrak from "./screens/oktato/Oktato_TanuloAOrak";



const Stack = createStackNavigator();


function OktatoMenuStack(){
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
      
      <Stack.Screen name={"Oktato_Datumok"} component={Oktato_Datumok}/>
      <Stack.Screen name={"Oktato_Kifizetesek"} component={Oktato_Kifizetesek}/>
      <Stack.Screen name={"Oktato_Profil"} component={Oktato_Profil}/>
      <Stack.Screen name={"Oktato_Diakok"} component={Oktato_Diakok}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}

function TanuloMenusStack(){
  return(
      <Stack.Navigator screenOptions={{headerShown: false,}}>
      <Stack.Screen name="Tanulo_Kezdolap" component={Tanulo_Kezdolap}/>
      <Stack.Screen name="Tanulo_Datumok" component={Tanulo_Datumok}/>
      <Stack.Screen name="Tanulo_Befizetesek" component={Tanulo_Befizetesek}/>
      <Stack.Screen name="Tanulo_Profil" component={Tanulo_Profil}/>
    </Stack.Navigator>
  );
}

function TanuloProfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="SzemelyesAdatok" options={{title:"Személyes adatok módosítása"}} component={SzemelyesAdatok} />
      <Stack.Screen name="JelszoMegvaltoztatasa" options={{title:"Jelszó megváltoztatása"}} component={JelszoMegvaltoztatasa} />
      <Stack.Screen name="Kapcsolat" options={{title:"Kapcsolat felvétele"}} component={Kapcsolat} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bejelentkezes" screenOptions={{headerShown: false,}}>
        <Stack.Screen name="Bejelentkezes"  component={LoginScreen} />
        <Stack.Screen name="Regisztracio" component={Regisztracio}/>
        <Stack.Screen name="Tanulo_BejelentkezesUtan" component={Tanulo_BejelentkezesUtan}/>
        <Stack.Screen name="Oktato_BejelentkezesUtan2" component={Oktato_BejelentkezesUtan2}/>
        <Stack.Screen name="Tanuló menük" component={TanuloMenusStack}/>
        <Stack.Screen name="Tanuló Profil" component={TanuloProfilStack}/>
        <Stack.Screen name="Oktató menük" component={OktatoMenuStack}/>
        <Stack.Screen name="Oktato_TanuloReszletei" component={Oktato_TanuloReszletei}/>
        <Stack.Screen name="Oktato_OraRogzites" component={Oktato_OraRogzites} />
        <Stack.Screen name="Oktato_Kezdolap" component={Oktato_Kezdolap} />
        <Stack.Screen name="Oktato_AktualisTanulok" component={Oktato_AktualisTanulok} />
        <Stack.Screen name="Oktato_TanuloAOrak" component={Oktato_TanuloAOrak} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}