import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ipcim from "../../Ipcim";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";

LocaleConfig.locales["hu"] = {
    monthNames: [
        "Január", "Február", "Március", "Április", "Május", "Június",
        "Július", "Augusztus", "Szeptember", "Október", "November", "December"
    ],
    monthNamesShort: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szep", "Okt", "Nov", "Dec"],
    dayNames: ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"],
    dayNamesShort: ["H", "K", "Sze", "Cs", "P", "Szo", "V"],
    today: "Ma"
};
LocaleConfig.defaultLocale = "hu";

export default function Oktato_KovetkezoOra({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [kovetkezoOra, setKovetkezoOra] = useState(null);
    const [valasztottDatum, setValasztottDatum] = useState("");
    const [datumOrai, setDatumOrai] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "Vezetési órarend",
            headerShown: true,
            headerStyle: { backgroundColor: '#4CAF50' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
        });

        letoltes();
        kovetkezoOraLetoltes();
    }, [navigation]);

    const letoltes = async () => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
                method: "POST",
                body: JSON.stringify({ oktatoid: atkuld.oktato_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            const data = await response.json();
            setAdatok(data);
        } catch (error) {
            console.error("Hiba az adatok letöltésekor:", error);
        }
    };

    const kovetkezoOraLetoltes = async () => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/koviOra", {
                method: "POST",
                body: JSON.stringify({ oktato_id: atkuld.oktato_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            const data = await response.json();
            if (data.length > 0) {
                setKovetkezoOra(data[0]);
            }
        } catch (error) {
            console.error("Hiba a következő óra letöltése során:", error);
        }
    };

    const napOrai = async (date) => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/egyNapOraja", {
                method: "POST",
                body: JSON.stringify({ oktato_id: atkuld.oktato_id, datum: date }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            const data = await response.json();
            setDatumOrai(data);
        } catch (error) {
            console.error("Hiba az órarend lekérésekor:", error);
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
        <LinearGradient 
            colors={['#4CAF50', '#2196F3']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                {kovetkezoOra && (
                    <View style={styles.koviOraContainer}>
                        <Text style={styles.koviOraText}>
                            Következő óra: {formatDateTime(kovetkezoOra.ora_datuma)} - {kovetkezoOra.tanulo_neve}
                        </Text>
                    </View>
                )}

                <View style={styles.naptarContainer}>
                    <Calendar
                        onDayPress={(day) => {
                            setValasztottDatum(day.dateString);
                            napOrai(day.dateString);
                        }}
                        markedDates={{
                            [valasztottDatum]: {
                                selected: true,
                                selectedColor: "#388E3C",
                                customStyles: {
                                    container: {
                                        borderRadius: 5,
                                        width: 36,
                                        height: 36,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                    text: {
                                        color: "#fff",
                                        fontWeight: "bold",
                                    },
                                },
                            },
                        }}
                        theme={{
                            calendarBackground: "#FFFFFF",
                            textSectionTitleColor: "#2E7D32",
                            textSectionTitleDisabledColor: "#BDBDBD",
                            dayTextColor: "#2E7D32",
                            todayTextColor: "#00796B",
                            selectedDayTextColor: "#FFFFFF",
                            selectedDayBackgroundColor: "#388E3C",
                            textDisabledColor: "#BDBDBD",
                            arrowColor: "#388E3C",
                            textDayFontSize: 18,
                            textMonthFontSize: 20,
                            textDayHeaderFontSize: 16,
                            textDayFontWeight: "500",
                            textMonthFontWeight: "bold",
                            textDayHeaderFontWeight: "500",
                        }}
                    />

                    {valasztottDatum && (
                        <Text style={styles.kivalasztottText}>Kiválasztott dátum: {valasztottDatum}</Text>
                    )}
                </View>

                <View style={styles.orakContainer}>
                    {datumOrai.length > 0 ? (
                        <FlatList
                            data={datumOrai}
                            keyExtractor={(item) => item.ora_id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.orakItem}>
                                    <Text style={styles.orakText}>{formatDateTime(item.ora_datuma)}</Text>
                                    <Text style={styles.orakDiak}>Tanuló: {item.tanulo_neve}</Text>
                                    <Text style={styles.orakDiak}>Óra típusa: {item.oratipus_neve}</Text>

                                </View>
                            )}
                        />
                    ) : (
                        valasztottDatum && <Text style={styles.nincsOra}>Nincs óra erre a napra.</Text>
                    )}
                </View>
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
    koviOraContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#388E3C',
        elevation: 3,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    koviOraText: {
        fontSize: 20,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    naptarContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    kivalasztottText: {
        marginTop: 10,
        fontSize: 18,
        color: '#2E7D32',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    orakContainer: {
        flex: 1,
    },
    orakItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50',
        elevation: 2,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    orakText: {
        fontSize: 20,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    orakDiak: {
        fontSize: 18,
        color: '#388E3C',
    },
    nincsOra: {
        marginTop: 10,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});