import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";

export default function Oktato_AKTUALIS({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const navigation = useNavigation();
    console.log(atkuld);

    const letoltes = async () => {
        try {
            const adat = {
                oktato_id: atkuld.oktato_id,
            }
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
    }

    useEffect(() => {
        letoltes();
    }, []);

    const katt = (tanulo) => {
        alert(tanulo.tanulo_felhasznaloID)
        navigation.navigate("Oktato_TanuloReszletei", { tanulo });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Aktuális Diákok</Text>

            <FlatList
                data={adatok}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.tanulo_neve}</Text>
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={() => katt(item)}>
                            <Text style={styles.buttonText}>Továbbiak</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={item => item.tanulo_id.toString()} 
                contentContainerStyle={styles.flatListContent} // Added for spacing
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin:20
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2c3e50',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    itemText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495e',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    flatListContent: {
        paddingBottom: 20, // Added bottom padding to avoid cutting off the last item
    },
});