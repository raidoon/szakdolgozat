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
    dayNames: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"],
    dayNamesShort: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
    today: "Ma"
};
LocaleConfig.defaultLocale = "hu";

export default function Oktato_KovetkezoOra({ route }) {
    const { atkuld } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [kovetkezoOra, setKovetkezoOra] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDateLessons, setSelectedDateLessons] = useState([]);
    const navigation = useNavigation();

    console.log(atkuld);

    const letoltes = async () => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
                method: "POST",
                body: JSON.stringify({ oktatoid: atkuld.oktato_id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            const data = await response.json();
            setAdatok(data);
            console.log(data);
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

    const fetchLessonsForDate = async (date) => {
        try {
            const response = await fetch(Ipcim.Ipcim + "/egyNapOraja", {
                method: "POST",
                body: JSON.stringify({ oktato_id: atkuld.oktato_id, datum: date }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            const data = await response.json();
            setSelectedDateLessons(data);
        } catch (error) {
            console.error("Hiba az órarend lekérésekor:", error);
        }
    };

    useEffect(() => {
        letoltes();
        kovetkezoOraLetoltes();
    }, []);

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
        <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
            <View style={styles.content}>
                {kovetkezoOra && (
                    <View style={styles.nextLessonContainer}>
                        <Text style={styles.nextLessonText}>
                            Következő óra: {formatDateTime(kovetkezoOra.ora_datuma)} - {kovetkezoOra.tanulo_neve}
                        </Text>
                    </View>
                )}

                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={(day) => {
                            setSelectedDate(day.dateString);
                            fetchLessonsForDate(day.dateString);
                        }}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                selectedColor: "#6a11cb",
                                customStyles: {
                                    container: {
                                        borderRadius: 5, // Square corners
                                        width: 36, // Width of the square
                                        height: 36, // Height of the square
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                    text: {
                                        color: "#fff", // Text color for the selected date
                                        fontWeight: "bold",
                                    },
                                },
                            },
                        }}
                        theme={{
                            calendarBackground: "#f0f0f0", // Gray background
                            textSectionTitleColor: "#333",
                            textSectionTitleDisabledColor: "#999",
                            dayTextColor: "#333",
                            todayTextColor: "#2575fc",
                            selectedDayTextColor: "#fff",
                            selectedDayBackgroundColor: "#6a11cb",
                            textDisabledColor: "#999",
                            arrowColor: "#6a11cb",
                            textDayFontSize: 18,
                            textMonthFontSize: 20,
                            textDayHeaderFontSize: 16,
                            textDayFontWeight: "bold",
                            textMonthFontWeight: "bold",
                            textDayHeaderFontWeight: "bold",
                        }}
                    />

                    {selectedDate && (
                        <Text style={styles.selectedText}>Kiválasztott dátum: {selectedDate}</Text>
                    )}
                </View>

                <View style={styles.lessonsContainer}>
                    {selectedDateLessons.length > 0 ? (
                        <FlatList
                            data={selectedDateLessons}
                            keyExtractor={(item) => item.ora_id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.lessonItem}>
                                    <Text style={styles.lessonText}>{formatDateTime(item.ora_datuma)}</Text>
                                    <Text style={styles.lessonStudent}>{item.tanulo_neve}</Text>
                                </View>
                            )}
                        />
                    ) : (
                        selectedDate && <Text style={styles.noLessons}>Nincs óra erre a napra.</Text>
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
    nextLessonContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    nextLessonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    calendarContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    selectedText: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    lessonsContainer: {
        flex: 1,
    },
    lessonItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    lessonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    lessonStudent: {
        fontSize: 14,
        color: '#fff',
    },
    noLessons: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});