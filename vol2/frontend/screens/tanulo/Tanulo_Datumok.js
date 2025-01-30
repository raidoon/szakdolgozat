import React, { useState, useEffect, useCallback } from "react";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
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
import Ipcim from "../../Ipcim";

const Tanulo_Datumok = ({ atkuld }) => {
  const ma = new Date();
  const [kivalasztottDatum, setKivalasztottDatum] = useState(ma);
  const [naptarLenyitas, setNaptarLenyitas] = useState(false);
  const [orakLista, setOrakLista] = useState([]);
  const [koviOra, setKoviOra] = useState([]);
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
  //---------------------------------- DÁTUM FORMÁZÁSA AZ ÓRÁHOZ
  const koviOraFormazasa = (adatBresponseJSON) => {
    const datum = new Date(adatBresponseJSON);
    // Külön formázott dátum (pl. JANUÁR 31)
    const honapNevekMagyarul = [
      "január",
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
    ];
    const nap = datum.getDate();
    const honap = honapNevekMagyarul[datum.getMonth()].toUpperCase();
    // Külön formázott idő (pl. 7:00)
    const ora = datum.getHours();
    const perc = datum.getMinutes().toString().padStart(2, "0"); // 2 számjegyre formázva
    return `${honap} ${nap} - ${ora}:${perc} óra`;
  };
  //------------------------------------------------------------- A TANULÓ ÓRÁINAK BETÖLTÉSE
  const adatokBetoltese = async () => {
    try {
      const adat = {
        felhasznalo_id: atkuld.felhasznalo_id,
      };
      if (adat) {
        const orak = await fetch(Ipcim.Ipcim + "/tanuloOsszesOraja", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (!orak.ok) {
          throw new Error("Hiba történt az órák betöltése közben!");
        }
        const orakValasz = await orak.json();
        setOrakLista(orakValasz);
        //---------- a következő óra időpontja
        const ora = await fetch(Ipcim.Ipcim + "/tanuloKovetkezoOraja", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const oraResponse = await ora.json();
        setKoviOra(oraResponse);
      }
    } catch (err) {
      setHiba(err.message);
    } finally {
      setBetolt(false);
      console.log(
        "tanulo_datumok screen --> az adatok betöltése hiba nélkül lefutott"
      );
    }
  };
  useEffect(() => {
    adatokBetoltese();
  }, []);

  //------------------------------------------------------------- OLDAL FRISSÍTÉSE
  const frissitesKozben = useCallback(() => {
    setFrissites(true);
    setTimeout(() => {
      adatokBetoltese();
      setFrissites(false);
    }, 2000);
  }, []);
  //-------------------------
  if (betolt) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Korábbi tranzakciók betöltése folyamatban...</Text>
      </View>
    );
  }

  if (hiba) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Hiba: {hiba}</Text>
      </View>
    );
  }

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
    return (
      <Text style={styles.egysorosHonapSzoveg}>
        {ev} - {honapNeveNagyBetuvel}
      </Text>
    );
  };
  const BecsukottNezetesNaptarHeader = () => {
    const honapNeve = kivalasztottDatum.toLocaleString("hu-HU", {
      month: "long",
    });
    const honapNeveNagyBetuvel =
      honapNeve.charAt(0).toUpperCase() + honapNeve.slice(1);
    return <Text>{honapNeveNagyBetuvel}</Text>;
  };
  const honapValtas = (irany) => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setMonth(kivalasztottDatum.getMonth() + irany);
    setKivalasztottDatum(ujDatum);
  };
  const datumMegnyomas = (day) => {
    const ujDatum = new Date(kivalasztottDatum);
    if (isNaN(ujDatum)) {
      setKivalasztottDatum(new Date()); // ha nem jó, akkor beállítjuk a mai napot
    } else {
      ujDatum.setDate(day);
      if (ujDatum.getMonth() !== kivalasztottDatum.getMonth()) {
        setKivalasztottDatum(new Date());
      } else {
        setKivalasztottDatum(ujDatum);
      }
    }
  };
  const jelenlegiHet = () => {
    const hetElsoNapja = new Date(kivalasztottDatum);
    hetElsoNapja.setDate(
      kivalasztottDatum.getDate() - kivalasztottDatum.getDay() + 1
    ); // mindig hétfőnél kezdjük a hetet

    return Array.from({ length: 7 }, (_, i) => {
      const nap = new Date(hetElsoNapja);
      nap.setDate(hetElsoNapja.getDate() + i);
      return nap;
    }).filter(Boolean); // töröljük a null értékeket
  };
  const handleSwipeLeft = () => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setDate(kivalasztottDatum.getDate() + 7); // 7 nappal előre
    setKivalasztottDatum(ujDatum);
  };

  const handleSwipeRight = () => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setDate(kivalasztottDatum.getDate() - 7); // 7 nappal hátra
    setKivalasztottDatum(ujDatum);
  };

  return (
    <View
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
      }
    >
      {/* ------------------------------ BEZÁRT EGY SOROS NAPTÁR NÉZET -------------------------------------- */}
      {!naptarLenyitas && (
        <View>
          <Text style={styles.egysorosHonapSzoveg}>
            {BecsukottNezetesNaptarHeader()}
          </Text>
          <View style={styles.collapsedRow}>
            {/*------------------------------ A HÉTNEK A SORA !!! --------------------------*/}
            <View style={styles.weekRow}>
              <TouchableOpacity onPress={handleSwipeRight}>
                <Ionicons name="chevron-back-outline" size={30} color="black" />
              </TouchableOpacity>

              {jelenlegiHet().map((nap) => {
                const isWeekend = nap.getDay() === 0 || nap.getDay() === 6; // Vasárnap vagy Szombat
                const hasClass = orakLista.some((item) => {
                  const date = new Date(item.ora_datuma);
                  return (
                    date.getFullYear() === nap.getFullYear() &&
                    date.getMonth() === nap.getMonth() &&
                    date.getDate() === nap.getDate()
                  );
                });

                return (
                  <TouchableOpacity
                    key={nap.toISOString()}
                    style={[
                      isWeekend && !kivalasztottDatum
                        ? styles.weekendDay
                        : styles.weekDay, // Hétvégéknek piros háttér
                      nap.toDateString() === kivalasztottDatum.toDateString() &&
                        styles.kivalasztottdatum,
                      isWeekend && styles.weekendDayText, // Hétvégéknek piros szöveg
                      hasClass && styles.vanAznapOra,
                    ]}
                    onPress={() => setKivalasztottDatum(nap)}
                  >
                    <Text
                      style={[
                        styles.weekDayText,
                        nap.toDateString() ===
                          kivalasztottDatum.toDateString() &&
                          styles.kivalasztottSzoveg,
                        isWeekend && styles.weekendDayText, // Hétvégéknek piros szöveg
                      ]}
                    >
                      {nap.toLocaleString("hu-HU", { weekday: "short" })}
                    </Text>
                    <Text
                      style={[
                        styles.weekDayNumber,
                        nap.toDateString() ===
                          kivalasztottDatum.toDateString() &&
                          styles.kivalasztottSzoveg,
                        isWeekend && styles.weekDayNumber,
                      ]}
                    >
                      {nap.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity onPress={handleSwipeLeft}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/*------------------------------ NAPTÁR KI BE NYITÓS GOMB !!! --------------------------*/}
          <TouchableOpacity onPress={naptarToggle} style={styles.kibenyitogomb}>
            {naptarLenyitas ? (
              <Ionicons name="chevron-up-outline" size={30} color="white" />
            ) : (
              <Ionicons name="chevron-down-outline" size={30} color="white" />
            )}
          </TouchableOpacity>
          {/*------------------------------ KÖVETKEZŐ ÓRA BUBORÉK !!! --------------------------*/}
          <View style={styles.oraContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View>
                <Text style={styles.oraTitle}>Következő óra:</Text>
                <Text style={styles.oraOsszeg}>
                  {koviOra.length > 0
                    ? koviOraFormazasa(koviOra[0].ora_datuma)
                    : "Egyenlőre még nincs beírva következő óra!"}
                </Text>
              </View>
            </View>
          </View>
          {/*------------------------------ AZ ÓRÁK FELSOROLÁSA --------------------------*/}
          {orakLista.some((item) => {
            const date = new Date(item.ora_datuma);
            return (
              kivalasztottDatum &&
              date.getFullYear() === kivalasztottDatum.getFullYear() &&
              date.getMonth() === kivalasztottDatum.getMonth() &&
              date.getDate() === kivalasztottDatum.getDate()
            );
          }) ? (
            orakLista.map((item, index) => {
              //index adja meg a tömb elemét
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

              if (
                kivalasztottDatum &&
                date.getFullYear() === kivalasztottDatum.getFullYear() &&
                date.getMonth() === kivalasztottDatum.getMonth() &&
                date.getDate() === kivalasztottDatum.getDate()
              ) {
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
                    style={[
                      styles.eventItem,
                      { backgroundColor: hatterszinAzOraknak },
                    ]}
                  >
                    <Text style={styles.eventTitle}>{`${honapNap}`}</Text>
                    <Text style={styles.eventTime}>{` ${oraPerc}`}</Text>
                  </View>
                );
              }
            })
          ) : (
            <Text style={styles.nincsOra}>
              {`${kivalasztottDatum.getDate()}${
                kivalasztottDatum.getDate() % 2 === 0 ? "-án" : "-én"
              } nem lesz órád, úgyhogy ne felejts el aznap pihenni! :)`}
            </Text>
          )}
        </View>
      )}
      {/* ------------------------------------------- KINYITOTT NAGY NAPTÁR NÉZET -------------------------------- */}
      {naptarLenyitas && (
        <View>
          <View style={{ marginTop: 20 }}>
            <Calendar
              style={styles.kalendar}
              renderHeader={() => NaptarHeaderBetoltes()}
              onDayPress={(day) => {
                console.log("selected day", day);
                datumMegnyomas(day);
              }}
              onPressArrowLeft={() => {
                honapValtas(-1);
              }}
              onPressArrowRight={() => {
                honapValtas(1);
              }}
              //onVisibleMonthsChange={(months) => {
              // Frissítjük az állapotot az első látható hónap alapján
              //if (months.length > 0) {
              //setKivalasztottDatum(new Date(months[0].dateString));
              //}
              //}}
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
          {/*------------------------------ NAPTÁR KI BE NYITÓS GOMB !!! --------------------------*/}

          <TouchableOpacity onPress={naptarToggle} style={styles.kibenyitogomb}>
            {naptarLenyitas ? (
              <Ionicons name="chevron-up-outline" size={30} color="white" />
            ) : (
              <Ionicons name="chevron-down-outline" size={30} color="white" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  //----------------------------------- egy soros naptár
  egysorosHonapSzoveg: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4A4AFC",
  },
  collapsedRow: {
    width: "auto",
    backgroundColor: "#FFFFFF",
    height: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    elevation: 5, // Árnyék Androidos telón
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  weekDay: {
    //backgroundColor: 'green',
    minWidth: 40,
    height: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#F0F0F0", // Alap háttérszín
  },
  weekendDay: {
    minWidth: 40,
    height: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  weekendDayText: {
    fontSize: 18,
    color: "red",
    fontWeight: "500",
  },
  kivalasztottdatum: {
    backgroundColor: "#6A5AE0", // Lila háttér a kiválasztott naphoz
  },
  weekDayText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  weekDayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  kivalasztottSzoveg: {
    color: "#FFFFFF", // Fehér szöveg a kiválasztott napon
  },
  vanAznapOra: {
    borderBottomWidth: 4,
    borderBottomColor: "#2EC0F9", // Kiemelés ha van óra aznap
  },
  //----------------------------------- egy soros naptár vége
  eventItem: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 40,
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
  datumSzoveg: {
    color: "#888",
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
  oraContainer: {
    margin: 20,
    backgroundColor: "#ccccff", //"#C49991", //"#5E7CE2", //"#A06CD5",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  oraTitle: {
    fontSize: 16,
    color: "black",
  },
  oraOsszeg: {
    fontSize: 24,
    color: "#32174d",
  },
});
export default Tanulo_Datumok;
