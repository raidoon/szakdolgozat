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

const Tanulo_Befizetesek = ({ route }) => {
  const { atkuld } = route.params;
  const [frissites, setFrissites] = useState(false); //https://reactnative.dev/docs/refreshcontrol
  const [befizetLista, setBefizetLista] = useState([]);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
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
  //------------------------------------------------------------- FIZETÉSI IKON LEKÉRDEZÉSE
  const FizetesiIkonKivalasztas = (status) => {
    switch (status) {
      case 1:
        return <Elfogadva width={40} height={40} />; //<Ionicons name="checkmark-circle" size={20} color="#4CAF50" />; // Jóváhagyva
      case 2:
        return <Elutasitva width={28} height={28} />; //<Ionicons name="close-circle" size={20} color="#F44336" />; // Elutasítva
      default:
        return <Elfogadasravar width={20} height={20} />; //<Ionicons name="time" size={20} color="#FFA000" />; // Függőben
    }
  };
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

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
      }
    >
      {/* --------------------------------------------- FIZETÉSI ELŐZMÉNYEK LISTA ---------------------------- */}
      <ScrollView contentContainerStyle={styles.tranzakcioContainer}>
        <Text style={styles.nincsOra}>
          Itt láthatod az összes korábbi és folyamatban lévő tranzakciót.
        </Text>
        <Text style={styles.vanOra}>
          A részletek megtekintéséhez kattints a tranzakcióra!
        </Text>

        {befizetLista.length === 0 ? (
          <View style={{ alignItems: "center" }}>
            <Penz width={100} height={100} marginTop={50} />
            <Text style={styles.nincsOra}>
              Itt látod majd az összes korábbi és aktuális tranzakciódat, ezek
              részleteit, és azt, hogy el vannak-e fogadva!
            </Text>
          </View>
        ) : (
          befizetLista
            .sort(
              (a, b) =>
                new Date(b.befizetesek_ideje) - new Date(a.befizetesek_ideje)
            )
            .map((item) => (
              <TouchableOpacity
                key={item.befizetesek_id}
                style={styles.legutobbiTranzakciok}
                onPress={() => modalNyitas(item)}
              >
                <View style={styles.tranzakciosTextContainer}>
                  <Text style={styles.tranzakciosText}>
                    {item.befizetesek_tipusID === 1
                      ? "Tanóra díj"
                      : "Vizsga díj"}
                  </Text>
                  {FizetesiIkonKivalasztas(item.befizetesek_jovahagyva)}
                </View>
                <Text style={{ color: "gray", fontStyle: "italic" }}>
                  {new Date(item.befizetesek_ideje).toLocaleDateString()}
                </Text>
                <Text style={styles.tranzakciosOsszeg}>
                  - {item.befizetesek_osszeg} Ft
                </Text>
              </TouchableOpacity>
            ))
        )}
      </ScrollView>

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

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.modalKiemeltText}>Típus: </Text>
                <Text style={styles.modalText}>
                  {kivalasztottTranzakcio.befizetesek_tipusID === 1 ? (
                    <>{"tanóra díj"}</>
                  ) : (
                    <>{"vizsga díj"}</>
                  )}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.modalKiemeltText}>Összeg: </Text>
                <Text style={styles.modalText}>
                  {kivalasztottTranzakcio.befizetesek_osszeg} Ft
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.modalKiemeltText}>Befizetve: </Text>
                <Text style={styles.modalText}>
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
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.modalKiemeltText}>Összeget megkapta: </Text>
                <Text style={styles.modalText}>
                  {kivalasztottTranzakcio.befizetesek_kinek === 1 ? (
                    <>{"oktató"}</>
                  ) : (
                    <>{"autósiskola"}</>
                  )}
                </Text>
              </View>

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
    //color: "#888",
    //fontStyle: "italic",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  vanOra: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginBottom: 20,
    fontSize: 16,
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
    color: "#6A5AE0",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
  },
  modalCloseBtn: {
    marginTop: 20,
    padding: 10,
    //backgroundColor: "#6B6054", //barnás earth vibes
    backgroundColor: "#6A5AE0", //lila
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  //------------------------------- MODÁL VÉGE
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
  tranzakcioContainer: {
    backgroundColor: "#f3f0fa",
    margin: 20,
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
});
