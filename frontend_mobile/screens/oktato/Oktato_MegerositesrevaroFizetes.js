import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";
import { LinearGradient } from "expo-linear-gradient";

export default function Oktato_MegerositesrevaroFizetes({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const navigation = useNavigation();

    const letoltes = async () => {
        try {
            const adat = { oktato_id: atkuld.oktato_id };
            console.log("Elküldött adat:", JSON.stringify(adat));

            const response = await fetch(Ipcim.Ipcim + "/nemkeszBefizetesek", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

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
        navigation.navigate("Oktato_MegerositBefizetes", { tanulo });
    };

    return (
        <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Megerősítésre váró fizetések</Text>

                {adatok.length === 0 ? (
                    <Text style={styles.noPaymentsText}>Nincs megerősítésre váró befizetés.</Text>
                ) : (
                    <FlatList
                        data={adatok}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.studentName}>{item.tanulo_neve}</Text>
                                <TouchableOpacity
                                    style={styles.detailsButton}
                                    onPress={() => katt(item)}
                                >
                                    <Text style={styles.buttonText}>Továbbiak</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item) => item.tanulo_id.toString()}
                    />
                )}
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
    noPaymentsText: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
        marginTop: 20,
    },
    card: {
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