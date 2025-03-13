import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositOra({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOraId, setSelectedOraId] = useState(null);

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
        frissitOraAllapot();
    }, []);

    // Automatikus frissítés
    const frissitOraAllapot = async () => {
        const most = new Date();
        adatok.forEach(async (ora) => {
            const oraDatum = new Date(ora.ora_datuma);
            const kulonbsegNapokban = (most - oraDatum) / (1000 * 60 * 60 * 24);
            
            if (ora.ora_allapot === 0 && kulonbsegNapokban > 0) {
                await modosulOra(ora.ora_id);
            } else if (ora.ora_allapot === 2 && kulonbsegNapokban > 3) {
                await teljesitettOra(ora.ora_id);
            }
        });
    };

    // Óra elutasítása
    const elutasitOra = async (ora_id) => {
        Alert.alert(
            "Óra elutasítása",
            "Biztosan elutasítod ezt az órát?",
            [
                { text: "Mégse", style: "cancel" },
                { text: "Igen", onPress: async () => {
                        try {
                            await fetch(Ipcim.Ipcim + "/oraTorles", {
                                method: "DELETE",
                                body: JSON.stringify({ ora_id }),
                                headers: { "Content-type": "application/json; charset=UTF-8" }
                            });
                            letoltes();
                        } catch (error) {
                            console.error("Hiba:", error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Részletek</Text>
            <Text style={styles.studentName}>{tanulo.tanulo_neve}</Text>
            <FlatList
                data={adatok}
                keyExtractor={item => item.ora_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardItem}>
                            <Text style={styles.cardItemTitle}>Dátum:</Text>
                            <Text>{item.ora_datuma.split("T")[0]}</Text>
                        </View>
                        <View style={styles.cardItem}>
                            <Text style={styles.cardItemTitle}>Időpont:</Text>
                            <Text>{item.ora_datuma.split("T")[1].split(".")[0]}</Text>
                        </View>
                        <View style={styles.cardItem}>
                            <Text style={styles.cardItemTitle}>Állapot:</Text>
                            <Text>
                                {item.ora_allapot === 0
                                    ? "Függőben"
                                    : item.ora_allapot === 1
                                    ? "Teljesített"
                                    : "Módosítható"}
                            </Text>
                        </View>
                        {(item.ora_allapot === 0 || item.ora_allapot === 2) && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => elutasitOra(item.ora_id)}
                            >
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
    container: {
        flex: 1,
        backgroundColor: "#f1f1f1",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
        fontFamily: "Arial"
    },
    studentName: {
        fontSize: 22,
        fontWeight: "500",
        marginBottom: 20,
        color: "#555",
        fontFamily: "Arial"
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: "90%"
    },
    cardItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5
    },
    cardItemTitle: {
        fontWeight: "bold",
        color: "#333",
        fontSize: 16,
        width: "40%"
    },
    button: {
        backgroundColor: "#ff5c5c",
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        width: "100%",
        alignItems: "center"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    }
});