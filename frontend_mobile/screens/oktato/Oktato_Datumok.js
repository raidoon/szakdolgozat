import { useState,useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity,StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";


export default function Oktato_Datumok({atkuld}){
  const [adatok,setAdatok]=useState([])
  const navigation = useNavigation();
  console.log(atkuld)

  const letoltes=async ()=>{
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

  const frissitOraAllapot = async () => {
          try {
              // Update lessons to "Módosítható" (2) if the date has passed
              const responseModosithato = await fetch(`${Ipcim.Ipcim}/oraFrissul`, {
                  method: "PUT",
                  headers: { "Content-type": "application/json; charset=UTF-8" }
              });
              if (!responseModosithato.ok) throw new Error(`Hiba: ${responseModosithato.statusText}`);
  
              // Update lessons to "Teljesített" (1) if 3 days have passed since the lesson date
              const responseTeljesitett = await fetch(`${Ipcim.Ipcim}/oraTeljesul`, {
                  method: "PUT",
                  headers: { "Content-type": "application/json; charset=UTF-8" }
              });
              if (!responseTeljesitett.ok) throw new Error(`Hiba: ${responseTeljesitett.statusText}`);
  
              // Refresh the data after updating
              letoltes();
          } catch (error) {
              console.error("Hiba az óra állapot frissítésében:", error);
              Alert.alert("Hiba", "Nem sikerült frissíteni az óra állapotát.");
          }
      };

  useEffect(()=>{
      letoltes()
      frissitOraAllapot();
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
    <View style={styles.container}>
    
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Időpontok</Text>
      <Text style={styles.welcomeText}>{atkuld?.oktato_neve || "Kedves Oktató"}</Text>
    </View>


    <FlatList
        data={adatok}
        
      />

   
    <View style={styles.cardsContainer}>
      <TouchableOpacity
        style={[styles.actionCard, styles.primaryCard]}
        onPress={() => navigation.navigate("Oktato_OraRogzites", { atkuld })}
      >
        <Text style={styles.cardTitle}>Új óra hozzáadása</Text>
        <Text style={styles.cardSubtitle}>Rögzítés</Text>
        <View style={styles.greenAccent} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, styles.secondaryCard]}
        onPress={() => navigation.navigate("Oktato_ElkovetkezendoOrak", { atkuld })}
      >
        <Text style={styles.cardTitle}>Elkövetkező órák</Text>
        <Text style={styles.cardSubtitle}>Megtekintés</Text>
        <View style={styles.blueAccent} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, styles.tertiaryCard]}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
      >
        <Text style={styles.cardTitle}>Módosítható órák</Text>
        <Text style={styles.cardSubtitle}>Frissítés szükséges</Text>
        <View style={styles.tealAccent} />
      </TouchableOpacity>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 20,
  backgroundColor: "#F5FBFF", // Light blue background
},
header: {
  marginBottom: 20,
  padding: 15,
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  shadowColor: "#E0F7FA",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
},
headerTitle: {
  fontSize: 24,
  fontFamily: "Inter-Bold",
  marginBottom: 8,
  textAlign: "center",
  color: "#00796B", // Dark teal/green
},
welcomeText: {
  fontSize: 16,
  fontFamily: "Inter-Medium",
  textAlign: "center",
  color: "#4CAF50", // Green color
},
cardsContainer: {
  marginBottom: 20,
},
actionCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  shadowColor: "#B2DFDB",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 2,
  position: 'relative',
  overflow: 'hidden',
},
primaryCard: {
  borderLeftWidth: 5,
  borderLeftColor: "#4CAF50", // Green
},
secondaryCard: {
  borderLeftWidth: 5,
  borderLeftColor: "#2196F3", // Blue
},
tertiaryCard: {
  borderLeftWidth: 5,
  borderLeftColor: "#00838F", // Teal
},
cardTitle: {
  fontSize: 16,
  fontFamily: "Inter-SemiBold",
  color: "#00796B", // Dark teal
  marginBottom: 4,
},
cardSubtitle: {
  fontSize: 14,
  fontFamily: "Inter-Regular",
  color: "#78909C", // Gray-blue
},
greenAccent: {
  position: 'absolute',
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  right: -15,
  top: -15,
},
blueAccent: {
  position: 'absolute',
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
  right: -15,
  top: -15,
},
tealAccent: {
  position: 'absolute',
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: 'rgba(0, 131, 143, 0.1)',
  right: -15,
  top: -15,
},
});