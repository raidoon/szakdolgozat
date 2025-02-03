import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

const TanuloKinyitottDatumok = ({
  naptarLenyitas,
  naptarToggle,
  datumMegnyomas,
  kivalasztottDatum,
  setKivalasztottDatum,
  styles,
  orakLista,
}) => {
  const honapValtas = (irany) => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setMonth(kivalasztottDatum.getMonth() + irany);
    setKivalasztottDatum(ujDatum);
  };

  const NaptarHeaderBetoltes = ({ kivalasztottDatum }) => {
    const honapNeve = kivalasztottDatum.toLocaleString("hu-HU", {
      month: "long",
    });
    const honapNeveNagyBetuvel =
      honapNeve.charAt(0).toUpperCase() + honapNeve.slice(1);
    const ev = kivalasztottDatum.getFullYear();
    return (
      <Text style={styles.egysorosHonapSzoveg}>
        {ev} - {honapNeveNagyBetuvel}
      </Text>
    );
  };

  return (
    <ScrollView>
      <View style={{ marginTop: 20 }}>
        <Calendar
          style={styles.kalendar}
          renderHeader={() => (
            <NaptarHeaderBetoltes kivalasztottDatum={kivalasztottDatum} />
          )}
          onDayPress={(day) => {
            console.log("selected day", day);
            datumMegnyomas(day);
          }}
          onPressArrowLeft={(subtractMonth) => {
            subtractMonth();
            honapValtas(-1);
          }}
          onPressArrowRight={(addMonth) => {
            addMonth();
            honapValtas(1);
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
          markedDates={{
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
          }}
          locale={"hu"}
        />
      </View>
      <TouchableOpacity onPress={naptarToggle} style={styles.kibenyitogomb}>
        {naptarLenyitas ? (
          <Ionicons name="chevron-up-outline" size={30} color="white" />
        ) : (
          <Ionicons name="chevron-down-outline" size={30} color="white" />
        )}
      </TouchableOpacity>

      {orakLista.map((item, index) => {
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
          "#48cae4",
        ]; // háttér színek a különböző elemeknek
        const hatterszinAzOraknak =
          hatterszinTomb[index % hatterszinTomb.length]; // haladunk szép sorban a színekkel

        return (
          <View
            key={item.ora_id}
            style={[styles.eventItem, { backgroundColor: hatterszinAzOraknak }]}
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
