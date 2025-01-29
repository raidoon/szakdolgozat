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
import Ipcim from "../../Ipcim";

const Tanulo_Datumok = ({ atkuld }) => {
  const ma = new Date();
  const maMegformazva = ma
    .toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");

  const [kivalasztottDatum, setKivalasztottDatum] = useState(ma);
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
  //------------------------------------------------------------- A TANULÓ ÓRÁINAK BETÖLTÉSE
  const adatokBetoltese = async () => {
    try {
      const adat = {
        ora_diakja: atkuld.ora_diakja,
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
        console.log("órák eddig: ", orakValasz);
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
        {honapNeveNagyBetuvel} {ev}
      </Text>
    );
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

      // bebiztosítjuk, hogy a generált napok a hónapon belül maradnak
      if (nap.getMonth() !== kivalasztottDatum.getMonth()) {
        return null; // kihagyjuk azokat a napokat, amik már nincsenek a hónapban
      }
      return nap;
    }).filter(Boolean); // töröljük a null értékeket
  };
  const maVanMa = (datum) => {
    if (!datum) return false; // biztosítjuk, hogy a dátum nem ad vissza rossz értéket
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
      }
    >
      {/* ------------------------------ BEZÁRT EGY SOROS NAPTÁR NÉZET -------------------------------------- */}
      {!naptarLenyitas && (
        <View style={styles.collapsedRow}>
          <View style={styles.weekRow}>
            {jelenlegiHet().map((nap) => {
              const hasClass = orakLista.some((item) => {
                const date = new Date(item.ora_datuma);
                return (
                  date.getFullYear() === nap.getFullYear() &&
                  date.getMonth() === nap.getMonth() &&
                  date.getDate() === nap.getDate()
                );
              });
              const isSelected =
                kivalasztottDatum &&
                nap.getFullYear() === kivalasztottDatum.getFullYear() &&
                nap.getMonth() === kivalasztottDatum.getMonth() &&
                nap.getDate() === kivalasztottDatum.getDate();
              {
                /*------------------------------ NAPTÁR KI BE NYITÓS GOMB !!! --------------------------*/
              }
              return (
                <TouchableOpacity
                  key={nap.toISOString()}
                  style={[
                    styles.weekDay,
                    isSelected ? styles.selectedDay : null,
                    maVanMa(nap) && styles.maiNapHattere,
                    hasClass && styles.hasClass,
                  ]}
                  onPress={() => setKivalasztottDatum(nap)}
                >
                  <Text
                    style={[
                      styles.weekDayText,
                      isSelected ? styles.selectedText : null,
                      maVanMa(nap) && styles.maiNapSzovege,
                    ]}
                  >
                    {nap.toLocaleString("hu-HU", { weekday: "short" })}
                  </Text>
                  <Text
                    style={[
                      styles.weekDayNumber,
                      isSelected ? styles.selectedText : null,
                      maVanMa(nap) && styles.maiNapSzovege,
                    ]}
                  >
                    {nap.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity onPress={naptarToggle} style={styles.kibenyitogomb}>
            {naptarLenyitas ? (
              <Ionicons name="chevron-up-outline" size={30} color="white" />
            ) : (
              <Ionicons name="chevron-down-outline" size={30} color="white" />
            )}
          </TouchableOpacity>
          {orakLista.some((item) => {
            const date = new Date(item.ora_datuma);
            return (
              kivalasztottDatum &&
              date.getFullYear() === kivalasztottDatum.getFullYear() &&
              date.getMonth() === kivalasztottDatum.getMonth() &&
              date.getDate() === kivalasztottDatum.getDate()
            );
          }) ? (
            orakLista.map((item) => {
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
                return (
                  <View
                    key={item.ora_id}
                    //style={[styles.maddingespadding, { backgroundColor: item.color }]}
                    style={[styles.eventItem, { backgroundColor: item.color }]}
                  >
                    {/**
                     * <Text style={styles.oraCim}>{item.cim}</Text>
                     * <Text style={styles.oraIdeje}>{`${honapNap} ${oraPerc}`}</Text>
                     */}

                    <Text style={styles.eventTitle}>{item.cim}</Text>
                    <Text style={styles.eventTime}>{`${honapNap} ${oraPerc}`}</Text>
                  </View>
                );
              }
            })
          ) : (
            <Text style={styles.nincsOra}>
              {`A kiválasztott napon nem lesz órád, úgyhogy ne felejts el pihenni! :)`}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#555',
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  collapsedRow: {
    marginBottom: 20,
    marginTop: 27.5,
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
    //color: '#ccccff'
    //backgroundColor: 'gray',
    backgroundColor: "#e9e8ee",
    borderRadius: 15,
    minWidth: 40,
  },
  weekDayText: {
    fontSize: 20,
    //color: "#888",
    //color: '#ccccff'
    color: "#153243",
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
    //backgroundColor: '#8F95D3',
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
