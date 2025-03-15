import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ActivityIndicator } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositOra({ route }) {
    const { tanulo } = route.params;
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
        letoltes()
        // Automatically update ora_teljesitve when the screen is opened
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
                <ActivityIndicator size="large" color="#0000ff" />
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
                contentContainerStyle={{ paddingBottom: 200 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardItem}>
                            <Text style={styles.cardItemTitle}>Dátum:</Text>
                            <Text>{formatDateTime(item.ora_datuma)}</Text>
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
                        {item.ora_teljesitve === 0 && (
                            <TouchableOpacity
                                style={styles.button}
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
        backgroundColor: "#f1f1f1",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
        textAlign: "center"
    },
    studentName: {
        fontSize: 22,
        fontWeight: "500",
        marginBottom: 20,
        color: "#555",
        textAlign: "center"
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
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },
    updateButton: {
        backgroundColor: "#4CAF50",
        marginTop: 10
    },
    rejectButton: {
        backgroundColor: "#ff5c5c",
        marginTop: 10
    },
    buttonText: {
        color: "#fff",
        fontSize: 16
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 20
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        width: "45%",
        alignItems: "center"
    },
    cancelButton: {
        backgroundColor: "#ccc"
    },
    deleteButton: {
        backgroundColor: "#ff5c5c"
    },
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
        textAlign: "center",
        color: "#333"
    }
});