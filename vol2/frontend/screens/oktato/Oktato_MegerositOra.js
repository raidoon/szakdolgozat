import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositOra({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);

    // Adatok letöltése
    const letoltes = async () => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/diakokOrai", {
                method: "POST",
                body: JSON.stringify({ tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!response.ok) throw new Error(`Hiba: ${response.statusText}`);
            const data = await response.json();
            setAdatok(data);
        } catch (error) {
            console.error("Hiba:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    };

    useEffect(() => {
        letoltes();
    }, []);

     // Óra módosul
     const modosulOra = async (ora_id) => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/oraModosithato", {
                method: "PUT",
                body: JSON.stringify({ ora_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                letoltes();
            } else {
                alert(`Hiba: ${data.message}`);
            }
        } catch (error) {
            console.error("Hiba:", error);
            alert("Hiba.");
        }
    };

    // Óra teljesített
    const teljesulOra = async (ora_id) => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/oraTeljesitett", {
                method: "PUT",
                body: JSON.stringify({ ora_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                letoltes();
            } else {
                alert(`Hiba: ${data.message}`);
            }
        } catch (error) {
            console.error("Hiba:", error);
            alert("Hiba.");
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const most = new Date();
            setAdatok(prevAdatok => prevAdatok.map(item => {
                const oraDatuma = new Date(item.ora_datuma);
                const haromNap = new Date(oraDatuma).setDate(oraDatuma.getDate() + 3);

                // Állapot frissítése
                if (oraDatuma < most && item.ora_allapot === 0) {
                    modosulOra(item.ora_id); // Itt volt a hiba, meghívásra kellett
                }
                if (most > haromNap && item.ora_allapot === 2) {
                    teljesulOra(item.ora_id); // Itt is meghívásra van szükség
                }

                return item;
            }));
        }, 1000);

        return () => clearInterval(intervalId);  // Tisztítás
    }, [adatok]);

    // Óra törlés
    const torolOra = async (ora_id) => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/oraTorles", {
                method: "DELETE",
                body: JSON.stringify({ ora_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                letoltes();
            } else {
                alert(`Hiba: ${data.message}`);
            }
        } catch (error) {
            console.error("Hiba:", error);
            alert("Nem sikerült törölni az órát.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Részletek</Text>
            <Text>{tanulo.tanulo_neve}</Text>
            <FlatList
                data={adatok}
                keyExtractor={item => item.ora_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>{item.ora_datuma.split("T")[0]}</Text>
                        <Text>{item.ora_datuma.split("T")[1].split(".")[0]}</Text>
                        <Text>Állapot: {item.ora_allapot === 0 ? "Függőben" : item.ora_allapot === 1 ? "Teljesített" : "Módosítható"}</Text>
                        {(item.ora_allapot === 0 || item.ora_allapot === 2) && (
                            <TouchableOpacity style={styles.button} onPress={() => torolOra(item.ora_id)}>
                                <Text style={styles.buttonText}>Elutasítás</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "lightgreen", alignItems: "center", justifyContent: "center", padding: 20 },
    header: { fontSize: 30, fontWeight: "bold", marginBottom: 10 },
    card: { backgroundColor: "#fff", padding: 10, marginVertical: 5, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    button: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 10 },
    buttonText: { color: "#fff", fontWeight: "bold" }
});
