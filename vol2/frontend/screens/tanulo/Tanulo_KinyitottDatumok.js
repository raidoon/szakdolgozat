import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import Styles from "../../Styles";

const TanuloKinyitottDatumok = ({
  naptarLenyitas,
  naptarToggle,
  datumMegnyomas,
  kivalasztottDatum,
  setKivalasztottDatum,
  styles,
  orakLista,
}) => {
  const megjeloltNapok = () => {
    const megjelolve = {};
    orakLista.forEach((item) => {
      const datum = new Date(item.ora_datuma);
      const datumSzoveggeAlakitva = datum.toISOString().split("T")[0]; // Formázott dátum YYYY-MM-DD formátumban
      // Beállítjuk a marked dátumokat a naptárhoz
      megjelolve[datumSzoveggeAlakitva] = { marked: true };
    });
    return megjelolve;
  };

  return (
    <ScrollView>
      <View style={{ marginTop: 20 }}>
        <Calendar
          style={styles.kalendar}
          //renderHeader={() => (<NaptarHeaderBetoltes kivalasztottDatum={kivalasztottDatum} />)}
          onDayPress={(day) => {
            console.log("selected day", day);
            datumMegnyomas(day);
          }}
          onPressArrowLeft={(subtractMonth) => {
            subtractMonth();
          }}
          onPressArrowRight={(addMonth) => {
            addMonth();
          }}
          current={kivalasztottDatum.toISOString().split("T")[0]} // Ensure the calendar updates with the new date
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "purple",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#dd99ee",
          }}
          // a markedDates prop dinamikusan generálva adatbázis alapján
          /*markedDates={{
            [kivalasztottDatum.toISOString().split("T")[0]]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "orange",
            },
            "2025-01-10": {
              selected: true,
              marked: true,
              selectedColor: "green",
            },
            "2025-01-17": { marked: true },
            "2025-01-16": { marked: true },
            "2025-01-15": { marked: true },
          }}*/
          markedDates={megjeloltNapok()}
          locale={"hu"}
        />
      </View>
      {/*--------------------------------- DÁTUM KI BE NYITOGATÓS GOMB ---------------------------------*/}
      <View >
        
      <TouchableOpacity onPress={naptarToggle}>
        {naptarLenyitas ? (
          <View style={Styles.naptarNyitogatoGombView}>
            <Text style={{color:'black', fontSize: 16 }}>Naptár becsukása</Text>
            <Ionicons name="chevron-up-outline" size={30} color="black" />
          </View>
        ) : (
          <View style={Styles.naptarNyitogatoGombView}>
            <Text style={{color:'#fff',}}>Naptár kinyitása</Text>
            <Ionicons name="chevron-down-outline" size={30} color="white" />
          </View>
        )}
      </TouchableOpacity>
      </View>
      {/*--------------------------------- AZ ÖSSZES ÓRA KIÍRATÁSA ---------------------------------*/}
      {orakLista
        .sort(
          (a, b) => new Date(b.ora_datuma) - new Date(a.ora_datuma) //a legrégebbi óra legyen legalul
        )
        .map((item, index) => {
          const date = new Date(item.ora_datuma);
          const honapNap = date
            .toLocaleDateString("hu-HU", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, ".");
          const oraPerc = date.toLocaleTimeString("hu-HU", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const hatterszinTomb = [
            "#FDEEDC",
            "#D6EFFF",
            "#F5D8E8",
            "#E8DFF5",
            //"#48cae4",
          ]; // háttér színek a különböző elemeknek
          const hatterszinAzOraknak =
            hatterszinTomb[index % hatterszinTomb.length]; // haladunk szép sorban a színekkel

          return (
            <View
              key={item.ora_id}
              style={[
                styles.OraView,
                { backgroundColor: hatterszinAzOraknak },
              ]}
            >
              <Text style={styles.eventTitle}>{`${honapNap}`}</Text>
              <Text style={styles.eventTime}>{` ${oraPerc}`}</Text>
            </View>
          );
        })}
    </ScrollView>
  );
};
export default TanuloKinyitottDatumok;
