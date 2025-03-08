import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ipcim from "../../Ipcim";

export default function Oktato_MegerositesrevaroOrak({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const letoltes = async () => {
            try {
                const response = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
                    method: "POST",
                    body: JSON.stringify({ oktato_id: atkuld.oktato_id }),
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                });

                if (!response.ok) throw new Error(`Hiba: ${response.statusText}`);

                setAdatok(await response.json());
            } catch (error) {
                console.error("API hiba:", error);
                alert("Nem sikerült az adatok letöltése.");
            }
        };

        letoltes();
    }, []);

    // 🔹 1️⃣ PULZÁLÓ HATÁS (Bounce) gyorsítva
    const katt = (tanulo, anim) => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 0.9, duration: 50, useNativeDriver: true }), // Gyorsabb animáció (50ms)
            Animated.timing(anim, { toValue: 1.1, duration: 50, useNativeDriver: true }), // Gyorsabb animáció (50ms)
            Animated.timing(anim, { toValue: 1, duration: 50, useNativeDriver: true }),  // Gyorsabb animáció (50ms)
        ]).start(() => navigation.navigate("Oktato_MegerositOra", { tanulo }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Módosítható órák</Text>

            {adatok.length === 0 ? (
                <Text style={styles.noData}>Nincs módosítható óra.</Text>
            ) : (
                <FlatList
                    data={adatok}
                    renderItem={({ item }) => {
                        const scaleAnim = new Animated.Value(1); // Egyedi animáció minden gombhoz

                        return (
                            <View style={styles.card}>
                                <Text style={styles.name}>{item.tanulo_neve}</Text>

                                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                    <TouchableOpacity style={styles.button} onPress={() => katt(item, scaleAnim)}>
                                        <Text style={styles.buttonText}>Továbbiak</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        );
                    }}
                    keyExtractor={(item) => item.tanulo_id.toString()}
                />
            )}
        </View>
    );
}

// 📌 STÍLUSOK
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: "#4c669f",
        backgroundImage: "linear-gradient(to bottom, #4c669f, #3b5998, #192f6a)",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        marginBottom: 20,
    },
    noData: {
        textAlign: "center",
        fontSize: 16,
        color: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 4,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
        color: "#3b5998",
    },
    button: {
        backgroundColor: "rgba(0, 123, 255, 1)",
        paddingVertical: 14,  // Vastagabb gomb (növelhetjük a padding-et)
        paddingHorizontal: 20, // Oldalsó tér a szöveg körül
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        height: 50, // Gomb magasságának csökkentése (rövidebb)
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
});
