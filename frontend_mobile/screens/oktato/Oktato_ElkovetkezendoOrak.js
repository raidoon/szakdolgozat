import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ipcim from "../../Ipcim";

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
                setTipus(data[0].oratipus_neve); // Set the type for the first item (if needed)
            }
        } catch (error) {
            console.error("Hiba az adatok letöltésekor:", error);
            alert("Nem sikerült az adatok letöltése.");
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
            <Text style={styles.title}>Elkövetkező órák</Text>

            <FlatList
                data={adatok}
                keyExtractor={(item) => item.ora_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.lessonDate}>📅 {formatDateTime(item.ora_datuma)}</Text>
                        <Text style={styles.lessonText}>👤 Diák: <Text style={styles.bold}>{item.tanulo_neve}</Text></Text>
                        <Text style={styles.lessonText}>📍 Helyszín: <Text style={styles.bold}>{item.ora_kezdeshelye}</Text></Text>
                        <Text style={styles.lessonText}> Típus: <Text style={styles.bold}>{item.oratipus_neve}</Text></Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("Oktato_OraSzerkesztes", { ora: item })}
                        >
                            <Text style={styles.buttonText}>Szerkesztés</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fffde7", // Light pleasant yellow background
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#ff8f00", // Orange for contrast
    },
    card: {
        backgroundColor: "#fff3e0", // Light orange card background
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lessonDate: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ff8f00", // Orange for emphasis
        marginBottom: 5,
    },
    lessonText: {
        fontSize: 16,
        color: "#333",
    },
    bold: {
        fontWeight: "bold",
        color: "#000",
    },
    button: {
        marginTop: 10,
        backgroundColor: "#ff8f00", // Orange button
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});