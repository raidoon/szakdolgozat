import { useState,useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";


export default function Oktato_Diakok({atkuld}){
  const [adatok,setAdatok]=useState([])
  const navigation = useNavigation();
  console.log(atkuld)

  const letoltes=async ()=>{
      //alert("hello")
     alert(atkuld.oktato_id)
      var adat={
          "oktatoid":atkuld.oktato_id
      }
      const x=await fetch(Ipcim.Ipcim +"/aktualisDiakok/levizsgazottDiakok",{
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
  

  const kattaktual = (tanulo) => {
      
    navigation.navigate("Oktato_AKTUALIS", { tanulo });
};
  
const kattlevi = (tanulo) => {
      
    navigation.navigate("Oktato_LEVIZSGAZOTT", { tanulo });
};

  return (
    <View style={Oktato_Styles.diakok_container}>
      <Text style={Oktato_Styles.title}>Diákok</Text>
      <FlatList
        data={adatok}
        
      />
      
     
      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_AKTUALIS", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Aktuális Tanulók</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_LEVIZSGAZOTT", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Levizsgázott Tanulók</Text>
      </TouchableOpacity>

      
    </View>
  );
}
