import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import Collapsible from "react-native-collapsible";
import Styles from "../../Styles";

const TanuloKinyitottDatumok = ({
  naptarLenyitas,
  naptarToggle,
  orakLista,
}) => {
  const ma = new Date();
  const [kivalasztottDatum, setKivalasztottDatum] = useState(ma);
  const [elkovetkezendoCollapsed, setElkovetkezendoCollapsed] = useState(true);
  const [teljesitettCollapsed, setTeljesitettCollapsed] = useState(true);

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
    <ScrollView style={styles.container}>
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
            const oraIdopontja = new Date(ora.ora_datuma);
            const oraIdo = oraIdopontja.toLocaleTimeString("hu-HU", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            return (
              <View key={index} style={Styles.kivalasztottDatumOsztalyElem}>
                <View style={Styles.oszatlyIcon}>
                  <Ionicons name="time-outline" size={20} color="#6A5AE0" />
                </View>
                <View style={Styles.osztalyReszletek}>
                  <Text style={Styles.osztalyNev}>ide jön az óra típusa/dátuma</Text>
                  <Text style={Styles.osztalyIdopont}>{oraIdo}</Text>
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
    paddingHorizontal: 1
  },
});
export default TanuloKinyitottDatumok;