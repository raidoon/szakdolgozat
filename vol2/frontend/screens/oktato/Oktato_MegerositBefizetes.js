import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositBefizetes({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    

    const letoltes = async () => {
        try {
            const adat = {
                tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID,
            }

            console.log("Elküldött adat:", JSON.stringify({ "felhasznalo_ID": tanulo.tanulo_felhasznaloID }));

            const response = await fetch(Ipcim.Ipcim + "/egyDiakNemKeszBefizetesei", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            console.log("API válasz:", response);

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            //alert(JSON.stringify(data))
            setAdatok(data);
           
            

           /* // Ha van adat, az első órát beállítjuk
            if (Array.isArray(data) && data.length > 0) {
                const elsoOra = data[0];
                console.log("Első óra adat:", elsoOra);}
*/
               
            
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    }

    useEffect(() => {
        letoltes();
    }, []);

    /*const megerositVagyVissza=(id)=>{
        
        let uj=[...adatTomb]
        for (elem of uj){
          if (elem.id==id){
            if (elem.kesz==0)
              elem.kesz=1
            else
              elem.kesz=0
          }
        }
        setAdatTomb(uj)
        storeData(uj)
      }
*/
    return (
        <View style={stilus.elso}>
            <View>
                <Text style={stilus.szoveg}>Részletek</Text>
                <Text>{tanulo.tanulo_neve}</Text>
                
                <FlatList
                    data={adatok}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.befizetesek_ideje.split("T")[0]}</Text>
                            <Text>{item.befizetesek_ideje.split("T")[1].split(".")[0]}</Text>
                            <Text>{item.befizetesek_jovahagyva}</Text>
                            {item.befizetesek_jovahagyva==0
                            ?
                            <TouchableOpacity 
                                style={{ backgroundColor: "#fff" }} 
                               /* onPress={() => megerositVagyVissza(item)}*/>
                                <Text style={{ color: "red" }}>Megerősítés</Text>
                            </TouchableOpacity> 
                            : <Text>Teljesítve</Text>
                            }
                            
                           

                        </View>
                    )}
                    keyExtractor={item => item.ora_id} 
                />


              
                
            </View>
        </View>
    );
}

const stilus = StyleSheet.create({
    elso: {
        flex: 1,
        backgroundColor: 'lightgreen',
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        
    },
    szoveg: {
        fontSize: 50,
        fontStyle: "italic",
    },
});
