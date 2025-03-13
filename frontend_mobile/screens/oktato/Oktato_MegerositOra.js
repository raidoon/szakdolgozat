import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";
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
    }, []);

    // Óra törlés megerősítése
    const confirmTorles = (ora_id) => {
        setSelectedOraId(ora_id);
        setModalVisible(true);  // Megjeleníti a modális ablakot
    };

    // Óra törlés
    const torolOra = async () => {
        const ora_id = selectedOraId;
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
            setModalVisible(false);  // Bezárja a modális ablakot
        } catch (error) {
            console.error("Hiba:", error);
            alert("Nem sikerült törölni az órát.");
            setModalVisible(false);  // Bezárja a modális ablakot
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Részletek</Text>
            <Text style={styles.studentName}>{tanulo.tanulo_neve}</Text>
            <View style={{ flex: 1, width: "100%" }}>
    <FlatList
        data={adatok}
        keyExtractor={(item) => item.ora_id.toString()}
        renderItem={({ item }) => (
            <View style={styles.card}>
                <View style={styles.cardItem}>
                    <Text style={styles.cardItemTitle}>Dátum:</Text>
                    <Text>{item.ora_datuma.split("T")[0]}</Text>
                </View>
                <View style={styles.cardItem}>
                    <Text style={styles.cardItemTitle}>Időpont:</Text>
                    {/*<Text>{item.ora_datuma.split("T")[1].split(".")[0]}</Text>*/}
                </View>
                <View style={styles.cardItem}>
                    <Text style={styles.cardItemTitle}>Állapot:</Text>
                    <Text>
                        {item.ora_teljesitve === 0
                            ? "Függőben"
                            : item.ora_teljesitve === 1
                            ? "Teljesített"
                            : "Módosítható"}
                    </Text>
                </View>
                {(item.ora_teljesitve === 0 || item.ora_teljesitve === 2) && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => confirmTorles(item.ora_id)}
                    >
                        <Text style={styles.buttonText}>Elutasítás</Text>
                    </TouchableOpacity>
                )}
            </View>
        )}
    />
</View>


            {/* Custom Modal */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Biztosan törölni szeretnéd az órát?</Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Mégsem</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.deleteButton]}
                                onPress={torolOra}
                            >
                                <Text style={styles.buttonText}>Törlés</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        width: "35%"
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
    },
    
    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 20,
        alignItems: "center",
        width: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
        fontFamily: "Arial"
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        width: "48%"
    },
    cancelButton: {
        backgroundColor: "#ccc"
    },
    deleteButton: {
        backgroundColor: "#ff5c5c"
    }
});
