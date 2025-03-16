import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_TanuloAOrak({ route }) {
    const { tanulo } = route.params;
    const [tipus, setTipus] = useState("");
    const [adatok, setAdatok] = useState([]);
    const [loading, setLoading] = useState(true);

    const letoltes = async () => {
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };

            console.log("Elküldött adat:", JSON.stringify(adat));

            const response = await fetch(Ipcim.Ipcim + "/diakokTeljesitettOrai", {
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
            setTipus(data[0].oratipus_neve)
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

    // Sort the data by date in descending order
    const sortedAdatok = adatok
        .filter(item => item.ora_teljesitve)
        .sort((a, b) => new Date(b.ora_datuma) - new Date(a.ora_datuma));

    return (
        <View style={stilus.elso}>
            <Text style={stilus.szoveg}>Részletek</Text>
            <Text style={stilus.nev}>{tanulo.tanulo_neve}</Text>

            {loading ? (
                <Text>Betöltés...</Text>
            ) : (
                <FlatList
                    data={sortedAdatok}
                    renderItem={({ item }) => {
                        const date = new Date(item.ora_datuma);
                        const hours = date.getHours();
                        const minutes = date.getMinutes();
                        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

                        return (
                            <View style={stilus.oraKartya}>
                                <Text style={stilus.datum}>Dátum: {item.ora_datuma.split("T")[0]}</Text>
                                <Text>Pontos idő: {formattedTime}</Text>
                                <Text>Típus: {tipus}</Text>
                                <Text style={{ color: "green" }}>Teljesítve</Text>
                            </View>
                        );
                    }}
                    keyExtractor={item => item.ora_id.toString()} 
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
    }
});