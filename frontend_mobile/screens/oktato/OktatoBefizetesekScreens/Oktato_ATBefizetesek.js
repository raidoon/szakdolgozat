import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet,ActivityIndicator} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../../Ipcim";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Oktato_ATBefizetesek({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const letoltes = async () => {
        try {
            setLoading(true);
            const adat = { oktato_id: atkuld.oktato_id };

            const response = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
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
            Alert.alert("Hiba", "Nem sikerült az adatok letöltése");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        letoltes();
    }, []);

    const katt = (tanulo) => {
        navigation.navigate("Oktato_TanuloABefizetesek", { tanulo });
    };

    return (
        <LinearGradient colors={['#1e90ff', '#00bfff']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Diákok és Befizetések</Text>
                    <Text style={styles.subHeader}>Válassz egy diákot a részletek megtekintéséhez</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : adatok.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={48} color="#fff" />
                        <Text style={styles.emptyText}>Nincsenek aktív diákok</Text>
                    </View>
                ) : (
                    <FlatList
                        data={adatok}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.card}
                                onPress={() => katt(item)}
                            >
                                <View style={styles.cardContent}>
                                    <Ionicons name="person-circle-outline" size={32} color="#fff" />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.studentName}>{item.tanulo_neve}</Text>
                                        
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.tanulo_id.toString()}
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
    headerContainer: {
        marginBottom: 25,
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 15,
    },
    studentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    studentId: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 16,
        textAlign: 'center',
    },
});