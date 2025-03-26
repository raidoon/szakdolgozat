import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import Ipcim from "../../../Ipcim";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

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
            const rendezettAdatok = data.sort((a, b) => new Date(b.ora_datuma) - new Date(a.ora_datuma));
            setAdatok(rendezettAdatok);
            if (data.length > 0) {
                setTipus(data[0].oratipus_neve);
            }
        } catch (error) {
            console.error("Hiba:", error);
            Alert.alert("Hiba", "Nem sikerült az adatok letöltése.");
        } finally {
            setIsLoading(false);
        }
    };

    const frissitOraAllapot = async () => {
        try {
            const responseModosithato = await fetch(`${Ipcim.Ipcim}/oraFrissul`, {
                method: "PUT",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!responseModosithato.ok) throw new Error(`Hiba: ${responseModosithato.statusText}`);

            const responseTeljesitett = await fetch(`${Ipcim.Ipcim}/oraTeljesul`, {
                method: "PUT",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!responseTeljesitett.ok) throw new Error(`Hiba: ${responseTeljesitett.statusText}`);

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
            letoltes();
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
            letoltes();
        } catch (error) {
            console.error("Hiba:", error);
            Alert.alert("Hiba", "Nem sikerült frissíteni az órát.");
        }
    };

    if (isLoading) {
        return (
            <LinearGradient colors={['#E3F2FD', '#E8F5E9']} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4a90e2" />
            </LinearGradient>
        );
    }

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 0: return '#FFA000'; // Pending - amber
            case 1: return '#4CAF50'; // Completed - green
            case 2: return '#2196F3'; // Modifiable - blue
            default: return '#9E9E9E';
        }
    };

    return (
        <LinearGradient colors={['#E3F2FD', '#E8F5E9']} style={styles.container}>
            <FlatList
                data={adatok}
                keyExtractor={(item) => item.ora_id.toString()}
                ListHeaderComponent={() => (
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Óra állapotok</Text>
                        <Text style={styles.studentName}>{tanulo.tanulo_neve}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.lessonDate}>{formatDateTime(item.ora_datuma)}</Text>
                            <View style={[styles.statusPill, {backgroundColor: getStatusColor(item.ora_teljesitve)}]}>
                                <Text style={styles.statusText}>
                                    {item.ora_teljesitve === 0
                                        ? "Függőben"
                                        : item.ora_teljesitve === 1
                                        ? "Teljesített"
                                        : "Módosítható"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Ionicons name="book-outline" size={18} color="#4a90e2" />
                            <Text style={styles.infoText}>{item.oratipus_neve}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            {item.ora_teljesitve === 0 && (
                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => confirmTorles(item.ora_id)}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#fff" />
                                    <Text style={styles.buttonText}> Törlés</Text>
                                </TouchableOpacity>
                            )}
                            {item.ora_teljesitve === 2 && (
                                <>
                                    <TouchableOpacity
                                        style={[styles.button, styles.completeButton]}
                                        onPress={() => teljesitOra(item.ora_id)}
                                    >
                                        <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                                        <Text style={styles.buttonText}> Teljesít</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.rejectButton]}
                                        onPress={() => confirmTorles(item.ora_id)}
                                    >
                                        <Ionicons name="close-circle-outline" size={18} color="#fff" />
                                        <Text style={styles.buttonText}> Elutasít</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={48} color="#bdc3c7" />
                        <Text style={styles.emptyText}>Nincs rögzített óra</Text>
                    </View>
                }
            />

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Ionicons name="warning-outline" size={48} color="#FFA000" style={styles.modalIcon} />
                        <Text style={styles.modalText}>Biztosan törölni szeretnéd az órát?</Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Mégsem</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmDeleteButton]}
                                onPress={torolOra}
                            >
                                <Text style={styles.modalButtonText}>Törlés</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerContainer: {
        padding: 20,
        paddingBottom: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: "600",
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: 5,
    },
    studentName: {
        fontSize: 18,
        color: "#4a90e2",
        textAlign: "center",
        fontWeight: "500",
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    lessonDate: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
    },
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    infoText: {
        fontSize: 15,
        color: "#34495e",
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: "#f44336",
    },
    completeButton: {
        backgroundColor: "#4CAF50",
    },
    rejectButton: {
        backgroundColor: "#FFA000",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#7f8c8d",
        marginTop: 16,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
    },
    modalIcon: {
        marginBottom: 16,
    },
    modalText: {
        fontSize: 18,
        color: "#333",
        textAlign: "center",
        marginBottom: 24,
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
        backgroundColor: "#b0bec5",
    },
    confirmDeleteButton: {
        backgroundColor: "#f44336",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
});