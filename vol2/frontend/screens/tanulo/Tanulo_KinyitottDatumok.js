import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import Collapsible from "react-native-collapsible";
import Styles from "../../Styles";
const TanuloKinyitottDatumok = ({
  naptarLenyitas,
  naptarToggle,
  styles,
  orakLista,
}) => {
  const ma = new Date();
  const [kivalasztottDatum, setKivalasztottDatum] = useState(ma);
  const [upcomingCollapsed, setUpcomingCollapsed] = useState(true);
  const [finishedCollapsed, setFinishedCollapsed] = useState(true);
  const megjeloltNapok = () => {
    const megjelolve = {};
    orakLista.forEach((item) => {
      const datum = new Date(item.ora_datuma);
      const datumSzoveggeAlakitva = datum.toISOString().split("T")[0];
      megjelolve[datumSzoveggeAlakitva] = { marked: true };
    });
    // Add the selected date to the markedDates object
    const selectedDate = kivalasztottDatum.toISOString().split("T")[0];
    megjelolve[selectedDate] = { selected: true, marked: true };
    return megjelolve;
  };
  const datumMegnyomas = (day) => {
    const ujDatum = new Date(day.dateString);
    setKivalasztottDatum(ujDatum);
  };
  const separateClasses = () => {
    const now = new Date();
    const upcoming = [];
    const finished = [];

    orakLista.forEach((item) => {
      const itemDate = new Date(item.ora_datuma);
      if (itemDate > now) {
        upcoming.push(item);
      } else {
        finished.push(item);
      }
    });

    return { upcoming, finished };
  };
  const { upcoming, finished } = separateClasses();
  return (
    <ScrollView>
      <View style={{ marginTop: 20 }}>
        <Calendar
          style={styles.kalendar}
          onDayPress={(day) => {
            console.log("selected day", day);
            datumMegnyomas(day);
          }}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          current={kivalasztottDatum.toISOString().split("T")[0]}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#6A5AE0",
            selectedDayTextColor: "white",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#dd99ee",
            "stylesheet.calendar.header": {
              header: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              },
              monthText: {
                fontSize: 25,
                fontWeight: "bold",
                color: "#6A5AE0",
              },
              arrow: {
                fontSize: 25,
              },
            },
          }}
          markedDates={megjeloltNapok()}
          locale={"hu"}
        />
        {/*----------------------------------- NAPTÁR KI BE NYITÁSA GOMB -------------------------------- */}
        <TouchableOpacity onPress={naptarToggle}>
          {naptarLenyitas ? (
            <View style={Styles.naptarNyitogatoGombView}>
              <Text style={{ color: "black", fontSize: 16 }}>
                Naptár becsukása
              </Text>
              <Ionicons name="chevron-up-outline" size={30} color="black" />
            </View>
          ) : (
            <View style={Styles.naptarNyitogatoGombView}>
              <Text style={{ color: "#fff" }}>Naptár kinyitása</Text>
              <Ionicons name="chevron-down-outline" size={30} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/*----------------------------------- ELKÖVETKEZENDŐ ÓRÁK -------------------------------- */}
      <TouchableOpacity
        onPress={() => setUpcomingCollapsed(!upcomingCollapsed)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Elkövetkezendő Órák</Text>
          <Ionicons
            name={
              upcomingCollapsed ? "chevron-down-outline" : "chevron-up-outline"
            }
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={upcomingCollapsed}>
        {upcoming.map((item, index) => {
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
          const hatterszinTomb = ["#FDEEDC", "#D6EFFF", "#F5D8E8", "#E8DFF5"];
          const hatterszinAzOraknak = hatterszinTomb[index % hatterszinTomb.length];
          return (
            <View
              key={item.ora_id}
              style={[styles.OraView, { backgroundColor: hatterszinAzOraknak }]}
            >
              <Text style={styles.eventTitle}>{`${honapNap}`}</Text>
              <Text style={styles.eventTime}>{` ${oraPerc}`}</Text>
            </View>
          );
        })}
      </Collapsible>

      {/*----------------------------------- MÁR TELJESÍTETT ÓRÁK -------------------------------- */}
      <TouchableOpacity
        onPress={() => setFinishedCollapsed(!finishedCollapsed)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Teljesített órák</Text>
          <Ionicons
            name={
              finishedCollapsed ? "chevron-down-outline" : "chevron-up-outline"
            }
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={finishedCollapsed}>
        {finished.map((item, index) => {
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

          const hatterszinTomb = ["#FDEEDC", "#D6EFFF", "#F5D8E8", "#E8DFF5"];
          const hatterszinAzOraknak =
            hatterszinTomb[index % hatterszinTomb.length];

          return (
            <View
              key={item.ora_id}
              style={[styles.OraView, { backgroundColor: hatterszinAzOraknak }]}
            >
              <Text style={styles.eventTitle}>{`${honapNap}`}</Text>
              <Text style={styles.eventTime}>{` ${oraPerc}`}</Text>
            </View>
          );
        })}
      </Collapsible>
    </ScrollView>
  );
};
export default TanuloKinyitottDatumok;