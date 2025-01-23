import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Styles from "../../Styles";
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";

export default function Oktato_Diakok({ atkuld }) {
    const [adatok, setAdatok] = useState([]);
    const navigation = useNavigation();
    console.log(atkuld);

    const letoltes = async () => {
        try {
            const adat = {
                oktato_id: atkuld.oktato_id,
            }
            console.log("API hívás indítása...");
            console.log("Elküldött adat:", JSON.stringify({ "oktatoid": atkuld.oktato_id }));

            const response = await fetch(Ipcim.Ipcim + "/egyOktatoDiakjai", {
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

        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése. Ellenőrizd az API-t.");
        }
    }

    useEffect(() => {
        letoltes();
    }, []); // Az üres tömb biztosítja, hogy csak egyszer fusson le a letoltes()

    const katt = (tanulo) => {
        // Navigálás a "Oktato_TanuloReszletei" képernyőre
        navigation.navigate("Oktato_TanuloReszletei", { tanulo });
    };

    return (
        <View style={Oktato_Styles.diakok_container}>
            <View>
                <Text>Aktuális Diákok</Text>
            </View>

            <View>
                <Text>hello</Text>

                {/* FlatList a diákok adatainak megjelenítésére */}
                <FlatList
                    data={adatok}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.tanulo_neve}</Text>
                            <TouchableOpacity 
                                style={{ backgroundColor: "#0000ff" }} 
                                onPress={() => katt(item)}>
                                <Text style={{ color: "white" }}>Részletek</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.tanulo_id.toString()} // Típuskonverzió, ha szükséges
                />
            </View>
        </View>
    );
}
