import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_TanuloAOrak({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [oradatuma, setDatum] = useState("");

    const letoltes = async () => {
        try {
            const adat = {
                tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID,
            }
            console.log("API hívás indítása...");
            console.log("Elküldött adat:", JSON.stringify({ "felhasznalo_ID": tanulo.tanulo_felhasznaloID }));

            const response = await fetch(Ipcim.Ipcim + "/diakokOrai", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            console.log("API válasz:", response);

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Betöltött adatok:", data);
            setAdatok(data);
            if (data.length > 0) {
                setDatum(data[0].ora_datuma); // Első óra dátumát beállítja
            }

        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    }

    useEffect(() => {
        letoltes();
    }, []);

    
    const renderOraItem = ({ item }) => (
        <View style={stilus.oraItem}>
            <Text>{item.ora_datuma}</Text>
            <Text>{item.ora_neve}</Text>
            
        </View>
    );

    return (
        <View style={stilus.elso}>
            <View>
                <Text style={stilus.szoveg}>Részletek</Text>
                <Text>{tanulo.tanulo_neve}</Text>
                <Text>{tanulo.tanulo_felhasznaloID}</Text>
                <Text>{oradatuma}</Text>
            </View>
            <FlatList
                data={adatok}
                renderItem={renderOraItem}
                keyExtractor={(item, index) => index.toString()}
            />
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
    oraItem: {
        marginVertical: 10,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    }
});
