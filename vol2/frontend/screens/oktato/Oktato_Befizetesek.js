import { useState,useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";

export default function Oktato_Befizetesek({atkuld}) {
  const [adatok,setAdatok]=useState([])
  const navigation = useNavigation();
  console.log(atkuld)

  const letoltes=async ()=>{
      
     alert(atkuld.oktato_id)
      var adat={
          "oktatoid":atkuld.oktato_id
      }
      const x=await fetch(Ipcim.Ipcim +"/",{
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
      
      navigation.navigate("Oktato_BefizetesRogzites", { tanulo });
  };

  const kattaktual = (tanulo) => {
      
    navigation.navigate("Oktato_ATBefizetesek", { tanulo });
};


const kattmaradek = (tanulo) => {
      
  navigation.navigate("Oktato_MegerositesrevaroFizetes", { tanulo });
};
 ;
  return (
    <View style={Oktato_Styles.diakok_container}>
      <Text style={Oktato_Styles.title}>Befizetések lap</Text>
      <FlatList
        data={adatok}
        
      />
      
      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_BefizetesRogzites", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Új befizetés hozzáadása</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_ATBefizetesek", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Diákok Befizui</Text>
      </TouchableOpacity>

    
      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroFizetes", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Megerősítésre váró</Text>
      </TouchableOpacity>
    </View>
  );
}

  

const styles = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  felsorolas: {
    margin: 30,
  },
});
