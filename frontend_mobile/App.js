import React, { useState} from "react";
import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/Log/Login";
import Regisztracio from "./screens/Log/Regisztracio";
//---------------------------------------------------------------------------------tanuloi menü pontok
import Tanulo_BejelentkezesUtan from "./screens/tanulo/Tanulo_BejelentkezesUtan";
import Tanulo_Kezdolap from "./screens/tanulo/Tanulo_Kezdolap";
import Tanulo_Datumok from "./screens/tanulo/Tanulo_Datumok";
import Tanulo_Profil from "./screens/tanulo/Tanulo_Profil";
//------------------------------- TANULOI BEFIZETESEK
import Tanulo_Befizetesek from "./screens/tanulo/Tanuloi_Befizetesek/Tanulo_Befizetesek";
import Tanulo_KinekAkarszBefizetni from "./screens/tanulo/Tanulo_KinekAkarszBefizetni";
import AutosiskolanakAkarokFizetni from "./screens/tanulo/Tanuloi_Befizetesek/AutosiskolanakAkarokFizetni";
import OktatonakAkarokFizetni from "./screens/tanulo/Tanuloi_Befizetesek/OktatonakAkarokFizetni";
//import FizetesiElozmenyek from "./screens/tanulo/Tanuloi_Befizetesek/FizetesiElozmenyek";
//-------------------------tanulo profilon belüli menük
import SzemelyesAdatok from "./screens/tanulo/ProfilScreens/SzemelyesAdatok";
import JelszoMegvaltoztatasa from "./screens/tanulo/ProfilScreens/JelszoMegvaltoztatasa";
import Kapcsolat from "./screens/tanulo/ProfilScreens/Kapcsolat";
//------------------------------------------------------------------------- OKTATÓK
//oktato profilok
import Oktato_BejelentkezesUtan2 from "./screens/oktato/Oktato_BejelentkezesUtan2";
import Oktato_Kezdolap from "./screens/oktato/Oktato_Kezdolap";
import Oktato_Datumok from "./screens/oktato/Oktato_Datumok";
import Oktato_Befizetesek from "./screens/oktato/Oktato_Befizetesek";
import Oktato_Profil from "./screens/oktato/Oktato_Profil";
import Oktato_Diakok from "./screens/oktato/Oktato_Diakok";
import Oktato_TanuloReszletei from "./screens/oktato/Oktato_TanuloReszletei";
import Oktato_OraRogzites from "./screens/oktato/Oktato_OraRogzites";
import Oktato_AktualisTanulok from "./screens/oktato/Oktato_AktualisTanulok";
import Oktato_LevizsgazottTanulok from "./screens/oktato/Oktato_LevizsgazottTanulok";
import Oktato_TanuloAOrak from "./screens/oktato/Oktato_TanuloAOrak";
import Oktato_TanuloLOrak from "./screens/oktato/Oktato_TanuloLOrak";
import Oktato_MegerositesrevaroOrak from "./screens/oktato/Oktato_MegerositesrevaroOrak";
import Oktato_MegerositOra from "./screens/oktato/Oktato_MegerositOra";
import Oktato_BefizetesRogzites from "./screens/oktato/Oktato_BefizetesRogzites";
import Oktato_ATBefizetesek from "./screens/oktato/Oktato_ATBefizetesek";
import Oktato_LTBefizetesek from "./screens/oktato/Oktato_LTBefizetesek";
import Oktato_MegerositesrevaroFizetes from "./screens/oktato/Oktato_MegerositesrevaroFizetes";
import Oktato_MegerositBefizetes from "./screens/oktato/Oktato_MegerositBefizetes";
import Oktato_TanuloABefizetesek from "./screens/oktato/Oktato_TanuloABefizetesek";
import Oktato_TanuloLBefizetesek from "./screens/oktato/Oktato_TanuloLBefizetesek";
import Oktato_KovetkezoOra from "./screens/oktato/Oktato_KovetkezoOra";
import Oktato_AKTUALIS from "./screens/oktato/Oktato_AKTUALIS";
import Oktato_LEVIZSGAZOTT from "./screens/oktato/Oktato_LEVIZSGAZOTT";
import Oktato_LevizsgazottTanuloReszletei from "./screens/oktato/Oktato_LevizsgazottTanuloReszletei";
import Oktato_ElkovetkezendoOrak from "./screens/oktato/Oktato_ElkovetkezendoOrak";
import Oktato_OraSzerkesztes from "./screens/oktato/Oktato_OraSzerkesztes";




//oktató profilok vége
const Stack = createStackNavigator();


function OktatoMenuStack(){
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
      
      <Stack.Screen name={"Oktato_Datumok"} component={Oktato_Datumok}/>
      <Stack.Screen name={"Oktato_Befizetesek"} component={Oktato_Befizetesek}/>
      <Stack.Screen name={"Oktato_Profil"} component={Oktato_Profil}/>
      <Stack.Screen name={"Oktato_Diakok"} component={Oktato_Diakok}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}
//<Stack.Screen name="Tanulo_Befizetesek" component={Tanulo_Befizetesek}/>
function TanuloMenusStack(){
  return(
      <Stack.Navigator screenOptions={{headerShown: false,}}>
      <Stack.Screen name="Tanulo_Kezdolap" component={Tanulo_Kezdolap}/>
      <Stack.Screen name="Tanulo_Datumok" component={Tanulo_Datumok}/>
      <Stack.Screen name="Tanulo_KinekAkarszBefizetni" component={Tanulo_KinekAkarszBefizetni}/>
      <Stack.Screen name="Tanulo_Profil" component={Tanulo_Profil}/>
    </Stack.Navigator>
  );
}

function TanuloPenzugyStack(){
  return(
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="AutosiskolanakAkarokFizetni" options={{title:"Befizetés az autósiskola számára"}} component={AutosiskolanakAkarokFizetni}/>
      <Stack.Screen name="OktatonakAkarokFizetni" options={{title:"Befizetés az oktató számára"}} component={OktatonakAkarokFizetni}/>
      <Stack.Screen name="Tanulo_Befizetesek" options={{title:"Fizetési előzmények"}} component={Tanulo_Befizetesek}/>
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
        <Stack.Screen name="Bejelentkezes"  component={LoginScreen} options={{gestureEnabled: false}}/>
        <Stack.Screen name="Regisztracio" component={Regisztracio} options={{gestureEnabled: false}}/>
        <Stack.Screen name="Tanulo_BejelentkezesUtan" component={Tanulo_BejelentkezesUtan}/>
        <Stack.Screen name="Oktato_BejelentkezesUtan2" component={Oktato_BejelentkezesUtan2}/>
        <Stack.Screen name="Tanuló menük" component={TanuloMenusStack}/>
        <Stack.Screen name="Tanuló Profil" component={TanuloProfilStack}/>
        <Stack.Screen name="Tanuló Pénzügyek" component={TanuloPenzugyStack}/>
        <Stack.Screen name="Oktató menük" component={OktatoMenuStack}/>
        <Stack.Screen name="Oktato_TanuloReszletei" component={Oktato_TanuloReszletei}/>
        <Stack.Screen name="Oktato_OraRogzites" component={Oktato_OraRogzites} />
        <Stack.Screen name="Oktato_Kezdolap" component={Oktato_Kezdolap} />
        <Stack.Screen name="Oktato_AktualisTanulok" component={Oktato_AktualisTanulok} />
        <Stack.Screen name="Oktato_LevizsgazottTanulok" component={Oktato_LevizsgazottTanulok} />
        <Stack.Screen name="Oktato_TanuloAOrak" component={Oktato_TanuloAOrak} />
        <Stack.Screen name="Oktato_TanuloLOrak" component={Oktato_TanuloLOrak} />
        <Stack.Screen name="Oktato_MegerositesrevaroOrak" component={Oktato_MegerositesrevaroOrak} />
        <Stack.Screen name="Oktato_MegerositOra" component={Oktato_MegerositOra} />
        <Stack.Screen name="Oktato_BefizetesRogzites" component={Oktato_BefizetesRogzites} />
        <Stack.Screen name="Oktato_ATBefizetesek" component={Oktato_ATBefizetesek} />
        <Stack.Screen name="Oktato_LTBefizetesek" component={Oktato_LTBefizetesek} />
        <Stack.Screen name="Oktato_MegerositBefizetes" component={Oktato_MegerositBefizetes} />
        <Stack.Screen name="Oktato_MegerositesrevaroFizetes" component={Oktato_MegerositesrevaroFizetes} />
        <Stack.Screen name="Oktato_TanuloABefizetesek" component={Oktato_TanuloABefizetesek} />
        <Stack.Screen name="Oktato_TanuloLBefizetesek" component={Oktato_TanuloLBefizetesek} />
        <Stack.Screen name="Oktato_KovetkezoOra" component={Oktato_KovetkezoOra} />
        <Stack.Screen name="Oktato_AKTUALIS" component={Oktato_AKTUALIS} />
        <Stack.Screen name="Oktato_LEVIZSGAZOTT" component={Oktato_LEVIZSGAZOTT} />
        <Stack.Screen name="Oktato_LevizsgazottTanuloReszletei" component={Oktato_LevizsgazottTanuloReszletei} />
        <Stack.Screen name="Oktato_ElkovetkezendoOrak" component={Oktato_ElkovetkezendoOrak} />
        <Stack.Screen name="Oktato_OraSzerkesztes" component={Oktato_OraSzerkesztes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}