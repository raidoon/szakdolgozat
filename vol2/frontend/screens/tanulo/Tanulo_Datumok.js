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
    const honapNeve = kivalasztottDatum.toLocaleString("default", {
      month: "long",
    });
    const ev = kivalasztottDatum.getFullYear();
    return `${honapNeve} ${ev}`;
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

  return (
    <View style={styles.container}>

<View style={styles.header}>
        <Text style={styles.honap}>{NaptarHeaderBetoltes()}</Text>

        {/*------------------  NAPTÁRI NÉZET VÁLTÁSA NYÍL --------------------*/}

        <TouchableOpacity onPress={naptarToggle}>
          <Ionicons
            name={naptarLenyitas ? 'arrow-up' : 'arrow-down'}
            size={30}
            color="black"
          />
        </TouchableOpacity>

        {/* ---------- IDE JÖN AZ 1 SOROS NAPTÁRI VIEW !!!! */}


      </View>

      {/*--------------------------------  LENYITOTT NAPTÁRI NÉZET !!!  ---------------------------*/}
      {naptarLenyitas && (
        <View>
          {/* NAPTÁR HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => honapValtas(-1)}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.honap}>{NaptarHeaderBetoltes()}</Text>
            <TouchableOpacity onPress={() => honapValtas(1)}>
              <Ionicons name="arrow-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* NAPOK KIVÁLASZTÁSA A NAPTÁRBÓL */}
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

      {/* ÓRA LISTA */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  honap: {
    fontSize: 20,
    fontWeight: "bold",
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
});

export default Tanulo_Datumok;
