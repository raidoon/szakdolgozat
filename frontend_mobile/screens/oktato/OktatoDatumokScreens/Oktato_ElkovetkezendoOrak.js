import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ipcim from "../../../Ipcim";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Oktato_ElkovetkezendoOrak({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [tipus, setTipus] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        frissitOraAllapot();
        letoltes();
    }, []);

    const letoltes = async () => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/elkoviOrak", {
                method: "POST",
                body: JSON.stringify({ oktato_id: atkuld.oktato_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.status}`);
            }

            const data = await response.json();
            const rendezettAdatok = data.sort((a, b) => new Date(a.ora_datuma) - new Date(b.ora_datuma));
            setAdatok(rendezettAdatok);

            if (data.length > 0) {
                setTipus(data[0].oratipus_neve);
            }
        } catch (error) {
            console.error("Hiba az adatok letöltésekor:", error);
            alert("Nem sikerült az adatok letöltése.");
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
            alert("Hiba", "Nem sikerült frissíteni az óra állapotát.");
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    return (
        <LinearGradient colors={['#f5fcff', '#e6f7ed']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Elkövetkező órák</Text>

                <FlatList
                    data={adatok}
                    keyExtractor={(item) => item.ora_id.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.dateHeader}>
                                <Text style={styles.lessonDate}>
                                    {formatDateTime(item.ora_datuma)}
                                </Text>
                                <View style={styles.typePill}>
                                    <Text style={styles.typeText}>{item.oratipus_neve}</Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="person-outline" size={18} color="#4a90e2" />
                                <Text style={styles.infoText}>Diák: {item.tanulo_neve}</Text>
                            </View>
                            
                            <View style={styles.infoItem}>
                                <Ionicons name="location-outline" size={18} color="#4a90e2" />
                                <Text style={styles.infoText}>
                                    Helyszín: {item.ora_kezdeshelye || "Nincs megadva"}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.editButton}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate("Oktato_OraSzerkesztes", { ora: item })}
                            >
                                <Text style={styles.editButtonText}>Szerkesztés</Text>
                                <Ionicons name="create-outline" size={18} color="#fff" style={styles.editIcon} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={48} color="#bdc3c7" />
                            <Text style={styles.emptyText}>Nincs elkövetkező óra</Text>
                        </View>
                    }
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 25,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#2c3e50',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        overflow: 'hidden',
    },
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(74, 144, 226, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    lessonDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },
    typePill: {
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        color: '#2ecc71',
        fontSize: 13,
        fontWeight: '500',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    infoText: {
        fontSize: 15,
        color: '#34495e',
        marginLeft: 10,
    },
    editButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4a90e2',
        padding: 12,
        margin: 16,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '500',
        marginRight: 8,
    },
    editIcon: {
        marginLeft: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 16,
        textAlign: 'center',
    },
});