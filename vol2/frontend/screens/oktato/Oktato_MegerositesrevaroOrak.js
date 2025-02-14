import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositesrevaroOrak({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const navigation = useNavigation();

    console.log(atkuld);

    const letoltes = async () => {
        try {
            const adat = {
                oktato_id: atkuld.oktato_id,
            };

            console.log("Elküldött adat:", JSON.stringify({ "oktato_id": atkuld.oktato_id }));

            const response = await fetch(Ipcim.Ipcim + "/nemkeszOrak", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            console.log("API válasz:", response);

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            setAdatok(data);
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése. Ellenőrizd az API-t.");
        }
    };

    useEffect(() => {
        letoltes();
    }, []);

    const katt = (tanulo) => {
        navigation.navigate("Oktato_MegerositOra", { tanulo });
    };

    return (
        <View style={Oktato_Styles.diakok_container}>
            <View>
                <Text style={Oktato_Styles.focim}>Megerősítésre váró órák</Text>
            </View>

            <View>
                {adatok.length === 0 ? (
                    <Text style={Oktato_Styles.nincsOra}>Nincs megerősítésre váró óra.</Text>
                ) : (
                    <FlatList
                        data={adatok}
                        renderItem={({ item }) => (
                            <View style={Oktato_Styles.oraKartya}>
                                <Text style={Oktato_Styles.nev}>{item.tanulo_neve}</Text>
                                <TouchableOpacity 
                                    style={Oktato_Styles.gomb} 
                                    onPress={() => katt(item)}>
                                    <Text style={Oktato_Styles.gombSzoveg}>Továbbiak</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={item => item.tanulo_id.toString()}
                    />
                )}
            </View>
        </View>
    );
}
