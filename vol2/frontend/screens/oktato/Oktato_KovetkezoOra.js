import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";
import { Calendar, LocaleConfig } from "react-native-calendars";

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
            const response = await fetch(Ipcim.Ipcim + "/egyOktatoAdatai", {
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
        <View style={Oktato_Styles.reszletek_container}>
            <View>
                {kovetkezoOra && (
                    <Text>
                        Következő óra: {formatDateTime(kovetkezoOra.ora_datuma)} - {kovetkezoOra.tanulo_neve}
                    </Text>
                )}
            </View>

            <View>
                <Calendar
                    onDayPress={(day) => {
                        setSelectedDate(day.dateString);
                        fetchLessonsForDate(day.dateString);
                    }}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: "blue" },
                    }}
                    theme={{
                        selectedDayBackgroundColor: "blue",
                        todayTextColor: "red",
                        arrowColor: "blue",
                    }}
                />

                {selectedDate ? (
                    <Text style={styles.selectedText}>Kiválasztott dátum: {selectedDate}</Text>
                ) : null}
            </View>

            <View>
                {selectedDateLessons.length > 0 ? (
                    <FlatList
                        data={selectedDateLessons}
                        keyExtractor={(item) => item.ora_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.lessonItem}>
                                <Text style={styles.lessonText}>{formatDateTime(item.ora_datuma)}</Text>
                                <Text>{item.tanulo_neve}</Text>
                            </View>
                        )}
                    />
                ) : (
                    selectedDate && <Text style={styles.noLessons}>Nincs óra erre a napra.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    selectedText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
    lessonItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
    },
    lessonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    noLessons: {
        marginTop: 10,
        fontSize: 16,
        color: "red",
        fontWeight: "bold",
    },
});
