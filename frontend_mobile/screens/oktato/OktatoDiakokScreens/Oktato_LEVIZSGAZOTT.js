import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

import Ipcim from "../../../Ipcim";

export default function Oktato_LEVIZSGAZOTT({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const navigation = useNavigation();
    console.log(atkuld);

    const letoltes = async () => {
        
        
        try {
            const adat = {
                oktato_id: atkuld.oktato_id,
            }
            //alert(atkuld.oktato_id)
            console.log("Elküldött adat:", JSON.stringify({ "oktato_id": atkuld.oktato_id }));

            const response = await fetch(Ipcim.Ipcim + "/levizsgazottDiakok", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            console.log("API válasz:", response);

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            //alert(JSON.stringify(data))
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
       
        navigation.navigate("Oktato_LevizsgazottTanuloReszletei", { tanulo });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Levizsgázott Diákok</Text>

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
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemText: {
        fontSize: 18,
        color: '#333',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
