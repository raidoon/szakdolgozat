import React, { useState } from "react";
import {View,Text,TouchableOpacity,StyleSheet,ScrollView} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Ipcim from "../../../Ipcim";
import HibaModal from "../../../extra/HibaModal";
import SikerModal from "../../../extra/SikerModal";
const OktatonakAkarokFizetni = ({ route }) => {
  const {atkuld} = route.params;
  const [osszeg, setOsszeg] = useState("");
  const [szamologepLathatoe, setSzamologepLathatoe] = useState(false);
  const [tanora, setTanora] = useState(true);
  const [vizsga, setVizsga] = useState(false);
  //------------------------------------------------------------- MODÁLOK
  const [hibaModal, setHibaModal] = useState(false);
  const [hibaModalCim, setHibaModalCim] = useState('');
  const [hibaModalSzoveg, setHibaModalSzoveg] = useState('');
  const [sikerModal,setSikerModal] = useState(false);
  const [sikerModalCim, setSikerModalCim] = useState('');
  const [sikerModalSzoveg, setSikerModalSzoveg] = useState('');
  //------------------------------------------------------------- CHECKBOX
  function SajatCheckbox({ label, isChecked, onPress }) {
    return (
      <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
        <Text style={{ fontSize: 17 }}>{label}</Text>
      </TouchableOpacity>
    );
  }
  /* -------------------------------------- ÖSSZEG FELVITELE AZ ADATBÁZISBA ---------------------------------------- */
  const osszegFelvitele = async () => {
    if (osszeg === "" || parseFloat(osszeg) === 0) {
      setHibaModalCim("Hoppá!");
      setHibaModalSzoveg("Véletlenül 0 Ft-ot írt az összeg helyére!");
      setHibaModal(true);
      return;
    }
    else if (osszeg.startsWith("0") && osszeg !== "0") {
      setHibaModalCim("Hoppá!");
      setHibaModalSzoveg("Véletlenül 0-al kezdte a beírt összeget!");
      setHibaModal(true);
      return;
    }
    else{
      const tipusID = tanora ? 1 : vizsga ? 2 : null;
      const datum = new Date();
      const formazottDatum =
        datum.getFullYear() +
        "-" +
        ("0" + (datum.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + datum.getDate()).slice(-2) +
        " " +
        ("0" + datum.getHours()).slice(-2) +
        ":" +
        ("0" + datum.getMinutes()).slice(-2) +
        ":" +
        ("0" + datum.getSeconds()).slice(-2);
      const adat = {
        befizetesek_tanuloID: atkuld.tanulo_id, //5
        befizetesek_oktatoID: atkuld.tanulo_oktatoja, //7
        befizetesek_tipusID: tipusID, //1 vagy 2
        befizetesek_osszeg: osszeg, //összeg
        befizetesek_ideje: formazottDatum,
        befizetesek_kinek: 1, // 1=oktatónál történt befizetés
      };
      try {
        const valasz = await fetch(Ipcim.Ipcim + "/tanuloBefizetesFelvitel", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });
        if (valasz.ok) {
          setSikerModalCim("Sikeres befizetés!");
          setSikerModalSzoveg("A tranzakció sikeresen rögzítésre került az alkalmazásban! Amennyiben nem jelenik meg azonnal fizetési előzmények között, próbáljon meg ráfrissíteni!");
          setSikerModal(true);
        } else {
          setHibaModalCim("Hoppá!");
          setHibaModalSzoveg(`A befizetés nem sikerült! Kérjük próbálja meg újra!`);
          setHibaModal(true);
        }
      } catch (error) {
        setHibaModalCim("Hiba!");
        setHibaModalSzoveg(`Kérjük küldje el ezt a hibaüzenetet a fejlesztőknek: ${error.message}`);
        setHibaModal(true);
      }
      setOsszeg(""); // Törlöm a beírt összeget a felvitel után!!!
      adatokBetoltese();
    }
  };
  const szamologepBetoltes = () => (
    <View style={styles.szamologepView}>
      {[...Array(9).keys()].map((_, i) => (
        <TouchableOpacity
          key={i + 1}
          onPress={() => szamologepGombNyomas((i + 1).toString())}
          style={styles.szamologepGomb}
        >
          <Text style={styles.szamologepSzoveg}>{i + 1}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => szamologepGombNyomas("C")}
        style={styles.szamologepGomb}
      >
        <Text style={styles.szamologepSzovegC}>C</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => szamologepGombNyomas("0")}
        style={styles.szamologepGomb}
      >
        <Text style={styles.szamologepSzoveg}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => szamologepGombNyomas("torles")}
        style={styles.szamologepGomb}
      >
        <Text style={styles.szamologepSzovegDEL}>⌫</Text>
      </TouchableOpacity>
    </View>
  );
  const osszegMegnyomas = () => {
    setSzamologepLathatoe(!szamologepLathatoe);
  };
  const szamologepGombNyomas = (key) => {
    if (key === "torles") {
      setOsszeg((elozoOsszeg) => {
        const ujOsszeg = elozoOsszeg.slice(0, -1);
        return ujOsszeg;
      });
    } else if (key === "C") {
      setOsszeg("");
    } else {
      setOsszeg((elozoOsszeg) => {
        const ujOsszeg = elozoOsszeg + key;
        return ujOsszeg;
      });
    }
  };
  return (
    <LinearGradient
      colors={["#ffffff", "#f0f4ff"]}
      style={styles.lineargradientContainer}
    >
      {szamologepLathatoe ? (
        <ScrollView contentContainerStyle={{ alignContent: "center" }}>
          <View style={styles.container2}>
            {/*-------------------------------------- SZÁMOLÓGÉP LÁTHATÓ -----------------------*/}
            <Text style={styles.title}>FIGYELEM!</Text>
            <Text style={styles.subtitle}>
              Az alkalmazásban rögzített tranzakciók kizárólag szemléltető
              jellegűek, és nem vonódnak le a bankkártyádról!
            </Text>
            {/*---------------------------------- CHECKBOX --------------------------------*/}
            <View style={styles.checkboxView}>
              <SajatCheckbox
                label="Tanóra"
                isChecked={tanora}
                onPress={() => {
                  setTanora(true);
                  setVizsga(false);
                }}
              />
              <SajatCheckbox
                label="Vizsga"
                isChecked={vizsga}
                onPress={() => {
                  setVizsga(true);
                  setTanora(false);
                }}
              />
            </View>
            <TouchableOpacity onPress={osszegMegnyomas} style={styles.input}>
              <Text style={styles.osszegBeiras}>
                {osszeg ? `${osszeg} Ft` : "Összeg (Ft)"}
              </Text>
            </TouchableOpacity>
            {/*----------------------------------- FIZETÉS ELKÜLDÉSE GOMB ----------------- */}
            <TouchableOpacity
              style={styles.payButton}
              onPress={osszegFelvitele}
            >
              <LinearGradient
                colors={["#2EC0F9", "#0057FF"]}
                style={styles.gradient}
              >
                <Ionicons name="card" size={24} color="#fff" />
                <Text style={styles.payButtonText}>Fizetés elküldése</Text>
              </LinearGradient>
            </TouchableOpacity>
            {szamologepBetoltes()}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Fizetés az oktatónál</Text>
          <Text style={styles.subtitle}>
            A felvenni kívánt összeget az oktatód fogja jóváhagyni, amennyiben
            tényleg kifizetted neki!
          </Text>
          <TouchableOpacity onPress={osszegMegnyomas} style={styles.input}>
            <Text style={styles.osszegBeiras}>
              {osszeg ? `${osszeg} Ft` : "Összeg (Ft)"}
            </Text>
          </TouchableOpacity>
          {/*----------------------------------- FIZETÉS ELKÜLDÉSE GOMB ----------------- */}
          <TouchableOpacity style={styles.payButton} onPress={osszegFelvitele}>
            <LinearGradient
             colors={["#2EC0F9", "#0057FF"]}
              style={styles.gradient}
            >
              <Ionicons name="card" size={24} color="#fff" />
              <Text style={styles.payButtonText}>Fizetés elküldése</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}
      <HibaModal
            visible={hibaModal}
            onClose={()=> setHibaModal(false)}
            title={hibaModalCim}
            body={hibaModalSzoveg}
            buttonText={"Rendben"}
      />
      <SikerModal
        visible={sikerModal}
        onClose={()=>setSikerModal(false)}
        title={sikerModalCim}
        body={sikerModalSzoveg}
        buttonText={"Rendben"}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  lineargradientContainer: {
    flex: 1,
  },
  container2: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  osszegBeiras: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#6B6054", //earthy vibes
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  osszegBeiras: {
    color: "gray",
    fontSize: 18,
  },
  payButton: {
    width: "100%",
    height: 60,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  nincsOra: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginTop: 20,
  },
  cim: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B6054",
    marginBottom: 20,
  },
  figyelmeztetes: {
    fontSize: 16,
    color: "#8e8e93",
    marginBottom: 5,
    textAlign: "center",
  },
  felvetelGomb: {
    backgroundColor: "#4DA167", //zöld
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 10,
  },
  felvetelGombSzoveg: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  szamologepView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  szamologepGomb: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderColor: "#4169E1",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  szamologepSzoveg: {
    fontSize: 24,
    color: "#000080", 
    fontWeight: "bold",
  },
  szamologepSzovegC: {
    fontSize: 24,
    color: "#FFA62B",
    fontWeight: "bold",
  },
  szamologepSzovegDEL: {
    fontSize: 24,
    color: "red",
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
    borderRadius: 30,
  },
  checkedCheckbox: {
    backgroundColor: "#87CEFA",
  },
  checkboxView: {
    flexDirection: "row",
    alignContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
});
export default OktatonakAkarokFizetni;
