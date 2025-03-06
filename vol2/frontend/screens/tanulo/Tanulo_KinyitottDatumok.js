import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import Collapsible from "react-native-collapsible";
import Styles from "../../Styles";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const TanuloKinyitottDatumok = ({
  naptarLenyitas,
  naptarToggle,
  orakLista,
  adatokBetoltese,
}) => {
  const ma = new Date();
  const [kivalasztottDatum, setKivalasztottDatum] = useState(ma);
  const [elkovetkezendoCollapsed, setElkovetkezendoCollapsed] = useState(true);
  const [teljesitettCollapsed, setTeljesitettCollapsed] = useState(true);
  const [frissites, setFrissites] = useState(false); //https://reactnative.dev/docs/refreshcontrol
  const [betolt, setBetolt] = useState(false);
  //------------------------------------------------------- MONDAT TÖMB ------------------------
  const vezetoMondatok = [
    "Nem a gyorsaság, hanem a stílus a lényeg!",
    "A gyorsulás csak akkor menő, ha a kanyar is jól sikerül.",
    "Ne csak gyorsan, hanem okosan is vezess!",
    "A kressz már megvan, úgyhogy jöhet a vezetés!",
    "A legjobb sofőr mindig tudja, hogy mikor kell lassítani.",
    "A jó vezető nem hajt, hanem uralja az utat.",
    "Ne rohanj, hanem haladj stílusosan!",
    "Vezetni menő, de biztonságban maradni még menőbb.",
    "A legjobb vezetők nem a gyorsulásban, hanem az irányításban jeleskednek.",
    "A volán mögött minden döntés számít – válaszd meg okosan!",
    "A forgalom nem akadály, hanem kihívás. Kezeld ügyesen!",
    "Ne csak a gázt pörgesd, hanem az agyad is!", //nem gáz hanem izé az a másik mutató
  ]
  const maiNap = new Date().getDate();
  const kivalasztottMondat = vezetoMondatok[(maiNap-1) % vezetoMondatok.length];
  //------------------------------------------------------- OLDAL BETÖLTÉS ------------------------
  const frissitesKozben = useCallback(() => {
    setFrissites(true);
    setBetolt(true);
    setTimeout(() => {
      adatokBetoltese();
      setFrissites(false);
      setBetolt(false);
    }, 2000);
  }, [adatokBetoltese]);
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
            <Text style={styles.betoltesText}>Az óráid betöltése folyamatban van...</Text>
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
      const oraDateString = new Date(ora.ora_datuma).toISOString().split("T")[0];
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
    const kivalasztottDatumFormazva = kivalasztottDatum.toISOString().split("T")[0];
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
            keyboardShouldPersistTaps="handled" 
            refreshControl={
              <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
            }
    >
      {/*----------------------------------- NAPONTA VÁLTOZÓ MONDATOK RÉSZE -------------------------------- */}
      <LinearGradient
        colors={["#6A5AE0", "#2EC0F9"]}
        start={{ x: 0, y: 0 }} // színátmenet iránya
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 2, // szegély
          marginHorizontal: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View style={{
          backgroundColor: "#ffffff",
          borderRadius: 18,
          padding: 20,
          alignItems: "center",
        }}>
          <Text style={{
            textAlign: "center",
            fontSize: 18,
            fontStyle: "italic",
            color: "#333",
            fontWeight: "500",
          }}>
            {kivalasztottMondat} 🚗💨
          </Text>
        </View>
      </LinearGradient>
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
                fontSize: 22,
                fontWeight: "bold",
                color: "#6A5AE0",
              },
              arrow: {
                fontSize: 20,
              },
            },
          }}
          markedDates={megjeloltNapok()}
          locale={"hu"}
        />
        {/*------------------------------ NAPTÁR KI BE NYITÓS GOMB !!! --------------------------*/}
        <TouchableOpacity onPress={naptarToggle}>
            {naptarLenyitas ? (
              <View style={Styles.naptarNyitogatoGombView2}>
                <Text style={{ color: "black", fontSize: 16 }}>
                  Naptár becsukása
                </Text>
                <Ionicons name="chevron-up-outline" size={30} color="black" />
              </View>
            ) : (
              <View style={Styles.naptarNyitogatoGombView2}>
                <Text style={{ color: "black", fontSize: 16 }}>
                  Naptár kinyitása
                </Text>
                <Ionicons name="chevron-down-outline" size={30} color="black" />
              </View>
            )}
        </TouchableOpacity>
      </View>
      {/*----------------------------------- KIVÁLASZTOTT DÁTUM RÉSZ -------------------------------- */}
      <View style={Styles.kivalasztottDatumOraView}>
        <Text style={Styles.kivalasztottDatumOraCim}>
          Órák a kiválasztott napon:
        </Text>
        {kivalasztottNapOrai.length > 0 ? (
          kivalasztottNapOrai.map((ora, index) => {
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
                ora.ora_tipusID === 1 ? `Tanóra` : `Vizsga!`;
            return (
              <View>
                 <View key={index} style={ Styles.kivalasztottDatumOraViewBelsoResze }>
                    <Ionicons name="time-outline" size={24} color="#6A5AE0" style={{
                         marginRight: 10,
                    }} />
                    <View>
                      <Text style={Styles.kivalasztottDatumOraHonapNap}>{`${honap} ${nap}`}</Text>
                      <Text style={Styles.kivalasztottDatumOraTipus}>{`${oraTipusSzoveg}`}</Text>
                    </View>
                    <Text style={Styles.kivalasztottDatumOraPerc}>{`${oraPerc}`}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={Styles.nincsOraView}>
            <Ionicons name="calendar-outline" size={40} color="#6A5AE0" />
            <Text style={Styles.nincsOraText}>
              Nincsenek órák a kiválasztott napon.
            </Text>
          </View>
        )}
      </View>
      {/*----------------------------------- ELKÖVETKEZENDŐ ÓRÁK -------------------------------- */}
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
          color="#6A5AE0"
        />
      </TouchableOpacity>
      <Collapsible collapsed={elkovetkezendoCollapsed}>
        {elkovetkezendoOra.length === 0 ? (
          <View style={Styles.nincsOraView}>
            <Text style={Styles.nincsOraText}>
              Itt fognak megjelenni azok az órák, amik még nincsenek teljesítve.
              Ezek olyan időpontok, amiket még le kell vezetned, legyen az sima
              tanóra, vagy vizsga.
            </Text>
          </View>
        ) : (
          elkovetkezendoOra.map((item, index) => {
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
              <View key={item.ora_id} style={Styles.oraElem}>
                <Text style={Styles.oraDatuma}>{honapNap}</Text>
                <Text style={Styles.oraIdeje}>{oraPerc}</Text>
              </View>
            );
          })
        )}
      </Collapsible>
      {/*----------------------------------- TELJESÍTETT ÓRÁK -------------------------------- */}
      <TouchableOpacity
        onPress={() => setTeljesitettCollapsed(!teljesitettCollapsed)}
        style={Styles.lenyiloHeader}
      >
        <Text style={Styles.lenyiloHeaderText}>Teljesített órák</Text>
        <Ionicons
          name={
            teljesitettCollapsed
              ? "chevron-down-outline"
              : "chevron-up-outline"
          }
          size={24}
          color="#6A5AE0"
        />
      </TouchableOpacity>
      <Collapsible collapsed={teljesitettCollapsed}>
        {teljesitettOra.length === 0 ? (
          <View style={Styles.nincsOraView}>
            <Text style={Styles.nincsOraText}>
              Itt fognak megjelenni azok az órák, amiket már sikeresen
              levezettél!
            </Text>
          </View>
        ) : (
          teljesitettOra.map((item, index) => {
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
              <View key={item.ora_id} style={Styles.oraElem}>
                <Text style={Styles.oraDatuma}>{honapNap}</Text>
                <Text style={Styles.oraIdeje}>{oraPerc}</Text>
              </View>
            );
          })
        )}
      </Collapsible>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 1,
    marginBottom: 50,
  },
});
export default TanuloKinyitottDatumok;