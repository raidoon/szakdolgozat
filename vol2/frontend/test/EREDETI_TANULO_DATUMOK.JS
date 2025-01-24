import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tanulo_Datumok = ({ atkuld }) => {
  const ma = new Date();
  const [kivalasztottDatum, setKivalasztottDatum] = useState(ma);
  const [naptarLenyitas, setNaptarLenyitas] = useState(false);

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

  const naptarToggle = () => {
    setNaptarLenyitas(!naptarLenyitas);
  };

  const NaptarHeaderBetoltes = () => {
    const honapNeve = kivalasztottDatum.toLocaleString("hu-HU", {
      month: "long",
    });
    const honapNeveNagyBetuvel = honapNeve.charAt(0).toUpperCase() + honapNeve.slice(1);
    const ev = kivalasztottDatum.getFullYear();
    return `${honapNeveNagyBetuvel} ${ev}`;
  };

  const getHonapNapjai = (ev, honap) => {
    return new Date(ev, honap + 1, 0).getDate();
  };

  const NaptariNapokGeneralasa = () => {
    const ev = kivalasztottDatum.getFullYear();
    const honap = kivalasztottDatum.getMonth();
    const honapNapjai = getHonapNapjai(ev, honap);
    return Array.from({ length: honapNapjai }, (_, i) => i + 1);
  };

  const datumMegnyomas = (nap) => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setDate(nap);
    setKivalasztottDatum(ujDatum);
  };

  const honapValtas = (irany) => {
    const ujDatum = new Date(kivalasztottDatum);
    ujDatum.setMonth(kivalasztottDatum.getMonth() + irany);
    setKivalasztottDatum(ujDatum);
  };

  const jelenlegiHet = () => {
    const hetElsoNapja = new Date(kivalasztottDatum);
    hetElsoNapja.setDate(
      kivalasztottDatum.getDate() - kivalasztottDatum.getDay() + 1
    ); // mindig hétfővel kezdje a hetet

    return Array.from({ length: 7 }, (_, i) => {
      const nap = new Date(hetElsoNapja);
      nap.setDate(hetElsoNapja.getDate() + i);
      return nap;
    });
  };

  const isToday = (datum) => {
    const ma = new Date();
    return (
      ma.getDate() === datum.getDate() &&
      ma.getMonth() === datum.getMonth() &&
      ma.getFullYear() === datum.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      {/* ------------------------------ BEZÁRT EGY SOROS NAPTÁR NÉZET -------------------------------------- */}
      {!naptarLenyitas && (
        <View style={styles.collapsedRow}>
          <Text style={styles.egysorosHonapSzoveg}>{NaptarHeaderBetoltes()}</Text>
          <View style={styles.weekRow}>
            {jelenlegiHet().map((nap) => (
              <View
                key={nap.toISOString()}
                style={[styles.weekDay, isToday(nap) && styles.maiNapHattere]}
              >
                <Text
                  style={[styles.weekDayText, isToday(nap) && styles.maiNapSzovege]}
                >
                  {nap.toLocaleString("hu-HU", { weekday: "short" })}
                </Text>
                <Text
                  style={[
                    styles.weekDayNumber,
                    isToday(nap) && styles.maiNapSzovege,
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => honapValtas(-1)}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.egysorosHonapSzoveg}>{NaptarHeaderBetoltes()}</Text>
            <TouchableOpacity onPress={() => honapValtas(1)}>
              <Ionicons name="arrow-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.napValasztas}>
            {NaptariNapokGeneralasa().map((nap) => (
              <TouchableOpacity
                key={nap}
                onPress={() => datumMegnyomas(nap)}
                style={
                  kivalasztottDatum.getDate() === nap
                    ? styles.kivalasztottdatum
                    : styles.dateItem
                }
              >
                <Text
                  style={
                    kivalasztottDatum.getDate() === nap
                      ? styles.kivalasztottSzoveg
                      : styles.datumSzoveg
                  }
                >
                  {nap}
                </Text>
              </TouchableOpacity>
            ))}
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
  },
  egysorosHonapSzoveg: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#4A4AFC"
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
    color: '#fff'
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
