import { useState,useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity,StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";


export default function Oktato_Datumok({atkuld}){
  const [adatok,setAdatok]=useState([])
  const navigation = useNavigation();
  console.log(atkuld)

  const letoltes=async ()=>{
      //alert("hello")
     //alert(atkuld.oktato_id)
      var adat={
          "oktatoid":atkuld.oktato_id
      }
      const x=await fetch(Ipcim.Ipcim +"/oraFelvitel/aktualisDiakok/nemkeszOrak/elkoviOrak",{
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
  
const kattkoviorak = (tanulo) => {
      
  navigation.navigate("Oktato_ElkovetkezendoOrak", { tanulo });
};


const kattvaro = (tanulo) => {
      
  navigation.navigate("Oktato_MegerositesrevaroOrak", { tanulo });
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
        onPress={() => navigation.navigate("Oktato_ElkovetkezendoOrak", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Elkövetkező órák</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_AktualisTanulok", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Teljesített Órák</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={Oktato_Styles.navigateButton}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
      >
        <Text style={Oktato_Styles.navigateButtonText}>Módosítható órák</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    flex: 1,
  marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  itemSubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FF6F61",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
