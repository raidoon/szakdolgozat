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
  const [elkovetkezendoCollapsed, setElkovetkezendoCollapsed] = useState(true);
  const [teljesitettCollapsed, setTeljesitettCollapsed] = useState(true);
  const megjeloltNapok = () => {
    const megjelolve = {};
    orakLista.forEach((item) => {
      const datum = new Date(item.ora_datuma);
      const datumSzoveggeAlakitva = datum.toISOString().split("T")[0];
      megjelolve[datumSzoveggeAlakitva] = { 
        marked: true,
        //dotColor: "#6A5AE0",
        //activeOpacity: 0,
      };
    });
    // Hozzáadjuk a kiválasztott dátumot a megjelölt dátumokhoz
    const kivalasztottDatumMegjelolve = kivalasztottDatum
      .toISOString()
      .split("T")[0];
    megjelolve[kivalasztottDatumMegjelolve] = { 
      selected: true, 
      marked: true,
      //dotColor: "#6A5AE0",
      //activeOpacity: 0,
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
    //----------------------------------- ha az óra időpontja korábban van, mint a jelenlegi idő, akkor a teljesített órákhoz adjuk,
    //----------------------------------- ha később, akkor a még hátralévő órákhoz
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
  return (
    <ScrollView>
      <View style={{ marginTop: 20 }}>
        <Calendar
          style={styles.kalendar}
          onDayPress={(nap) => {
            console.log("kiválasztott dátum:", nap);
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
        onPress={() => setElkovetkezendoCollapsed(!elkovetkezendoCollapsed)}
      >
        <View style={styles.elkovetkezendoOrakView}>
          <Text style={styles.elkovetkezendoOrakText}>Elkövetkezendő Órák</Text>
          <Ionicons
            name={
              elkovetkezendoCollapsed
                ? "chevron-down-outline"
                : "chevron-up-outline"
            }
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={elkovetkezendoCollapsed}>
        {elkovetkezendoOra.length === 0 ? (
           <View style={{ alignItems: "center",minHeight: 100}}>
            {/*<Penz width={100} height={100} />*/}

            <Text style={styles.nincsOra}>
              Itt fognak megjelenni azok az órák, amik még nincsenek teljesítve. Ezek olyan időpontok, amiket még le kell vezetned, legyen az sima tanóra, vagy vizsga.
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
            const hatterszinTomb = ["#FDEEDC", "#D6EFFF", "#F5D8E8", "#E8DFF5"];
            const hatterszinAzOraknak =
              hatterszinTomb[index % hatterszinTomb.length];
            return (
              <View
                key={item.ora_id}
                style={[
                  styles.OraView,
                  { backgroundColor: hatterszinAzOraknak },
                ]}
              >
                <Text style={styles.elkovetkezendoOraCim}>{`${honapNap}`}</Text>
                <Text
                  style={styles.elkovetkezendoOraIdeje}
                >{` ${oraPerc}`}</Text>
              </View>
            );
          })
        )}
      </Collapsible>
      {/*----------------------------------- MÁR TELJESÍTETT ÓRÁK -------------------------------- */}
      <TouchableOpacity
        onPress={() => setTeljesitettCollapsed(!teljesitettCollapsed)}
      >
        <View style={styles.elkovetkezendoOrakView}>
          <Text style={styles.elkovetkezendoOrakText}>Teljesített órák</Text>
          <Ionicons
            name={
              teljesitettCollapsed
                ? "chevron-down-outline"
                : "chevron-up-outline"
            }
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={teljesitettCollapsed}>
        {teljesitettOra.length === 0 ? (
          <View style={{ alignItems: "center",minHeight: 100}}>
          {/*<Penz width={100} height={100} />*/}

          <Text style={styles.nincsOra}>
          Itt fognak megjelenni azok az órák, amiket már sikeresen levezettél!
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

            const hatterszinTomb = ["#FDEEDC", "#D6EFFF", "#F5D8E8", "#E8DFF5"];
            const hatterszinAzOraknak =
              hatterszinTomb[index % hatterszinTomb.length];
            return (
              <View
                key={item.ora_id}
                style={[
                  styles.OraView,
                  { backgroundColor: hatterszinAzOraknak },
                ]}
              >
                <Text style={styles.elkovetkezendoOraCim}>{`${honapNap}`}</Text>
                <Text
                  style={styles.elkovetkezendoOraIdeje}
                >{` ${oraPerc}`}</Text>
              </View>
            );
          })
        )}
      </Collapsible>
    </ScrollView>
  );
};
export default TanuloKinyitottDatumok;
