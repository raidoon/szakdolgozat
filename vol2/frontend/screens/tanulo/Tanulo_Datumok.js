import React, { useState, useEffect, useCallback } from "react";
import {View,Text,StyleSheet,FlatList,TouchableOpacity,RefreshControl,ScrollView,} from "react-native";
import {Calendar,CalendarList,Agenda,LocaleConfig,} from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";
import TanuloKinyitottDatumok from "./Tanulo_KinyitottDatumok";
import { ActivityIndicator } from 'react-native';
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
      const oraAdat = {
        ora_diakja: atkuld.tanulo_id,
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
        if (oraAdat) {
          //---------- a következő óra időpontja
          const ora = await fetch(Ipcim.Ipcim + "/tanuloKovetkezoOraja", {
            method: "POST",
            body: JSON.stringify(oraAdat),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
          const oraResponse = await ora.json();
          setKoviOra(oraResponse);
        }
      }
    } catch (err) {
      setHiba(err.message);
    } finally {
      setBetolt(false);
    }
  };
  useEffect(() => {
    adatokBetoltese();
  }, []);
  //------------------------------------------------------------- OLDAL FRISSÍTÉSE
  const frissitesKozben = useCallback(() => {
    setFrissites(true);
    setBetolt(true);
    setTimeout(() => {
      adatokBetoltese();
      setFrissites(false);
      setBetolt(false);
    }, 2000);
  }, []);
  //-------------------------
  if (betolt) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
         <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.betoltesText}>Az óráid betöltése folyamatban van. Kérjük, légy türelemmel...</Text>
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
  const maiNap = (datum) => {
    const ma = new Date();
    return (
      datum.getFullYear() === ma.getFullYear() &&
      datum.getMonth() === ma.getMonth() &&
      datum.getDate() === ma.getDate()
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
  const jelenlegiHet = () => {
    const hetElsoNapja = new Date(kivalasztottDatum);
    hetElsoNapja.setDate(
      kivalasztottDatum.getDate() - kivalasztottDatum.getDay()
    ); // mindig vasárnappal kezdjük a hetet, mert ha nem az elején van, akkor nem fogja normálisan bevenni a kattintást (valamiért a vasárnap a 0. nap a JS-ben)

    return Array.from({ length: 7 }, (_, i) => {
      const nap = new Date(hetElsoNapja);
      nap.setDate(hetElsoNapja.getDate() + i);
      return nap;
    }).filter(Boolean); // töröljük a null értékeket
  };
  const balraGombMegnyomas = () => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setDate(kivalasztottDatum.getDate() + 7); // 7 nappal előre
    setKivalasztottDatum(ujDatum);
  };
  const jobbraGombMegnyomas = () => {
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
              <TouchableOpacity onPress={jobbraGombMegnyomas}>
                <Ionicons name="chevron-back-outline" size={30} color="black" />
              </TouchableOpacity>

              {jelenlegiHet().map((nap) => {
                const hetvege = nap.getDay() === 0 || nap.getDay() === 6; // Vasárnap vagy Szombat
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
                      hetvege && !kivalasztottDatum
                        ? styles.weekendDay // Hétvégéknek piros háttér
                        : styles.weekDay,
                      nap.toDateString() === kivalasztottDatum.toDateString() &&
                        styles.kivalasztottdatum, // Selected date style
                      maiNap(nap) &&
                        nap.toDateString() !==
                          kivalasztottDatum.toDateString() &&
                        styles.maiDatum, // Today's date style (if not selected)
                      hetvege && styles.weekendDayText, // Hétvégéknek piros szöveg
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
                        hetvege && styles.weekendDayText,
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
                        hetvege &&
                          nap.toDateString() !==
                            kivalasztottDatum.toDateString() &&
                          styles.weekDayNumber,
                      ]}
                    >
                      {nap.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity onPress={balraGombMegnyomas}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/*------------------------------ NAPTÁR KI BE NYITÓS GOMB !!! --------------------------*/}
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
                <Text style={{ color: "black", fontSize: 16 }}>
                  Naptár kinyitása
                </Text>
                <Ionicons name="chevron-down-outline" size={30} color="black" />
              </View>
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
                minHeight: 50,
              }}
            >
              <View>
                <Text style={styles.oraTitle}>Következő óra:</Text>
                <Text style={styles.oraOsszeg}>
                  {koviOra.length > 0
                    ? koviOraFormazasa(koviOra[0].ora_datuma)
                    : "Jelenleg nincs beírva következő óra!"}
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
            <Text style={styles.tranzakcioTitle}>
              Órák a kiválaszott napon:
            </Text> // itt íródik ki a szöveg, ha van óra
          ) : (
            <Text style={styles.tranzakcioTitle}>
              Órák a kiválaszott napon:
            </Text>
          )}
          {/* Az órák listázása */}
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
              // A kiválasztott dátum óráinak megjelenítése
              const date = new Date(item.ora_datuma);
              // A hónap rövid neve (pl. "FEB") és a nap (pl. "03")
              const honap = date
                .toLocaleDateString("hu-HU", { month: "short" })
                .toUpperCase(); // Rövid hónapnév
              const nap = date.toLocaleDateString("hu-HU", { day: "2-digit" });
              const oraPerc = date.toLocaleTimeString("hu-HU", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              //meghatározzuk, hogy az adott óra egy tanóra, vagy pedig vizsga lesz!
              const oraTipusSzoveg =
                item.ora_tipusID === 1 ? `Tanóra` : `Vizsga!`;
              if (
                kivalasztottDatum &&
                date.getFullYear() === kivalasztottDatum.getFullYear() &&
                date.getMonth() === kivalasztottDatum.getMonth() &&
                date.getDate() === kivalasztottDatum.getDate()
              ) {
                return (
                  <View key={item.ora_id} style={[styles.OraView]}>
                    <View>
                      <Text style={styles.oraBaloldal}>{`${honap}`}</Text>
                      <Text style={styles.oraBaloldal}>{`${nap}`}</Text>
                    </View>
                    <Text
                      styles={styles.oraKozepsoResz}
                    >{`${oraTipusSzoveg}`}</Text>
                    <Text style={styles.oraJobbOldal}>{`${oraPerc}`}</Text>
                  </View>
                );
              }
            })
          ) : (
            <Text style={styles.nincsOra}>
              {kivalasztottDatum.getDate() <= 5 &&
              kivalasztottDatum.getDate() >= new Date().getDate()
                ? `${kivalasztottDatum.getDate()}${
                    [1, 4, 5, 21, 31].includes(kivalasztottDatum.getDate() % 10)
                      ? ".-én"
                      : [2, 3, 22, 23].includes(
                          kivalasztottDatum.getDate() % 10
                        )
                      ? ".-án"
                      : ".-án"
                  } egyelőre üres a napod, de ne izgulj, biztosan jön majd valami! 😎✨`
                : kivalasztottDatum.getDate() > 5 &&
                  kivalasztottDatum.getDate() >= new Date().getDate()
                ? `${kivalasztottDatum.getDate()}${
                    [1, 2, 4, 5, 7, 9, 10, 21, 31].includes(
                      kivalasztottDatum.getDate() % 10
                    ) || kivalasztottDatum.getDate() === 10
                      ? ".-én"
                      : [3, 22, 23].includes(kivalasztottDatum.getDate() % 10)
                      ? ".-án"
                      : ".-án"
                  } nincs órád, úgyhogy ne felejts el pihenni! 😊👌`
                : `${kivalasztottDatum.getDate()}${
                    [1, 4, 5, 21, 31].includes(kivalasztottDatum.getDate() % 10)
                      ? ".-én"
                      : [2, 3, 22, 23].includes(
                          kivalasztottDatum.getDate() % 10
                        )
                      ? ".-án"
                      : ".-án"
                  } nem volt órád.`}
            </Text>
          )}
        </View>
      )}
      {/* ------------------------------------------- KINYITOTT NAGY NAPTÁR NÉZET -------------------------------- */}
      {naptarLenyitas && (
        <TanuloKinyitottDatumok
          naptarLenyitas={naptarLenyitas}
          naptarToggle={naptarToggle}
          orakLista={orakLista}
          styles={styles}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  betoltesText:{
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  kalendar: {
    marginTop: 0,
  },
  elkovetkezendoOrakView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 20
  },
  elkovetkezendoOrakText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  OraView: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  elkovetkezendoOraCim: {
    fontSize: 16,
    fontWeight: "bold",
  },
  elkovetkezendoOraIdeje: {
    fontSize: 14,
    color: "#666",
  },
  oraTitle: {
    fontSize: 16,
    color: "#6A5AE0",
    fontWeight: "500",
  },
  oraOsszeg: {
    fontSize: 20,
    color: "#2d3436",
    fontWeight: "600",
    marginTop: 5,
  },
  //------------------------------------ a mai dátum is legyen olyan hátteres mint a kiválasztott, de más színnel
  maiDatum: {
    backgroundColor: "#E6E6FA",
    borderRadius: 15,
    minWidth: 40,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  //----------------------------------- egy soros naptár
  egysorosHonapSzoveg: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6A5AE0", //lila
  },
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  collapsedRow: {
    width: "auto",
    backgroundColor: "#FFFFFF",
    height: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
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
    minWidth: 40,
    height: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#6A5AE0",
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
    color: "#FFFFFF",
  },
  vanAznapOra: {
    borderBottomWidth: 4,
    borderBottomColor: "#2EC0F9",
  },
  //----------------------------------- egy soros naptár vége
  OraView: {
    margin: 10,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#fff",
    elevation: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 90,
  },
  oraBaloldal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    flex: 1,
    textAlign: "center",
  },
  oraKozepsoResz: {
    backgroundColor: "green",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    flex: 1,
    textAlign: "center",
  },
  oraJobbOldal: {
    fontSize: 18,
    color: "#555",
    textAlign: "right",
  },
  //-------------- óra view vége
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
    fontSize: 16,
  },
  kibenyitogomb: {
    alignSelf: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#ccccff",
    borderRadius: 30,
    alignItems: "center",
    textAlign: "center",
  },
  oraContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 20,
  },
});
export default Tanulo_Datumok;