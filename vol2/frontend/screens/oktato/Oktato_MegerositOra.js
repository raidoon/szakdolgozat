import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositOra({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);

    // Adatok letöltése
    const letoltes = async () => {
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };
            const response = await fetch(Ipcim.Ipcim + "/egyDiakNemKeszOrai", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!response.ok) throw new Error(`Hiba történt: ${response.statusText}`);
            const data = await response.json();
            setAdatok(data);
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    };

    useEffect(() => {
        letoltes();
    }, []);

    const frissitOra = async (ora_id) => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/oraElutasit", {
                method: "POST",
                body: JSON.stringify({ ora_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error("Nem JSON válasz érkezett!");
            }
            if (response.ok) {
                alert(data.message);
                letoltes();
            } else {
                alert(`Hiba: ${data.message}`);
            }
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az óra állapotát módosítani.");
        }
    };

    return (
        <View style={stilus.elso}>
            <Text style={stilus.szoveg}>Részletek</Text>
            <Text>{tanulo.tanulo_neve}</Text>
            <FlatList
                data={adatok}
                renderItem={({ item }) => (
                    <View style={stilus.oraKartya}>
                        <Text>{item.ora_datuma.split("T")[0]}</Text>
                        <Text>{item.ora_datuma.split("T")[1].split(".")[0]}</Text>
                        <Text>Állapot: {item.ora_teljesitve === 0 ? "Módosítható" : item.ora_teljesitve === 1 ? "Megerősítve" : "Elutasítva"}</Text>
                        {item.ora_teljesitve === 0 && (
                            <View style={stilus.gombok}>
                                {/* Csak az elutasítás gomb jelenik meg */}
                                <TouchableOpacity
                                    style={stilus.gombElutasit}
                                    onPress={() => frissitOra(item.ora_id)}>
                                    <Text style={stilus.gombSzoveg}>Elutasítás</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
                keyExtractor={item => item.ora_id.toString()}
            />
        </View>
    );
}

const stilus = StyleSheet.create({
    elso: { flex: 1, backgroundColor: "lightgreen", alignItems: "center", justifyContent: "center", padding: 20 },
    szoveg: { fontSize: 30, fontWeight: "bold", marginBottom: 10 },
    oraKartya: { backgroundColor: "#fff", padding: 10, marginVertical: 5, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    gombok: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
    gombElutasit: { backgroundColor: "red", padding: 10, borderRadius: 5 },
    gombSzoveg: { color: "#fff", fontWeight: "bold" }
});
