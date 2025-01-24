import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import Styles from "../../Styles";

const Tanulo_Datumok = ({ atkuld }) => {
  const ma = new Date();
  const [kivalasztottDatum, setKivalasztottDatum] = useState(new Date());

  const [naptarLenyitas, setNaptarLenyitas] = useState(false);
  const [orakLista, setOrakLista] = useState([]);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [frissites, setFrissites] = useState(false);

  //--------------------------------------------- LOCALE CONFIG NAPTÁRHOZ, HOGY MAGYAR LEGYEN!!---------------------

  LocaleConfig.locales["hu"] = {
    monthNames: [
      "Január",
      "Február",
      "Március",
      "Április",
      "Május",
      "Június",
      "Július",
      "Augusztus",
      "Szeptember",
      "Október",
      "November",
      "December",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Már",
      "Ápr",
      "Máj",
      "Jún",
      "Júl",
      "Aug",
      "Szept",
      "Okt",
      "Nov",
      "Dec",
    ],
    dayNames: [
      "Vasárnap",
      "Hétfő",
      "Kedd",
      "Szerda",
      "Csütörtök",
      "Péntek",
      "Szombat",
    ],
    dayNamesShort: ["Vas", "Hét", "Ke", "Sze", "Csü", "Pén", "Szo"],
    today: "Ma",
  };
  LocaleConfig.defaultLocale = "hu";
  //--------------------------------------------- IDE JÖN MAJD A TANULÓ ÓRÁINAK BETÖLTÉSE

  //------------------------------------------------------------- OLDAL FRISSÍTÉSE
  const frissitesKozben = useCallback(() => {
    setFrissites(true);
    setTimeout(() => {
      adatokBetoltese();
      setFrissites(false);
    }, 2000);
  }, []);

  /*
  const orakDatumSzerint = {
    "2025-01-23": [
      {
        id: "1",
        cim: "Indulás a buszvégállomásról",
        ido: "reggel 08:00 - 10:00",
        color: "#FDEEDC",
      },
      {
        id: "2",
        cim: "Indulás a Szepességi utcáról",
        ido: "D.E. 09:00 - 09:40",
        color: "#E8DFF5",
      },
      {
        id: "3",
        cim: "Petőfi utca",
        ido: "délelőtt 10:00 - 10:15",
        color: "#D6EFFF",
      },
    ],
    "2025-01-17": [
      {
        id: "4",
        cim: "Indulás a buszvégállomásról",
        ido: "08:30 - 10:30",
        color: "#F5D8E8",
      },
      {
        id: "5",
        cim: "EZ EGY ORA IDK",
        ido: "11:00 - 11:30",
        color: "#D6EFFF",
      },
      {
        id: "6",
        cim: "Lunch with clients",
        ido: "12:00 - 13:00",
        color: "#FDEEDC",
      },
    ],
    "2025-01-25": [
      {
        id: "7",
        cim: "Indulás a buszvégállomásról",
        ido: "09:00 - 09:30",
        color: "#E8DFF5",
      },
      {
        id: "8",
        cim: "BLA BLA BLA BLA",
        ido: "11:00 - 11:45",
        color: "#D6EFFF",
      },
    ],
  };

  const orak =
    orakDatumSzerint[kivalasztottDatum.toISOString().split("T")[0]] || [];
*/

  const naptarToggle = () => {
    setNaptarLenyitas(!naptarLenyitas);
  };

  const NaptarHeaderBetoltes = () => {
    const honapNeve = kivalasztottDatum.toLocaleString("hu-HU", {
      month: "long",
    });
    const honapNeveNagyBetuvel =
      honapNeve.charAt(0).toUpperCase() + honapNeve.slice(1);
    const ev = kivalasztottDatum.getFullYear();
    return(
      <Text style={styles.egysorosHonapSzoveg}>
            {honapNeveNagyBetuvel} {ev}
      </Text>
    ) ;
  };

  const datumMegnyomas = (day) => {
    const ujDatum = new Date(kivalasztottDatum);
    if (isNaN(ujDatum)) {
      setKivalasztottDatum(new Date()); // Set to current date if invalid
    } else {
      ujDatum.setDate(day);

      // Make sure the selected date stays within the current month
      if (ujDatum.getMonth() !== kivalasztottDatum.getMonth()) {
        setKivalasztottDatum(new Date()); // Reset to current date if month has changed
      } else {
        setKivalasztottDatum(ujDatum);
      }
    }
  };

  const jelenlegiHet = () => {
    const hetElsoNapja = new Date(kivalasztottDatum);
    hetElsoNapja.setDate(
      kivalasztottDatum.getDate() - kivalasztottDatum.getDay() + 1
    ); // always start the week on Monday

    return Array.from({ length: 7 }, (_, i) => {
      const nap = new Date(hetElsoNapja);
      nap.setDate(hetElsoNapja.getDate() + i);

      // Ensure the generated week stays within the same month
      if (nap.getMonth() !== kivalasztottDatum.getMonth()) {
        return null; // Skip days that are out of the current month
      }
      return nap;
    }).filter(Boolean); // Remove null values
  };

  const maVanMa = (datum) => {
    if (!datum) return false; // Ensure datum is not undefined or null
    const ma = new Date();
    return (
      ma.getDate() === datum.getDate() &&
      ma.getMonth() === datum.getMonth() &&
      ma.getFullYear() === datum.getFullYear()
    );
  };

  /*
  const honapValtas = (irany) => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setMonth(kivalasztottDatum.getMonth() + irany);
    setKivalasztottDatum(ujDatum);
  };
*/
  /*
  const getHonapNapjai = (ev, honap) => {
    return new Date(ev, honap + 1, 0).getDate();
  };
  */

  /*
  const NaptariNapokGeneralasa = () => {
    const ev = kivalasztottDatum.getFullYear();
    const honap = kivalasztottDatum.getMonth();
    const honapNapjai = getHonapNapjai(ev, honap);
    return Array.from({ length: honapNapjai }, (_, i) => i + 1);
  };
  */

  return (
    <View
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
      }
    >
      {/* ------------------------------ BEZÁRT EGY SOROS NAPTÁR NÉZET -------------------------------------- */}
      {!naptarLenyitas && (
        <View style={styles.collapsedRow}>
          {NaptarHeaderBetoltes()}
          <View style={styles.weekRow}>
            {jelenlegiHet().map((nap) => (
              <View
                key={nap.toISOString()}
                style={[styles.weekDay, maVanMa(nap) && styles.maiNapHattere]}
              >
                <Text
                  style={[
                    styles.weekDayText,
                    maVanMa(nap) && styles.maiNapSzovege,
                  ]}
                >
                  {nap.toLocaleString("hu-HU", { weekday: "short" })}
                </Text>
                <Text
                  style={[
                    styles.weekDayNumber,
                    maVanMa(nap) && styles.maiNapSzovege,
                  ]}
                >
                  {nap.getDate()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ------------------------------------------- KINYITOTT NAGY NAPTÁR NÉZET -------------------------------- */}
      {naptarLenyitas && (
        <View>
          <View style={{marginTop: 20}}>
            <Calendar
              style={styles.kalendar}
              renderHeader={() => NaptarHeaderBetoltes()}
              onDayPress={(day) => {
                console.log("selected day", day);
                datumMegnyomas(day);
              }}
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
                [kivalasztottDatum]: {
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
        </View>
      )}

      {/*------------------------------ NAPTÁR KI BE NYITÓS GOMB !!! --------------------------*/}

      <TouchableOpacity onPress={naptarToggle} style={styles.kibenyitogomb}>
        {naptarLenyitas ? (
          <Ionicons name="chevron-up-outline" size={30} color="white" />
        ) : (
          <Ionicons name="chevron-down-outline" size={30} color="white" />
        )}
      </TouchableOpacity>

      {/*------------------------ IDE JÖNNEK MAJD AZ ÓRÁK FLATLISTTEL, AB-BŐL -----------------------*/}

      {/*
           <FlatList
        data={orak}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.maddingespadding, { backgroundColor: item.color }]}
          >
            <Text style={styles.oraCim}>{item.cim}</Text>
            <Text style={styles.oraIdeje}>{item.ido}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.nincsOra}>Ezen a napon nincsenek óráid</Text>
        }
      />
           */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  collapsedRow: {
    marginBottom: 20,
    marginTop: 27.5
  },
  egysorosHonapSzoveg: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#4A4AFC",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  weekDay: {
    alignItems: "center",
    padding: 5,
  },
  weekDayText: {
    fontSize: 20,
    color: "#888",
  },
  weekDayNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
  },
  maiNapHattere: {
    //backgroundColor: "#D6EFFF",
    //backgroundColor: "#ccccff",
    backgroundColor: "#A06CD5",
    borderRadius: 10,
    padding: 8,
  },
  maiNapSzovege: {
    //color: "#4A4AFC",
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  napValasztas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateItem: {
    width: "13%",
    alignItems: "center",
    marginVertical: 5,
  },
  kivalasztottdatum: {
    width: "13%",
    alignItems: "center",
    backgroundColor: "#D6EFFF",
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
  },
  datumSzoveg: {
    color: "#888",
  },
  kivalasztottSzoveg: {
    color: "#000",
    fontWeight: "bold",
  },
  maddingespadding: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  oraCim: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  oraIdeje: {
    fontSize: 14,
    color: "#555",
  },
  nincsOra: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginTop: 20,
  },
  toggleButton: {
    alignSelf: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#4A4AFC",
    borderRadius: 5,
  },
  toggleButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  kibenyitogomb: {
    alignSelf: "center",
    marginVertical: 10,
    padding: 10,
    //backgroundColor: "#4A4AFC",
    backgroundColor: "#ccccff",
    borderRadius: 30,
  },
});

export default Tanulo_Datumok;
