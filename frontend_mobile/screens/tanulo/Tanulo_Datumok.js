import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Modal
} from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import Collapsible from "react-native-collapsible";
import Styles from "../../Styles";
import { LinearGradient } from "expo-linear-gradient";
import Ipcim from "../../Ipcim";

const Tanulo_Datumok = ({ atkuld }) => {
  const ma = new Date();
  const [kivalasztottDatum, setKivalasztottDatum] = useState(ma);
  const [elkovetkezendoCollapsed, setElkovetkezendoCollapsed] = useState(true);
  const [teljesitettCollapsed, setTeljesitettCollapsed] = useState(true);
  const [orakLista, setOrakLista] = useState([]);
  const [koviOra, setKoviOra] = useState([]);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [frissites, setFrissites] = useState(false);
  const [modalLathatoe,setModalLathatoe] = useState(false);
  const adatokBetoltese = async () => {
    try {
      const adat = {
        felhasznalo_id: atkuld.felhasznalo_id,
      };
      const oraAdat = {
        ora_diakja: atkuld.tanulo_id,
      };

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

      const ora = await fetch(Ipcim.Ipcim + "/tanuloKovetkezoOraja", {
        method: "POST",
        body: JSON.stringify(oraAdat),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      const oraResponse = await ora.json();
      setKoviOra(oraResponse);
    } catch (err) {
      setHiba(err.message);
    } finally {
      setBetolt(false);
      setFrissites(false);
    }
  };

  useEffect(() => {
    adatokBetoltese();
  }, []);

  const frissitesKozben = useCallback(() => {
    setFrissites(true);
    setBetolt(true);
    adatokBetoltese().finally(() => {
      setFrissites(false);
      setBetolt(false);
    });
  }, []);
  //---------------------------------- DÁTUM FORMÁZÁSA AZ ÓRÁHOZ
  const koviOraFormazasa = (adatBresponseJSON) => {
    const datum = new Date(adatBresponseJSON);
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
    const ora = datum.getHours();
    const perc = datum.getMinutes().toString().padStart(2, "0");
    return `${honap} ${nap} - ${ora}:${perc} óra`;
  };
  if (betolt) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.betoltesText}>
          Az óráid betöltése folyamatban van. Kérjük, légy türelemmel...
        </Text>
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
  const megjeloltNapok = () => {
    const megjelolve = {};
    orakLista.forEach((item) => {
      const datum = new Date(item.ora_datuma);
      const datumSzoveggeAlakitva = datum.toISOString().split("T")[0];
      megjelolve[datumSzoveggeAlakitva] = {
        marked: true,
        dotColor: "#2EC0F9",
      };
    });

    const kivalasztottDatumMegjelolve = kivalasztottDatum
      .toISOString()
      .split("T")[0];

    const vanEoraAkivalasztottNapon = orakLista.some((ora) => {
      const oraDateString = new Date(ora.ora_datuma)
        .toISOString()
        .split("T")[0];
      return oraDateString === kivalasztottDatumMegjelolve;
    });

    megjelolve[kivalasztottDatumMegjelolve] = {
      selected: true,
      marked: vanEoraAkivalasztottNapon,
      dotColor: vanEoraAkivalasztottNapon ? "#2EC0F9" : undefined,
    };

    return megjelolve;
  };
  const datumMegnyomas = (day) => {
    const ujDatum = new Date(day.dateString);
    setKivalasztottDatum(ujDatum);
  };
  const orakKulonvalasztasa = () => {
    const elkovetkezendoOra = [];
    const teljesitettOra = [];

    orakLista.forEach((ora) => {
      const oraIdopontja = new Date(ora.ora_datuma);
      if (oraIdopontja > ma) {
        elkovetkezendoOra.push(ora);
      } else {
        teljesitettOra.push(ora);
      }
    });
    return { elkovetkezendoOra, teljesitettOra };
  };
  const { elkovetkezendoOra, teljesitettOra } = orakKulonvalasztasa();
  const vanEoraAkivalasztottNapon = () => {
    const kivalasztottDatumFormazva = kivalasztottDatum
      .toISOString()
      .split("T")[0];
    return orakLista.filter((ora) => {
      const oraFormazva = new Date(ora.ora_datuma).toISOString().split("T")[0];
      return oraFormazva === kivalasztottDatumFormazva;
    });
  };
  const kivalasztottNapOrai = vanEoraAkivalasztottNapon();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
      }
    >
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
      {/*----------------------------------- NAPTÁR RÉSZ -------------------------------- */}
      <View style={Styles.naptarView}>
        <Calendar
          style={Styles.naptar}
          onDayPress={(nap) => {
            datumMegnyomas(nap);
          }}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          current={kivalasztottDatum.toISOString().split("T")[0]}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#0077B6",
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
                fontSize: 22,
                fontWeight: "bold",
                color: "#0047AB",
              },
              arrow: {
                fontSize: 20,
              },
            },
          }}
          markedDates={megjeloltNapok()}
          locale={"hu"}
        />
      </View>

      {/*----------------------------------- KIVÁLASZTOTT DÁTUM RÉSZ -------------------------------- */}
      <View style={Styles.kivalasztottDatumOraView}>
        <Text style={Styles.kivalasztottDatumOraCim}>
          Órák a kiválasztott napon:
        </Text>
        {kivalasztottNapOrai.length > 0 ? (
          kivalasztottNapOrai.map((ora) => {
            // A kiválasztott dátum óráinak megjelenítése
            const date = new Date(ora.ora_datuma);
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
            const oraTipusSzoveg =
              ora.ora_tipusID === 1 ? `Gyakorlati óra` : `Vizsga!`;
            const hetvege = date.getDay() === 0 || date.getDay() === 6;
            return (
              <View
                key={ora.ora_id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 15,
                  padding: 16,
                  marginHorizontal: 20,
                  marginVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 5,
                  borderWidth: 6,
                  borderColor: ora.ora_tipusID === 1 ? "#6495ED" : "#FF6B6B",
                }}
              >
                <Ionicons
                  name={
                    ora.ora_tipusID === 1
                      ? "car-sport-outline"
                      : "school-outline"
                  }
                  size={30}
                  color={ora.ora_tipusID === 1 ? "#2EC0F9" : "#0057FF"}
                  style={{ marginRight: 12 }}
                />
                {hetvege ? (
                  <View>
                    <Text
                      style={Styles.kivalasztottDatumOraHonapNapHetvege}
                    >{`${honap} ${nap}`}</Text>
                    <Text
                      style={Styles.kivalasztottDatumOraTipus}
                    >{`${oraTipusSzoveg}`}</Text>
                  </View>
                ) : (
                  <View>
                    <Text
                      style={Styles.kivalasztottDatumOraHonapNap}
                    >{`${honap} ${nap}`}</Text>
                    <Text
                      style={Styles.kivalasztottDatumOraTipus}
                    >{`${oraTipusSzoveg}`}</Text>
                  </View>
                )}
                <Text
                  style={[
                    Styles.kivalasztottDatumOraPerc,
                    { color: "#2EC0F9", fontWeight: "600" },
                  ]}
                >{`${oraPerc}`}</Text>
              </View>
            );
          })
        ) : (
          <View style={Styles.nincsOraView}>
            <Ionicons name="calendar-outline" size={40} color="#2EC0F9" />
            <Text style={Styles.nincsOraText}>
              Nincsenek órák a kiválasztott napon.
            </Text>
          </View>
        )}
      </View>
      {/*----------------------------------- ELKÖVETKEZENDŐ ÓRÁK LENYÍTÓJA -------------------------------- */}
      <TouchableOpacity
        onPress={() => setElkovetkezendoCollapsed(!elkovetkezendoCollapsed)}
        style={Styles.lenyiloHeader}
      >
        <Text style={Styles.lenyiloHeaderText}>Elkövetkezendő órák</Text>
        <Ionicons
          name={
            elkovetkezendoCollapsed
              ? "chevron-down-outline"
              : "chevron-up-outline"
          }
          size={24}
          color="#3A86FF"
        />
      </TouchableOpacity>
      {/*----------------------------------- ELKÖVETKEZENDŐ ÓRÁK FELSOROLÁSA -------------------------------- */}
      <Collapsible collapsed={elkovetkezendoCollapsed}>
        {elkovetkezendoOra.length === 0 ? (
          <View style={Styles.nincsOraView}>
            <Text style={Styles.nincsOraText}>
              Itt fognak megjelenni azok az órák, amik még nincsenek teljesítve.
              Ezek olyan időpontok, amiket még le kell vezetned, legyen az
              gyakorlati óra, vagy vizsga.
            </Text>
          </View>
        ) : (
          elkovetkezendoOra
            .sort(
              (a, b) => new Date(a.ora_datuma) - new Date(b.ora_datuma) //növekvő sorrend
            )
            .map((item) => {
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
              return (
                //<TouchableOpacity onPress={()=> setModalLathatoe(true)}>
                  <LinearGradient
                    colors={["#4169E1", "#2EC0F9"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 15,
                      padding: 2,
                      marginHorizontal: 20,
                      marginBottom: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                    key={item.ora_id}
                    
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        borderRadius: 13,
                        padding: 12,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={25}
                          color="#4169E1"
                          style={{ marginRight: 10 }}
                        />
                        <View>
                          <Text style={Styles.oraDatuma}>{honapNap}</Text>
                          <Text style={Styles.oraIdeje}>
                            {item.ora_tipusID === 1
                              ? "Gyakorlati óra"
                              : "Vizsga"}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#2EC0F9",
                        }}
                      >
                        {oraPerc}
                      </Text>
                    </View>
                  </LinearGradient>
                //</TouchableOpacity>
              );
            })
        )}
      </Collapsible>
      {/*----------------------------------- TELJESÍTETT ÓRÁK LENYÍLÓJA -------------------------------- */}
      <TouchableOpacity
        onPress={() => setTeljesitettCollapsed(!teljesitettCollapsed)}
        style={Styles.lenyiloHeader}
      >
        <Text style={Styles.lenyiloHeaderText}>Teljesített órák</Text>
        <Ionicons
          name={
            teljesitettCollapsed ? "chevron-down-outline" : "chevron-up-outline"
          }
          size={24}
          color="#3A86FF"
        />
      </TouchableOpacity>
      {/*----------------------------------- TELJESÍTETT ÓRÁK FELSOROLÁSA -------------------------------- */}
      <Collapsible collapsed={teljesitettCollapsed}>
        {teljesitettOra.length === 0 ? (
          <View style={Styles.nincsOraView}>
            <Text style={Styles.nincsOraText}>
              Itt fognak megjelenni azok az órák, amiket már sikeresen
              levezettél!
            </Text>
          </View>
        ) : (
          teljesitettOra
            .sort(
              (a, b) => new Date(b.ora_datuma) - new Date(a.ora_datuma) //csökkenő
            )
            .map((item) => {
              const datum = new Date(item.ora_datuma);
              const honapNap = datum
                .toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, ".");
              const oraPerc = datum.toLocaleTimeString("hu-HU", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              return (
                <View
                  key={item.ora_id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f8f8f8",
                    borderRadius: 10,
                    padding: 12,
                    marginHorizontal: 20,
                    marginBottom: 20,
                    borderLeftWidth: 4,
                    borderLeftColor: "#4169E1",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#4169E1"
                      style={{ marginRight: 8 }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "#555",
                        }}
                      >
                        {honapNap}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#777",
                        }}
                      >
                        {item.ora_tipusID === 1 ? "Gyakorlati óra" : "Vizsga"}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#4169E1",
                    }}
                  >
                    {oraPerc}
                  </Text>
                </View>
              );
            })
        )}
      </Collapsible>
      {/*--------------------------------------------------- MODAL ------------------------------------- */}
      <Modal
        transparent={true}
        visible={modalLathatoe}
        onRequestClose={()=> setModalLathatoe(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ÓRA RÉSZLETEI</Text>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.modalKiemeltText}>Típus: </Text>
              
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.modalKiemeltText}>Összeg: </Text>
              
            </View>

            <View style={{ flexDirection: "row" }}>
            <Text style={styles.modalKiemeltText}>Összeg: </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.modalKiemeltText}>Összeget megkapta: </Text>
              
            </View>

            
            <TouchableOpacity
              onPress={()=>setModalLathatoe(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Bezárás</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
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
  oraTitle: {
    fontSize: 16,
    color: "#0096FF",
    fontWeight: "500",
  },
  oraOsszeg: {
    fontSize: 20,
    color: "#2d3436",
    fontWeight: "600",
    marginTop: 5,
  },
  //---------------------------- MODÁL KEZDETE
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalKiemeltText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
    fontWeight: "800",
    color: "#2575fc",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
  },
  modalCloseBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2575fc",
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  //------------------------------- MODÁL VÉGE
});
export default Tanulo_Datumok;
