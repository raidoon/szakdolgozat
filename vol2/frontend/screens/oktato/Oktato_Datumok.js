import { useState,useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";


export default function Oktato_Datumok({atkuld}){
  const [adatok,setAdatok]=useState([])
  const navigation = useNavigation();
  console.log(atkuld)

  const letoltes=async ()=>{
      //alert("hello")
     alert(atkuld.oktato_id)
      var adat={
          "oktatoid":atkuld.oktato_id
      }
      const x=await fetch(Ipcim.Ipcim +"/oraRogzites/aktualisDiakok",{
          method: "POST",
          body: JSON.stringify(adat),
          headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      
      console.log(x)
      const y=await x.json() 
      
      setAdatok(y)
      alert(JSON.stringify(y))
      console.log(y)
      

  }

  useEffect(()=>{
      letoltes()
      
  },[])
  const katt = (tanulo) => {
      
      navigation.navigate("Oktato_OraRogzites", { tanulo });
  };

  const kattaktual = (tanulo) => {
      
    navigation.navigate("Oktato_AktualisTanulok", { tanulo });
};
  
  
  return (
    <View style={Oktato_Styles.diakok_container}>
      <Text style={Oktato_Styles.title}>Időpontok lap</Text>
      <FlatList
        data={adatok}
        
      />
      
      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_OraRogzites", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Új óra hozzáadása</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_AktualisTanulok", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Aktuális Tanulók</Text>
      </TouchableOpacity>
    </View>
  );
}
