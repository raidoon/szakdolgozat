import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../../Ipcim";
import Animated, { FadeInDown, FadeInUp, SlideInLeft } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Oktato_AktualisTanulok({ route }) {
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
       
        navigation.navigate("Oktato_TanuloAOrak", { tanulo });
    };

    return (
        <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]} // New gradient colors
            style={styles.container}
        >
            <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
                <Text style={styles.title}>Diákok</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(1000).delay(200)} style={styles.content}>
                <FlatList
                    data={adatok}
                    renderItem={({ item, index }) => (
                        <Animated.View
                            entering={SlideInLeft.duration(500).delay(index * 100)}
                            style={styles.itemContainer}
                        >
                            <Text style={styles.itemText}>{item.tanulo_neve}</Text>
                            <TouchableOpacity 
                                style={styles.button} 
                                onPress={() => katt(item)}
                            >
                                <Text style={styles.buttonText}>Továbbiak</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    keyExtractor={item => item.tanulo_id.toString()} 
                />
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    content: {
        flex: 1,
    },
    itemContainer: {
        padding: 20,
        marginBottom: 15,
        backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly more opaque white
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    itemText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#444",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#ff6f61", // Coral color for the button
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});