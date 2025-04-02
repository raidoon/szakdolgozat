import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  Modal,
  Pressable
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../../Ipcim";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Oktato_TanuloABefizetesek({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [confirmAlertVisible, setConfirmAlertVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmData, setConfirmData] = useState(null);

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
                                    type === 'confirm' ? styles.cButton : styles.singleButton
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
            title: "Befizetések",
            headerShown: true,
            headerStyle: { backgroundColor: '#1e90ff' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
        });

        letoltes();
    }, [navigation]);

    const letoltes = async () => {
        setLoading(true);
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };

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
            const rendezettAdatok = data.sort((a, b) => new Date(b.befizetesek_ideje) - new Date(a.befizetesek_ideje));
            setAdatok(rendezettAdatok);
            
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            showAlert("Hiba az adatbetöltéskor", "Nem sikerült az adatok letöltése. Kérjük, próbálja újra később.", "error");
        } finally {
            setLoading(false);
        }
    };

    const megerositVagyVissza = (befizetesek_id) => {
        showConfirmAlert(
            "Befizetés jóváhagyása",
            "Biztosan jóváhagyja ezt a befizetést?",
            megerositFiz,
            befizetesek_id
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

            setAdatok(prevAdatok =>
                prevAdatok.map(befizetesek =>
                    befizetesek.befizetesek_id === befizetesek_id 
                        ? { ...befizetesek, befizetesek_jovahagyva: 1 } 
                        : befizetesek
                )
            );
            
            showAlert("Sikeres művelet", "A befizetés sikeresen jóváhagyva!", "success");
        } catch (error) {
            console.error("Hiba történt:", error);
            showAlert("Hiba történt", "Nem sikerült a befizetés állapotának frissítése.", "error");
        }
    };

    const idoFormazas = (timeString) => {
        const [hours, minutes] = timeString.split("T")[1].split(":");
        const adjustedHours = (parseInt(hours) + 1) % 24;
        return `${String(adjustedHours).padStart(2, '0')}:${minutes}`;
    };

    const statusz = (status) => {
        switch(status) {
            case 0: return { backgroundColor: '#FFA000', text: 'Függőben' };
            case 1: return { backgroundColor: '#4CAF50', text: 'Megerősítve' };
            case 2: return { backgroundColor: '#F44336', text: 'Elutasítva' };
            default: return { backgroundColor: '#9E9E9E', text: 'Ismeretlen' };
        }
    };

    return (
        <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{tanulo.tanulo_neve}</Text>
                    <Text style={styles.subtitle}>Befizetési előzmények</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : adatok.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={48} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.emptyText}>Nincsenek befizetések</Text>
                    </View>
                ) : (
                    <FlatList
                        data={adatok}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.date}>{item.befizetesek_ideje.split("T")[0]}</Text>
                                    <View style={[
                                        styles.statusBadge, 
                                        { backgroundColor: statusz(item.befizetesek_jovahagyva).backgroundColor }
                                    ]}>
                                        <Text style={styles.statusText}>
                                            {statusz(item.befizetesek_jovahagyva).text}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <Ionicons name="time-outline" size={18} color="#fff" />
                                    <Text style={styles.detailText}>{idoFormazas(item.befizetesek_ideje)}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Ionicons name="cash-outline" size={18} color="#fff" />
                                    <Text style={styles.detailText}>{item.befizetesek_osszeg} Ft</Text>
                                </View>

                                {item.befizetesek_kinek !== 1 && (
                                    <View style={styles.schoolPaymentContainer}>
                                        <Ionicons name="business-outline" size={18} color="#fff" />
                                        <Text style={styles.schoolPaymentText}>Autósiskolának fizetve</Text>
                                    </View>
                                )}

                                {!item.befizetesek_jovahagyva && item.befizetesek_kinek === 1 && (
                                    <TouchableOpacity 
                                        style={styles.confirmButton}
                                        onPress={() => megerositVagyVissza(item.befizetesek_id)}
                                    >
                                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                                        <Text style={styles.confirmButtonText}> Megerősítés</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        keyExtractor={item => item.befizetesek_id.toString()} 
                    />
                )}
            </ScrollView>

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
    content: {
        padding: 20,
        flexGrow: 1,
    },
    header: {
        marginBottom: 25,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    date: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 15,
        color: '#fff',
        marginLeft: 8,
    },
    schoolPaymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    schoolPaymentText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginLeft: 8,
        fontStyle: 'italic',
    },
    confirmButton: {
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 16,
        textAlign: 'center',
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
    cButton: {
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