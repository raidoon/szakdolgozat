import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../../Ipcim";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Oktato_LEVIZSGAZOTT({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "Levizsgázott Diákok",
            headerShown: true,
            headerStyle: { backgroundColor: '#00796B' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerRight: () => (
                <TouchableOpacity onPress={letoltes} style={{ marginRight: 15 }}>
                    <MaterialIcons name="refresh" size={24} color="white" />
                </TouchableOpacity>
            ),
        });
        letoltes();
    }, [navigation]);

    const letoltes = async () => {
        try {
            setRefreshing(true);
            const adat = { oktato_id: atkuld.oktato_id };
            const response = await fetch(Ipcim.Ipcim + "/levizsgazottDiakok", {
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) throw new Error(`Hiba történt: ${response.statusText}`);

            const data = await response.json();
            setAdatok(data);
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése. Kérlek próbáld újra később.");
        } finally {
            setRefreshing(false);
        }
    };

    const katt = (tanulo) => {
        navigation.navigate("Oktato_TanuloReszletei", { tanulo });
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
        
            <Text style={styles.emptyTitle}>Nem található levizsgázott diák</Text>
            <Text style={styles.emptyText}>Jelenleg nincs hozzád rendelt levizsgázott diák</Text>
            
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#E0F7FA', '#B2EBF2']} style={styles.background} />
            
            {adatok.length > 0 ? (
                <FlatList
                    data={adatok}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <View style={styles.studentInfo}>
                                <MaterialIcons name="account-circle" size={36} color="#00796B" />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemText}>{item.tanulo_neve}</Text>
                                    
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={styles.button} 
                                onPress={() => katt(item)}
                            >
                                <Text style={styles.buttonText}>Részletek</Text>
                                <MaterialIcons name="chevron-right" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.tanulo_id.toString()}
                    contentContainerStyle={styles.flatListContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={letoltes}
                            colors={['#00796B']}
                            tintColor="#00796B"
                        />
                    }
                />
            ) : (
                renderEmptyComponent()
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContainer: {
        marginLeft: 15,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00796B',
    },
    emailText: {
        fontSize: 14,
        color: '#757575',
        marginTop: 3,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00796B',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        elevation: 2,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 5,
    },
    flatListContent: {
        paddingTop: 15,
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
        opacity: 0.7,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00796B',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#616161',
        textAlign: 'center',
        marginBottom: 20,
    },
    
});


