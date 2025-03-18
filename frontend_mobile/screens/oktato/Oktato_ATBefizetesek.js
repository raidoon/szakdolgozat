import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";
import { LinearGradient } from "expo-linear-gradient";

export default function Oktato_ATBefizetesek({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const navigation = useNavigation();
    console.log(atkuld);

    const letoltes = async () => {
        try {
            const adat = {
                oktato_id: atkuld.oktato_id,
            };
            console.log("Elküldött adat:", JSON.stringify({ "oktato_id": atkuld.oktato_id }));

            const response = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            console.log("API válasz:", response);

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            setAdatok(data);
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése. Ellenőrizd az API-t.");
        }
    };

    useEffect(() => {
        letoltes();
    }, []);

    const katt = (tanulo) => {
        
        navigation.navigate("Oktato_TanuloABefizetesek", { tanulo });
    };

    return (
        <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Diákok</Text>

                <FlatList
                    data={adatok}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.studentName}>{item.tanulo_neve}</Text>
                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => katt(item)}
                            >
                                <Text style={styles.buttonText}>Továbbiak</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.tanulo_id.toString()}
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
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    listItem: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    studentName: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    detailsButton: {
        backgroundColor: "#6a11cb",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});