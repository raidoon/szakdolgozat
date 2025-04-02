import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator,
  Pressable
} from "react-native";
import { useNavigation } from '@react-navigation/native';
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
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [confirmAlertVisible, setConfirmAlertVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmData, setConfirmData] = useState(null);
    const navigation = useNavigation();

    const CustomAlert = ({ visible, title, message, type, onClose, onConfirm }) => {
        if (!visible) return null;
    
        const alertStyles = {
            success: {
                backgroundColor: '#4CAF50',
                icon: 'checkmark-circle',
                iconColor: '#fff',
                buttonLayout: 'center'
            },
            error: {
                backgroundColor: '#f44336',
                icon: 'alert-circle',
                iconColor: '#fff',
                buttonLayout: 'center'
            },
            confirm: {
                backgroundColor: '#FFA000',
                icon: 'help-circle',
                iconColor: '#fff',
                buttonLayout: 'row'
            }
        };
    
        const currentStyle = alertStyles[type] || alertStyles.error;

        

        return (
            <Modal
                transparent={true}
                animationType="fade"
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.alertOverlay}>
                    <View style={[styles.alertContainer, { backgroundColor: currentStyle.backgroundColor }]}>
                        <Ionicons 
                            name={currentStyle.icon} 
                            size={36} 
                            color={currentStyle.iconColor} 
                            style={styles.alertIcon}
                        />
                        <Text style={styles.alertTitle}>{title}</Text>
                        <Text style={styles.alertMessage}>{message}</Text>
                        <View style={[
                            styles.alertButtonContainer, 
                            { flexDirection: currentStyle.buttonLayout === 'center' ? 'column' : 'row' }
                        ]}>
                            {type === 'confirm' && (
                                <Pressable
                                    style={[styles.alertButton, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.alertButtonText}>Mégsem</Text>
                                </Pressable>
                            )}
                            <Pressable
                                style={[
                                    styles.alertButton, 
                                    type === 'confirm' ? styles.confirmButton : styles.singleButton
                                ]}
                                onPress={type === 'confirm' ? onConfirm : onClose}
                            >
                                <Text style={styles.alertButtonText}>OK</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const showAlert = (title, message, type) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const showConfirmAlert = (title, message, action, data) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType('confirm');
        setConfirmAction(() => action);
        setConfirmData(data);
        setConfirmAlertVisible(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction(confirmData);
        }
        setConfirmAlertVisible(false);
    };

    const hideAlert = () => {
        setAlertVisible(false);
        if (alertType === 'success') {
            letoltes();
        }
    };

    const hideConfirmAlert = () => {
        setConfirmAlertVisible(false);
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Órák jóváhagyása",
            headerShown: true,
            headerStyle: { backgroundColor: '#1e90ff' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
        });

        letoltes();
        frissitOraAllapot();
    }, [navigation]);

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
            showAlert("Hiba", "Nem sikerült az adatok letöltése.", "error");
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
            showAlert("Hiba", "Nem sikerült frissíteni az óra állapotát.", "error");
        }
    };

    const confirmTorles = (ora_id) => {
        showConfirmAlert(
            "Óra törlése",
            "Biztosan törölni szeretnéd ezt az órát?",
            torolOra,
            ora_id
        );
    };

    const torolOra = async (ora_id) => {
        try {
            const response = await fetch(`${Ipcim.Ipcim}/oraTorles`, {
                method: "DELETE",
                body: JSON.stringify({ ora_id: ora_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (!response.ok) throw new Error(`Hiba: ${response.statusText}`);
            const data = await response.json();
            showAlert("Siker", data.message, "success");
        } catch (error) {
            console.error("Hiba:", error);
            showAlert("Hiba", "Nem sikerült törölni az órát.", "error");
        }
    };

    const confirmTeljesitOra = (ora_id) => {
        showConfirmAlert(
            "Óra teljesítése",
            "Biztosan jóváhagyod ezt az órát?",
            teljesitOra,
            ora_id
        );
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
            showAlert("Siker", data.message, "success");
        } catch (error) {
            console.error("Hiba:", error);
            showAlert("Hiba", "Nem sikerült frissíteni az órát.", "error");
        }
    };

    if (isLoading) {
        return (
            <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
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
            case 0: return '#FFA000';
            case 1: return '#4CAF50';
            case 2: return '#2196F3';
            default: return '#9E9E9E';
        }
    };

    return (
        <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.container}>
            <FlatList
                data={adatok}
                keyExtractor={(item) => item.ora_id.toString()}
                ListHeaderComponent={() => (
                    <View style={styles.headerContainer}>
                        <Text style={styles.studentName}>{tanulo.tanulo_neve}</Text>
                        <Text style={styles.subHeader}>Óraállapotok kezelése</Text>
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
                            <Ionicons name="book-outline" size={18} color="#fff" />
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
                                        onPress={() => confirmTeljesitOra(item.ora_id)}
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
                        <Ionicons name="calendar-outline" size={48} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.emptyText}>Nincs rögzített óra</Text>
                    </View>
                }
            />

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                type={alertType}
                onClose={hideAlert}
            />

            <CustomAlert
                visible={confirmAlertVisible}
                title={alertTitle}
                message={alertMessage}
                type="confirm"
                onClose={hideConfirmAlert}
                onConfirm={handleConfirm}
            />
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
        alignItems: 'center'
    },
    studentName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    lessonDate: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
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
        color: "#fff",
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
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    deleteButton: {
        backgroundColor: "rgba(244, 67, 54, 0.7)",
    },
    completeButton: {
        backgroundColor: "rgba(76, 175, 80, 0.7)",
    },
    rejectButton: {
        backgroundColor: "rgba(255, 160, 0, 0.7)",
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
        color: "rgba(255,255,255,0.8)",
        marginTop: 16,
        textAlign: "center",
    },
    // Alert styles
    alertOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    alertContainer: {
        width: "80%",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    alertIcon: {
        marginBottom: 16,
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
        textAlign: "center",
    },
    alertMessage: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 24,
        textAlign: "center",
    },
    confirmButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    alertButton: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        elevation: 2,
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: "#b0bec5",
    },
    confirmButton: {
        backgroundColor: "#4CAF50",
    },
    alertButtonText: {
        color: "#1e90ff",
        fontSize: 16,
        fontWeight: "600",
    },
    alertButtonContainer: {
        width: '100%',
        justifyContent: 'space-between',
    },
    singleButton: {
        alignSelf: 'center',
        width: '25%',
    },
});