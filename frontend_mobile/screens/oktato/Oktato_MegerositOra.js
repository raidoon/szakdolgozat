import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ActivityIndicator } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositOra({ route }) {
    const { tanulo } = route.params;
    const [tipus, setTipus] = useState("");
    const [adatok, setAdatok] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOraId, setSelectedOraId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const letoltes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${Ipcim.Ipcim}/diakokOrai`, {
                method: "POST",
                body: JSON.stringify({ tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!response.ok) throw new Error(`Hiba: ${response.statusText}`);
            const data = await response.json();
            setAdatok(data);
            setTipus(data[0].oratipus_neve)
        } catch (error) {
            console.error("Hiba:", error);
            Alert.alert("Hiba", "Nem sikerült az adatok letöltése.");
        } finally {
            setIsLoading(false);
        }
    };

    const frissitOraAllapot = async () => {
        try {
            // Update lessons to "Módosítható" (2) if the date has passed
            const responseModosithato = await fetch(`${Ipcim.Ipcim}/oraFrissul`, {
                method: "PUT",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!responseModosithato.ok) throw new Error(`Hiba: ${responseModosithato.statusText}`);

            // Update lessons to "Teljesített" (1) if 3 days have passed since the lesson date
            const responseTeljesitett = await fetch(`${Ipcim.Ipcim}/oraTeljesul`, {
                method: "PUT",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!responseTeljesitett.ok) throw new Error(`Hiba: ${responseTeljesitett.statusText}`);

            // Refresh the data after updating
            letoltes();
        } catch (error) {
            console.error("Hiba az óra állapot frissítésében:", error);
            Alert.alert("Hiba", "Nem sikerült frissíteni az óra állapotát.");
        }
    };

    useEffect(() => {
        letoltes();
        frissitOraAllapot();
    }, []);

    const confirmTorles = (ora_id) => {
        setSelectedOraId(ora_id);
        setModalVisible(true);
    };

    const torolOra = async () => {
        try {
            const response = await fetch(`${Ipcim.Ipcim}/oraTorles`, {
                method: "DELETE",
                body: JSON.stringify({ ora_id: selectedOraId }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!response.ok) throw new Error(`Hiba: ${response.statusText}`);
            const data = await response.json();
            Alert.alert("Siker", data.message);
            letoltes(); // Refresh data after deletion
        } catch (error) {
            console.error("Hiba:", error);
            Alert.alert("Hiba", "Nem sikerült törölni az órát.");
        } finally {
            setModalVisible(false);
        }
    };

    const teljesitOra = async (ora_id) => {
        try {
            const response = await fetch(`${Ipcim.Ipcim}/oraTeljesit`, {
                method: "PUT",
                body: JSON.stringify({ ora_id: ora_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!response.ok) throw new Error(`Hiba: ${response.statusText}`);
            const data = await response.json();
            Alert.alert("Siker", data.message);
            letoltes(); // Refresh data after update
        } catch (error) {
            console.error("Hiba:", error);
            Alert.alert("Hiba", "Nem sikerült frissíteni az órát.");
        }
    };

    const modosulOra = async (ora_id) => {
        try {
            const response = await fetch(`${Ipcim.Ipcim}/oraFrissit`, {
                method: "PUT",
                body: JSON.stringify({ ora_id: ora_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!response.ok) throw new Error(`Hiba: ${response.statusText}`);
            const data = await response.json();
            Alert.alert("Siker", data.message);
            letoltes(); // Refresh data after update
        } catch (error) {
            console.error("Hiba:", error);
            Alert.alert("Hiba", "Nem sikerült frissíteni az órát.");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff8f00" />
            </View>
        );
    }

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={adatok}
                keyExtractor={(item) => item.ora_id.toString()}
                ListHeaderComponent={() => (
                    <>
                        <Text style={styles.header}>Részletek</Text>
                        <Text style={styles.studentName}>{tanulo.tanulo_neve}</Text>
                    </>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardItem}>
                            <Text style={styles.cardItemTitle}>Dátum:</Text>
                            <Text style={styles.cardItemText}>{formatDateTime(item.ora_datuma)}</Text>
                        </View>
                        <View style={styles.cardItem}>
                            <Text style={styles.cardItemTitle}>Típus:</Text>
                            <Text style={styles.cardItemText}>{item.oratipus_neve}</Text>
                        </View>
                        <View style={styles.cardItem}>
                            <Text style={styles.cardItemTitle}>Állapot:</Text>
                            <Text style={styles.cardItemText}>
                                {item.ora_teljesitve === 0
                                    ? "Függőben"
                                    : item.ora_teljesitve === 1
                                    ? "Teljesített"
                                    : "Módosítható"}
                            </Text>
                        </View>
                        {item.ora_teljesitve === 0 && (
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={() => confirmTorles(item.ora_id)}
                            >
                                <Text style={styles.buttonText}>Törlés</Text>
                            </TouchableOpacity>
                        )}
                        {item.ora_teljesitve === 2 && (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.updateButton]}
                                    onPress={() => teljesitOra(item.ora_id)}
                                >
                                    <Text style={styles.buttonText}>Teljesítetté jelöl</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.rejectButton]}
                                    onPress={() => modosulOra(item.ora_id)}
                                >
                                    <Text style={styles.buttonText}>Elutasítás</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            />

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
        backgroundColor: "#fffde7", // Light pleasant yellow background
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ff8f00", // Orange for emphasis
        marginBottom: 10,
        textAlign: "center",
    },
    studentName: {
        fontSize: 22,
        fontWeight: "500",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff3e0", // Light orange card background
        padding: 20,
        borderRadius: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    cardItemTitle: {
        fontWeight: "bold",
        color: "#333",
        fontSize: 16,
    },
    cardItemText: {
        color: "#555",
        fontSize: 16,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: "#ff5c5c", // Red for delete
    },
    updateButton: {
        backgroundColor: "#4CAF50", // Green for update
    },
    rejectButton: {
        backgroundColor: "#ff8f00", // Orange for reject
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 15,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        width: "45%",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#ccc", // Gray for cancel
    },
});