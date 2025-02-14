import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_TanuloABefizetesek({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [loading, setLoading] = useState(true);

    const letoltes = async () => {
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };

            console.log("Elküldött adat:", JSON.stringify(adat));

            const response = await fetch(Ipcim.Ipcim + "/diakokBefizetesei", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Hiba történt: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();
            setAdatok(data);
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        letoltes();
    }, []);

    const megerositVagyVissza = (befizetesek_id) => {
        Alert.alert(
            "Megerősítés", 
            "Biztos meg akarod erősíteni?", 
            [
                {
                    
                    text: "Igen", 
                    onPress: () => megerositFiz(befizetesek_id) 
                },
                { 
                    text: "Mégse",
                    style: "cancel"
                }
            ]
        );
    };

    const megerositFiz = async (befizetesek_id) => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/fizetesMegerosit", {
                method: "POST",
                body: JSON.stringify({ befizetesek_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) {
                throw new Error("Nem sikerült frissíteni az állapotot");
            }

            // Állapot frissítése a kliensoldalon
            setAdatok(prevAdatok =>
                prevAdatok.map(befizetesek =>
                    befizetesek.befizetesek_id === befizetesek ? { ...befizetesek, befizetesek_jovahagyva: 1 } : befizetesek
                )
            );
        } catch (error) {
            console.error("Hiba történt:", error);
            alert("Nem sikerült a befizetés állapotának frissítése.");
        }
    };

    return (
        <View style={stilus.elso}>
            <Text style={stilus.szoveg}>Részletek</Text>
            <Text style={stilus.nev}>{tanulo.tanulo_neve}</Text>

            {loading ? (
                <Text>Betöltés...</Text>
            ) : (
                <FlatList
                    data={adatok}
                    renderItem={({ item }) => (
                        <View style={stilus.oraKartya}>
                            <Text style={stilus.datum}>{item.befizetesek_ideje.split("T")[0]}</Text>
                            <Text>{item.befizetesek_ideje.split("T")[1].split(".")[0]}</Text>
                            <Text style={{ color: item.befizetesek_jovahagyva ? "green" : "red" }}>
                                {item.befizetesek_jovahagyva ? "Teljesítve" : "Nincs teljesítve"}
                            </Text>
                            {!item.befizetesek_jovahagyva && (
                                <TouchableOpacity 
                                    style={stilus.gomb} 
                                    onPress={() => megerositVagyVissza(item.befizetesek_id)}
                                >
                                    <Text style={stilus.gombSzoveg}>Megerősítés</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    keyExtractor={item => item.befizetesek_id.toString()} 
                />
            )}
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
    nev: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    oraKartya: {
        backgroundColor: "#f9f9f9",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        width: 300,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    datum: {
        fontWeight: "bold",
        fontSize: 16,
    },
    gomb: {
        marginTop: 10,
        backgroundColor: "#007bff",
        padding: 8,
        borderRadius: 5,
    },
    gombSzoveg: {
        color: "#fff",
        fontWeight: "bold",
    },
});
