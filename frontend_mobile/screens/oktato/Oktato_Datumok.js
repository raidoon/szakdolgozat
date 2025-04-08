import { useState,useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity,StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

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
    <LinearGradient colors={['#f8fbff', '#e6f0fa']} style={styles.background} />
    
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Időpontok</Text>
      <Text style={styles.headerSubtitle}>Válassz a műveletek közül</Text>
    </View>

    

    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("Oktato_OraRogzites", { atkuld })}
      >
        <LinearGradient
          colors={['#1976D2', '#0D47A1']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="add-circle" size={28} color="white" style={styles.cardIcon} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Új óra hozzáadása</Text>
            <Text style={styles.cardSubtitle}>Rögzítés</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("Oktato_ElkovetkezendoOrak", { atkuld })}
      >
        <LinearGradient
          colors={['#2196F3', '#1565C0']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="event" size={28} color="white" style={styles.cardIcon} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Elkövetkező órák</Text>
            <Text style={styles.cardSubtitle}>Megtekintés</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
      >
        <LinearGradient
          colors={['#64B5F6', '#1E88E5']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="update" size={28} color="white" style={styles.cardIcon} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Diákok órái</Text>
            <Text style={styles.cardSubtitle}>Órák kezelése</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
},
background: {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
},
header: {
  paddingTop:60,
  padding: 24,
  backgroundColor: 'white',
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
  marginBottom: 16,
},
headerTitle: {
  fontSize: 26,
  fontWeight: 'bold',
  color: "#0D47A1", // Dark blue
  textAlign: 'center',
},
headerSubtitle: {
  fontSize: 18,
  color: "#546E7A", // Blue-gray
  textAlign: 'center',
  marginTop: 4,
},
actionContainer: {
  paddingHorizontal: 16,
  marginTop: 150, // Közelebb a fejléc aljához
},
actionCard: {
  borderRadius: 12,
  marginBottom: 22, // Kisebb távolság a gombok között
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
  overflow: 'hidden',
},
cardGradient: {
  padding: 20,
  flexDirection: 'row',
  alignItems: 'center',
},
cardIcon: {
  marginRight: 16,
  opacity: 0.8,
},
cardTextContainer: {
  flex: 1,
},
cardTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: 'white',
},
cardSubtitle: {
  fontSize: 18,
  color: 'rgba(255,255,255,0.8)',
  marginTop: 4,
},
});
