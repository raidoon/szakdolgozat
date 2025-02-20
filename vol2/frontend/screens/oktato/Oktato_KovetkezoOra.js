import { useState,useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales['hu'] = {
    monthNames: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
    dayNames: ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'],
    dayNamesShort: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
    today: 'Ma'
};
LocaleConfig.defaultLocale = 'hu';

export default function Oktato_KovetkezoOra({route}) {
    const { atkuld } = route.params;
  const [adatok,setAdatok]=useState([])
  const [kovetkezoOra, setKovetkezoOra] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const navigation = useNavigation();
  console.log(atkuld)

  const letoltes=async ()=>{
      
     
      var adat={
          "oktatoid":atkuld.oktato_id
      }
      const x=await fetch(Ipcim.Ipcim +"/egyOktatoAdatai",{
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


  const kovetkezoOraLetoltes = async () => {
    try {
        const response = await fetch(Ipcim.Ipcim + "/koviOra", {
            method: "POST",
            body: JSON.stringify({ oktato_id: atkuld.oktato_id }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
        const data = await response.json();
        if (data.length > 0) {
            setKovetkezoOra(data[0]);
        }
    } catch (error) {
        console.error("Hiba a következő óra letöltése során:", error);
    }
};

  useEffect(()=>{
      letoltes()
      kovetkezoOraLetoltes()
  },[])

  return(
  <View style={Oktato_Styles.reszletek_container}>
  <View>
  
  
  {kovetkezoOra && (
                <Text>
  Következő óra: {
    new Date(new Date(kovetkezoOra.ora_datuma).setDate(new Date(kovetkezoOra.ora_datuma).getDate() + 1))
      .toISOString()
      .split("T")[0]
  } - {kovetkezoOra.tanulo_neve}
</Text>

            )}
  
  </View>

  <View>
  <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: "blue" },
                }}
                theme={{
                    selectedDayBackgroundColor: "blue",
                    todayTextColor: "red",
                    arrowColor: "blue",
                }}
            />

            {selectedDate ? (
                <Text style={styles.selectedText}>Kiválasztott dátum: {selectedDate}</Text>
            ) : null}
  </View>
</View>
);
}

const styles = StyleSheet.create({
    selectedText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
});
