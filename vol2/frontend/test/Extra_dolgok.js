/* -------------------------------------- ÖSSZEG FELVITELE AZ ADATBÁZISBA ---------------------------------------- */
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
{/* --------------------------------------SZÁMOLÓGÉP---------------------------------------- */}
{/* Figyelmeztető szöveg megváltoztatása ||függ: számológép látható-e */}
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
        Az alkalmazásban rögzített tranzakciók kizárólag szemléltető jellegűek,
        és nem vonódnak le a bankkártyádról!
      </Text>
    </View>
  )}

  <TouchableOpacity style={styles.felvetelGomb} onPress={osszegFelvitele}>
    <Text style={styles.felvetelGombSzoveg}>Összeg felvétele</Text>
  </TouchableOpacity>

  {szamologepLathatoe && szamologepBetoltes()}
</View>;
//------------------------------------------------------- EXTRA STÍLUSOK
const styles = StyleSheet.create({
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
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
