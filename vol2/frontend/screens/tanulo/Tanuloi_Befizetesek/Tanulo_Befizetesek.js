import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  RefreshControl,
} from "react-native";
import Styles from "../../../Styles";
import Ipcim from "../../../Ipcim";
import { Alert } from "react-native";
import Penz from "../../../assets/bitcoin-cash-money.svg";
import Elfogadva from "../../../assets/elfogadva.svg";
import Elutasitva from "../../../assets/elutasitva.svg";
import Elfogadasravar from "../../../assets/elfogadasravar.svg";

const Tanulo_Befizetesek = ({route } ) => {
  const { atkuld } = route.params;
  const [frissites, setFrissites] = useState(false); //https://reactnative.dev/docs/refreshcontrol
  const [befizetLista, setBefizetLista] = useState([]);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  //------------------------------------------------------------- ÚJ VÁLTOZÓK
  const [osszeg, setOsszeg] = useState("");
  const [szamologepLathatoe, setSzamologepLathatoe] = useState(false);
  //-------------------------------------------------------------
  const [tanora, setTanora] = useState(true);
  const [vizsga, setVizsga] = useState(false);
  //------------------------------------------------------------- MODAL
  const [kivalasztottTranzakcio, setKivalasztottTranzakcio] = useState(null);
  const [modalLathatoe, setModalLathatoe] = useState(false);

  const modalNyitas = (tranzakcio) => {
    setKivalasztottTranzakcio(tranzakcio);
    setModalLathatoe(true);
  };

  const modalCsukas = () => {
    setModalLathatoe(false);
    setKivalasztottTranzakcio(null);
  };
  //------------------------------------------------------------- CHECKBOX
  function SajatCheckbox({ label, isChecked, onPress }) {
    return (
      <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
        <Text style={{ fontSize: 17 }}>{label}</Text>
      </TouchableOpacity>
    );
  }

  //------------------------------------------------------------- BEFIZETÉSEK BETÖLTÉSE
  const adatokBetoltese = async () => {
    try {
      const adat = {
        felhasznalo_id: atkuld.felhasznalo_id,
      };
      if (adat) {
        const befizetesek = await fetch(Ipcim.Ipcim + "/befizetesListaT", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (!befizetesek.ok) {
          throw new Error("Hiba történt a fizetések betöltésekor!");
        }
        const befizetesekResponse = await befizetesek.json();
        setBefizetLista(befizetesekResponse);
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

  //-------------------------------------------------------------  OLDAL FRISSÍTÉSE
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
  {
    /* -------------------------------------- ÖSSZEG FELVITELE AZ ADATBÁZISBA ---------------------------------------- */
  }
  const osszegFelvitele = async () => {
    if (osszeg != 0) {
      if (osszeg.startsWith("0")) {
        Alert.alert("Hiba!", "Az összeg nem kezdődhet 0-val!", [
          {
            text: "RENDBEN",
          },
        ]);
      } else {
        const tipusID = tanora ? 1 : vizsga ? 2 : null;
        //jelenlegi idő
        const datum = new Date();
        // Dátum formázása YYYY-MM-DD HH:MM:SS formában (az adatbázisban datetimenak van beállítva!!)
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
        };

        try {
          const valasz = await fetch(Ipcim.Ipcim + "/tanuloBefizetesFelvitel", {
            method: "POST",
            body: JSON.stringify(adat),
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          });
          // Válasz szöveges formátumban, így text() metódussal dolgozunk
          const valaszText = await valasz.text();
          if (valasz.ok) {
            Alert.alert("Siker", valaszText); // A szöveget közvetlenül jelenítjük meg
          } else {
            Alert.alert(
              "Hiba",
              valaszText || "A befizetés felvitele nem sikerült."
            );
          }
        } catch (error) {
          Alert.alert("Hiba", `Hiba történt: ${error.message}`);
        }

        setOsszeg(""); //törlöm a beírt összeget a felvitel után!!!
        adatokBetoltese();
      }
    } else
      Alert.alert("Hiba!", "A befizetni kívánt összeg nem lehet 0!", [
        { text: "Értem" },
      ]);
  };
  {
    /* --------------------------------------SZÁMOLÓGÉP KINÉZET ÉS FUNKCIÓ---------------------------------------- */
  }
  const osszegMegnyomas = () => {
    setSzamologepLathatoe(!szamologepLathatoe);
  };
  // számológép gombok
  const szamologepGombNyomas = (key) => {
    if (key === "torles") {
      setOsszeg(osszeg.slice(0, -1));
    } else if (key === "C") {
      setOsszeg("");
    } else {
      setOsszeg(osszeg + key);
    }
  };
  // -------------------------------------------------------- SZÁMOLÓGÉP VIEW ----------------------------------------------------
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

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
      }
    >
      {/* --------------------------------------SZÁMOLÓGÉP---------------------------------------- */}
      {/* Figyelmeztető szöveg megváltoztatása ||függ: számológép látható-e */}
      {/*
      
      
      <View style={styles.container}>
        
        {szamologepLathatoe ? (
          <View style={styles.container2}>
            <TouchableOpacity onPress={osszegMegnyomas}>
              <Text style={styles.cim}>Kattints az összegre</Text>
              <Text style={styles.osszegBeiras}>
                {osszeg ? `${osszeg} Ft` : "0.00 Ft"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.figyelmeztetes}>
              A felvenni kívánt összeget az oktatód fogja jóváhagyni, amennyiben
              tényleg kifizetted neki!
            </Text>
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
          </View>
        ) : (
          <View style={styles.container2}>
            <TouchableOpacity onPress={osszegMegnyomas}>
              <Text style={styles.cim}>Kattints az összegre</Text>
              <Text style={styles.osszegBeiras}>
                {osszeg ? `${osszeg} Ft` : "0.00 Ft"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.figyelmeztetes}>
              Az alkalmazásban rögzített tranzakciók kizárólag szemléltető
              jellegűek, és nem vonódnak le a bankkártyádról!
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.felvetelGomb} onPress={osszegFelvitele}>
          <Text style={styles.felvetelGombSzoveg}>Összeg felvétele</Text>
        </TouchableOpacity>

        {szamologepLathatoe && szamologepBetoltes()}
      </View>
      
      */}

      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓS RÉSZ---------------------------------------- */}
      {szamologepLathatoe ? null : (
        <View style={styles.tranzakcioContainer}>
          {befizetLista.length === 0 ? (
            <View style={{ alignItems: "center" }}>
              <Penz width={100} height={100} marginTop={50} />

              <Text style={styles.nincsOra}>
                Itt láthatod majd az összes tranzakciódat, és azt, hogy el
                vannak-e fogadva!
              </Text>
            </View>
          ) : (
            <View>
              {/* <Text style={styles.tranzakcioTitle}>Legutóbbi Tranzakciók</Text> */}
              
              {befizetLista
                .sort(
                  (a, b) =>
                    new Date(b.befizetesek_ideje) -
                    new Date(a.befizetesek_ideje)
                )
                .map((item) => {
                  {
                    /* --------------------------------------JÓVÁHAGYVA---------------------------------------- */
                  }
                  if (item.befizetesek_jovahagyva == 1) {
                    if (item.befizetesek_tipusID == 1) {
                      return (
                        <View key={item.befizetesek_id}>
                          <TouchableOpacity
                            style={styles.legutobbiTranzakciok}
                            onPress={() => modalNyitas(item)}
                          >
                            <View style={styles.tranzakciosTextContainer}>
                              <Text style={styles.tranzakciosText}>
                                Tanóra díj
                              </Text>
                              <Elfogadva width={40} height={40} />
                            </View>
                            <Text style={styles.tranzakciosOsszeg}>
                              {" "}
                              - {item.befizetesek_osszeg} Ft
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                    return (
                      <View key={item.befizetesek_id}>
                          <TouchableOpacity
                            style={styles.legutobbiTranzakciok}
                            onPress={() => modalNyitas(item)}
                          >
                            <View style={styles.tranzakciosTextContainer}>
                              <Text style={styles.tranzakciosText}>
                                Vizsga díj
                              </Text>
                              <Elfogadva width={40} height={40} />
                            </View>
                            <Text style={styles.tranzakciosOsszeg}>
                              {" "}
                              - {item.befizetesek_osszeg} Ft
                            </Text>
                          </TouchableOpacity>
                        </View>
                    );
                  } else if (item.befizetesek_jovahagyva == 2) {
                    {
                      /* ELUTASÍTOTT BEFIZETÉSEK */
                    }
                    if (item.befizetesek_tipusID == 1) {
                      return (
                        <View key={item.befizetesek_id}>
                          <TouchableOpacity
                            style={styles.legutobbiTranzakciok}
                            onPress={() => modalNyitas(item)}
                          >
                            <View style={styles.tranzakciosTextContainer}>
                              <Text style={styles.tranzakciosText}>
                                Tanóra díj
                              </Text>
                              <Elutasitva width={28} height={28} />
                            </View>
                            <Text style={styles.tranzakciosOsszeg}>
                              {" "}
                              - {item.befizetesek_osszeg} Ft
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                    return (
                      <View key={item.befizetesek_id}>
                          <TouchableOpacity
                            style={styles.legutobbiTranzakciok}
                            onPress={() => modalNyitas(item)}
                          >
                            <View style={styles.tranzakciosTextContainer}>
                              <Text style={styles.tranzakciosText}>
                                Vizsga díj
                              </Text>
                              <Elutasitva width={28} height={28} />
                            </View>
                            <Text style={styles.tranzakciosOsszeg}>
                              {" "}
                              - {item.befizetesek_osszeg} Ft
                            </Text>
                          </TouchableOpacity>
                        </View>
                    );
                  } else {
                    if (item.befizetesek_tipusID == 1) {
                      return (
                        <View key={item.befizetesek_id}>
                          <TouchableOpacity
                            style={styles.legutobbiTranzakciok}
                            onPress={() => modalNyitas(item)}
                          >
                            <View style={styles.tranzakciosTextContainer}>
                              <Text style={styles.tranzakciosText}>
                                Tanóra díj
                              </Text>
                              <Elfogadasravar width={20} height={20} />
                            </View>
                            <Text style={styles.tranzakciosOsszeg}>
                              {" "}
                              - {item.befizetesek_osszeg} Ft
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                    return (
                      <View key={item.befizetesek_id}>
                          <TouchableOpacity
                            style={styles.legutobbiTranzakciok}
                            onPress={() => modalNyitas(item)}
                          >
                            <View style={styles.tranzakciosTextContainer}>
                              <Text style={styles.tranzakciosText}>
                                Vizsga díj
                              </Text>
                              <Elfogadasravar width={20} height={20} />
                            </View>
                            <Text style={styles.tranzakciosOsszeg}>
                              {" "}
                              - {item.befizetesek_osszeg} Ft
                            </Text>
                          </TouchableOpacity>
                        </View>
                    );
                  }
                })}
            </View>
          )}
        </View>
      )}
      {/*-------------------------------------------- MODAL ----------------------------------------------*/}
      {kivalasztottTranzakcio && (
        <Modal
          transparent={true}
          visible={modalLathatoe}
          onRequestClose={modalCsukas}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>TRANZAKCIÓ RÉSZLETEI</Text>
              <Text style={styles.modalText}>
                Típus:{" "}
                {kivalasztottTranzakcio.befizetesek_tipusID === 1 ? (
                  <>{"tanóra díj"}</>
                ) : (
                  <>{"vizsga díj"}</>
                )}
              </Text>
              <Text style={styles.modalText}>
                Összeg: {kivalasztottTranzakcio.befizetesek_osszeg} Ft
              </Text>
              <Text style={styles.modalText}>
                Befizetve:{" "}
                {(() => {
                  const eredetiDatum = new Date(
                    kivalasztottTranzakcio.befizetesek_ideje
                  );
                  const formazottDatum =
                    eredetiDatum.getFullYear() +
                    "." +
                    ("0" + (eredetiDatum.getMonth() + 1)).slice(-2) +
                    "." +
                    ("0" + eredetiDatum.getDate()).slice(-2) +
                    " " +
                    ("0" + eredetiDatum.getHours()).slice(-2) +
                    ":" +
                    ("0" + eredetiDatum.getMinutes()).slice(-2);
                  return formazottDatum;
                })()}
              </Text>
              <Text style={styles.modalText}>
                {kivalasztottTranzakcio.befizetesek_jovahagyva === 1 ? (
                  <>
                    <View style={styles.tranzakciosTextContainer}>
                      <Text style={styles.tranzakciosText}>
                        Befizetés elfogadva!
                      </Text>
                      <Elfogadva width={40} height={40} />
                    </View>
                  </>
                ) : kivalasztottTranzakcio.befizetesek_jovahagyva === 0 ? (
                  <>
                    <View style={styles.tranzakciosTextContainer}>
                      <Text style={styles.tranzakciosText}>
                        A befizetés elfogadásra vár!
                      </Text>
                      <Elfogadasravar width={25} height={25} />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.tranzakciosTextContainer}>
                      <Text style={styles.tranzakciosText}>
                        Befizetés elutasítva!
                      </Text>
                      <Elutasitva width={30} height={30} />
                    </View>
                  </>
                )}
              </Text>

              <TouchableOpacity
                onPress={modalCsukas}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>Bezárás</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default Tanulo_Befizetesek;
const styles = StyleSheet.create({
  nincsOra: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginTop: 20,
  },
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
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
  },
  modalCloseBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6B6054", //barnás earth vibes
    //backgroundColor: '#6A5AE0',
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#f3f0fa",
    alignItems: "center",
    padding: 20,
  },
  container2: {
    flex: 1,
    backgroundColor: "#f3f0fa",
    alignItems: "center",
    padding: 20,
  },
  cim: {
    fontSize: 24,
    fontWeight: "bold",
    //color: "#3BC14A", //zöld
    //color: "#6A5AE0", //lila
    color: "#6B6054", //earthy vibes
    marginBottom: 20,
  },
  osszegBeiras: {
    fontSize: 40,
    fontWeight: "bold",
    //color: "#3BC14A", //zöld
    //color:"#6A5AE0", //lila
    color: "#6B6054", //earthy vibes
    textAlign: "center",
    marginBottom: 10,
  },
  figyelmeztetes: {
    fontSize: 16,
    color: "#8e8e93",
    marginBottom: 5,
    textAlign: "center",
  },
  felvetelGomb: {
    backgroundColor: "#4DA167", //zöld
    //backgroundColor: "#6A5AE0", //lila
    //backgroundColor: '#FF6B6B',
    //backgroundColor: '#6B6054', //earthy vibes
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
    borderColor: "#EDE7E3",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  szamologepSzoveg: {
    fontSize: 24,
    color: "#6B6054",
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
  tranzakcioContainer: {
    backgroundColor: "#f3f0fa",
    margin: 20,
  },
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legutobbiTranzakciok: {
    flexDirection: "row",
    alignItems: "center", // Az elemek középre igazítása függőlegesen
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

  tranzakciosTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  tranzakciosText: {
    fontSize: 16,
    marginRight: 3,
  },
  tranzakciosOsszeg: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#d63031",
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
    //backgroundColor: "#FFA62B", //narancs a zöldhöz
    //borderColor: '#FFA62B' //narancs a zöldhöz
    backgroundColor: "#FFA62B",
    //borderColor: '#cae9ff'
  },
  checkboxView: {
    flexDirection: "row",
    alignContent: "space-between",
  },
});
