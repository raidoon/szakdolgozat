import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Styles from "../../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import Ipcim from "../../Ipcim";

const Tanulo_Befizetesek = ({atkuld}) => {
  const [befizetLista, setBefizetLista] = useState([]);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
   
  //------------------------------------------------------------- újak
  const [osszeg, setOsszeg] = useState("");
  const [szamologepLathatoe, setSzamologepLathatoe] = useState(false);

  //-----------------adatok betöltése
  const adatokBetoltese = async () =>{
    try{
      const adat = {
        felhasznalo_id: atkuld.felhasznalo_id,
      };
      if(adat){
        const befizetesek = await fetch(Ipcim.Ipcim + "/befizetesListaT", {
                  method: "POST",
                  body: JSON.stringify(adat),
                  headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        //-----------
        if (!befizetesek.ok) {
          throw new Error("Hiba történt a fizetések betöltésekor!");
        }
        const befizetesekResponse = await befizetesek.json();
        setBefizetLista(befizetesekResponse);
        console.log("befizetések eddig: ", befizetLista);
      }
    }
    catch(err){
      setHiba(err.message);
    }
    finally{
      setBetolt(false);
    }
  };
  useEffect(()=>{
    adatokBetoltese();
  },[]);
  if(betolt){
    return(
      <View style={Styles.bejelentkezes_Container}>
        <Text>Korábbi tranzakciók betöltése folyamatban...</Text>
      </View>
    );
  } 
  if(hiba){
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Hiba: {hiba}</Text>
      </View>
    );
  }

  {/* --------------------------------------TRANZAKCIÓ RÉSZLETEI---------------------------------------- */}
  const tranzakciosReszletek = ({kapott}) => {
    console.log('tranzakciós részletek megnyomva, kapott item:   ', kapott);
  };

  {/* --------------------------------------SZÁMOLÓGÉP KINÉZET ÉS FUNKCIÓ---------------------------------------- */}
  const osszegMegnyomas = () => {
    setSzamologepLathatoe(!szamologepLathatoe);
  };
  const szamologepGombNyomas = (key) => {
    if (key === "torles") {
      setOsszeg(osszeg.slice(0, -1));
    } else if (key === "C") {
      setOsszeg("");
    } else {
      setOsszeg(osszeg + key);
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
        <Text style={styles.szamologepSzoveg}>C</Text>
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
        <Text style={styles.szamologepSzoveg}>⌫</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView>
      {/* --------------------------------------SZÁMOLÓGÉP---------------------------------------- */}
      <View style={styles.container}>
        <Text style={styles.cim}>Oktatónak kifizetett összeg:</Text>
        <TouchableOpacity onPress={osszegMegnyomas}>
          <Text style={styles.osszegBeiras}>
            {osszeg ? `${osszeg} Ft` : "0.00 Ft"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.balanceInfo}> Az alkalmazásban rögzített összegek kizárólag szemléltető jellegűek, és nem vonódnak le közvetlenül a bankkártyádról! A befizetett összeget az oktatód fogja jóváhagyni, vagy elutasítani.</Text>
        
        <TouchableOpacity style={styles.felvetelGomb}>
          <Text style={styles.felvetelGombSzoveg}>Összeg felvétele</Text>
        </TouchableOpacity>
        
        {szamologepLathatoe && szamologepBetoltes()}
      </View>

      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓ---------------------------------------- */}
      <View style={styles.tranzakcioContainer}>
        <Text style={styles.tranzakcioTitle}>Legutóbbi Tranzakciók</Text>
        {befizetLista
          .sort(
            (a, b) =>
              new Date(b.befizetesek_ideje) - new Date(a.befizetesek_ideje)
          ) //dátum szerint csökkenő sorrendbe tesszük a lista elemeit
          .map((item) => {
            if (item.befizetesek_tipusID == 1) {
              return (
                <TouchableOpacity
                  style={styles.legutobbiTranzakciok}
                  key={item.befizetesek_id}
                  onPress={() => tranzakciosReszletek(item.befizetesek_id)}
                >
                  <Text style={styles.tranzakciosText}>Tanóra díj</Text>
                  <Text style={styles.tranzakciosOsszeg}>
                    {" "}
                    - {item.befizetesek_osszeg} Ft
                  </Text>
                </TouchableOpacity>
              );
            }
            return (
              <View style={styles.container}>
                <TouchableOpacity
                style={styles.legutobbiTranzakciok}
                key={item.befizetesek_id}
                >
                  <Text style={styles.tranzakciosText}>Tanóra díj</Text>
                  <Text style={styles.tranzakciosOsszeg}>
                    {" "}
                    - {item.befizetesek_osszeg} Ft
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        }
      </View>
    </ScrollView>
  );
};
export default Tanulo_Befizetesek;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f0fa",
    alignItems: "center",
    padding: 20,
  },
  cim: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5c4ce3",
    marginBottom: 20,
    marginTop: 30
  },
  osszegBeiras: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5c4ce3",
    textAlign: "center",
    marginBottom: 10,
  },
  balanceInfo: {
    fontSize: 16,
    color: "#8e8e93",
    marginBottom: 5,
    textAlign: 'center'
  },
  felvetelGomb: {
    backgroundColor: "#5c4ce3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20
  },
  felvetelGombSzoveg: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  szamologepView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  szamologepGomb: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderColor: "#dcdcdc",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  szamologepSzoveg: {
    fontSize: 24,
    color: "#5c4ce3",
    fontWeight: "bold",
  },
  tranzakcioContainer: {
    margin: 20,
  },
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legutobbiTranzakciok: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  tranzakciosText: {
    fontSize: 16,
    color: "#2d3436",
  },
  tranzakciosOsszeg: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63031",
  },
});