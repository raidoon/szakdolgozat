import React, { useState, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity} from "react-native";
import Ripple from "react-native-material-ripple";
import { Octicons, Ionicons } from "@expo/vector-icons";
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";
import DropDownPicker from "react-native-dropdown-picker";
import HibaModal from "../../extra/HibaModal";
import SikerModal from "../../extra/SikerModal";
import AsyncStorage from '@react-native-async-storage/async-storage';
function SajatCheckbox({ felirat, bepipalt, onPress }) {
  return (
    <TouchableOpacity style={Styles.checkboxView} onPress={onPress}>
      <View style={[Styles.checkbox, bepipalt && Styles.bepipaltCheckbox]} />
      <Text style={{fontSize: 16}}>{felirat}</Text>
    </TouchableOpacity>
  );
}
export default function Regisztracio({ navigation }) {
  const [email, setEmail] = useState("");
  const [nev, setNev] = useState("");
  const [tanulo, setTanulo] = useState(false);
  const [oktato, setOktato] = useState(false);
  //---------------------------------------------------- MODÁLOK
  const [hibaModalLathato, setHibaModalLathato] = useState(false);
  const [hibaCim, setHibaCim] = useState('');
  const [hibaSzoveg, setHibaSzoveg] = useState('');
  const [sikerultRegisztralniModal,setSikerultRegisztralniModal] = useState(false);
  //---------------------------------------------------- JELSZAVAK
  const [jelszo, setJelszo] = useState("");
  const [joaJelszo, setJoaJelszo] = useState("");
  const [jelszoMutatasa, setJelszoMutatasa] = useState(false);
  const [masodikJelszoMutatasa, setMasodikJelszoMutatasa] = useState(false);
  const [jelszoHiba, setJelszoHiba] = useState("");
  //---------------------------------------------------- TELEFONSZÁMOK
  const [telefonszam, setTelefonszam] = useState("");
  const [telefonszamHiba, setTelefonszamHiba] = useState(false); // Hibajelzés
  //------------------------------- DROPDOWN
  const [kinyitDropdown, setKinyitDropdown] = useState(false);
  const [ertekek, setErtekek] = useState([]);
  const [autosiskola, setAutosiskola] = useState("");
  //------------------------------- TELEFONSZÁM ELLENŐRZÉS
  const telefonszamValtozas = (szamjegy) => {
    // Ellenőrizzük, hogy a +36 megmaradjon az elején
    if (!szamjegy.startsWith("+36")) {
      szamjegy = "+36" + szamjegy.replace("+36", "");
    }
    // Csak 9 számjegy engedélyezése a +36 után
    const szamResz = szamjegy.slice(3).replace(/\D/g, ""); // Csak számjegyeket enged
    if (szamResz.length <= 9) {
      setTelefonszam("+36" + szamResz);
    }
    // Hiba, ha a szám hossza nem megfelelő
    if (szamResz.length !== 9) {
      setTelefonszamHiba(true);
    } else {
      setTelefonszamHiba(false);
    }
  };
  //----------------------------------------- JELSZÓ ELLENŐRZÉS
  const jelszoEllenorzes = (pass) => {
    //legyen benne legalább 1 db nagybetű, legyen legalább 8 karakter hosszú, max 20 karakter hosszú és tartalmazzon 1 db számot is
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return passwordRegex.test(pass);
  };
  //-------------------------------- REGISZTRÁCIÓ
  const Regisztralas = async () => {
    let valid = true;
    if (!jelszoEllenorzes(jelszo)) {
      if (jelszo.length < 8) {
        setJelszoHiba("A jelszónak legalább 8 karakter hosszúnak kell lennie!");
        setHibaSzoveg("A jelszónak legalább 8 karakter hosszúnak kell lennie!");
        valid = false;
      } else if (jelszo.length > 20) {
        setJelszoHiba("A jelszó maximum 20 karakter hosszú lehet!");
        setHibaSzoveg("A jelszó maximum 20 karakter hosszú lehet!");
        valid = false;
      } else {
        setHibaSzoveg(
          "A jelszónak tartalmaznia kell legalább egy darab nagybetűt és egy darab számot."
        );
        setJelszoHiba(
          "A jelszónak tartalmaznia kell legalább egy darab nagybetűt és egy darab számot."
        );
        valid = false;
      }
    } else if (jelszo !== joaJelszo) {
      setHibaSzoveg("A jelszavak nem egyeznek meg.");
      setJelszoHiba("A jelszavak nem egyeznek meg.");
      valid = false;
    } else {
      setJelszoHiba("");
    }
     // Telefonszám ellenőrzése
  const szamResz = telefonszam.slice(3).replace(/\D/g, ""); // Csak számjegyeket enged
  if (szamResz.length !== 9) {
    setTelefonszamHiba("Hibás telefonszám! Kérjük adjon meg 9 számjegyet a +36 után.");
    setHibaSzoveg("Hibás telefonszám! Kérjük adjon meg 9 számjegyet a +36 után.");
    valid = false;
  } else {
    setTelefonszamHiba("");
  }
    const tipus = tanulo ? 2 : oktato ? 1 : null;
    if (!autosiskola || !email || !jelszo || !telefonszam || !tipus || !nev) {
      setHibaCim("Hiba!");
      setHibaSzoveg("Kérjük töltse ki az összes mezőt!");
      setHibaModalLathato(true);
      valid = false;
      return;
    }
    if (jelszo !== joaJelszo) {
      setHibaCim('Jelszó hiba!');
      setHibaSzoveg("Figyelem, a megadott jelszavak nem egyeznek meg!");
      setHibaModalLathato(true);
      valid = false;
      return;
    }
    if (!tanulo && !oktato) {
      setHibaCim("Hiba!");
      setHibaSzoveg("Kérjük válassza ki, hogy oktatóként vagy tanulóként kíván-e regisztrálni!");
      setHibaModalLathato(true);
      valid = false;
      return;
    }
    if (valid) {
      try {
        const response = await fetch(Ipcim.Ipcim + "/regisztracio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            autosiskola,
            email,
            jelszo,
            telefonszam,
            tipus,
            nev,
          }),
        });
        if (response.ok) {
          //------------------------------------------- HA MINDEN JÓL MENT
          await AsyncStorage.setItem('sikeresRegisztraciosModal', 'true'); // Siker modalt jelző tárolás
          setSikerultRegisztralniModal(true);
          navigation.replace("Bejelentkezes");
        } else { //------------------------------------------- HA HIBÁT KAPTUNK
          const errorMessage = await response.text();
          setHibaCim("Hiba!");
          setHibaSzoveg(errorMessage);
          setHibaModalLathato(true);
        }
      } catch (error) {
        setHibaCim("Hálózati hiba!");
        setHibaSzoveg(`Probléma a hálózattal, kérjük próbálkozzon újra! Ha a probléma továbbra is fennáll vegye fel a kapcsolatot a fejlesztőkkel, és küldje el nekik az alábbi szöveget: ${error}`);
        setHibaModalLathato(true);
      }
    }
  };
  // API hívás az autósiskolák listájához
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(Ipcim.Ipcim + "/autosiskolalista");
        const text = await response.text();
        console.log("API válasz szövege:", text);
        if (response.ok) {
          const data = JSON.parse(text);
          const dropdownData = data.map((item) => ({
            label: item.autosiskola_nev,
            value: item.autosiskola_id,
          }));
          setErtekek(dropdownData);
        } else {
          setHibaCim("Hiba!");
          setHibaSzoveg("Hiba történt az adatok betöltésekor. Kérjük próbálkozzon újra!");
          setHibaModalLathato(true);
        }
      } catch (error) {
        setHibaCim("Hálózati hiba!");
        setHibaSzoveg("A hálózat jelenleg nem elérhető. Kérjük próbálkozzon újra!");
        setHibaModalLathato(true);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={Styles.bejelentkezes_Container}>
      <Text style={[Styles.focim, { color: '#0096FF' }]}>Regisztráció</Text>
      <Text style={Styles.alcim}>Először add meg az adataidat</Text>
      <DropDownPicker
        min={1}
        max={1}
        open={kinyitDropdown}
        value={autosiskola}
        items={ertekek}
        setOpen={setKinyitDropdown}
        setValue={setAutosiskola}
        setItems={setErtekek}
        style={{
          backgroundColor: "#f7f7f7",
          color: "#FF6C00",
          marginBottom: 15,
        }}
        containerStyle={{}}
        disabledStyle={{
          opacity: 0.5,
        }}
        textStyle={{
          color: "#0096FF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 16,
        }}
        placeholder="Válassz autósiskolát"
      />
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="mail" size={20} color="#0096FF" />
        <TextInput
          style={Styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="person" size={20} color="#0096FF" />
        <TextInput
          style={Styles.input}
          placeholder="Teljes név"
          value={nev}
          onChangeText={setNev}
        />
      </View>

        <View
          style={[
            Styles.bejelentkezes_FormInputWrapper,
            telefonszamHiba && { borderColor: "red" },
          ]}
        >
          <Ionicons name="call-outline" size={20} color="#0096FF" />
          <TextInput
            style={Styles.input}
            keyboardType="numeric"
            value={telefonszam}
            onChangeText={telefonszamValtozas}
            placeholder="Telefonszám"
            maxLength={12} // +36 (3 karakter) + 9 számjegy
            onFocus={() => {
              if (telefonszam === "") {
                setTelefonszam("+36");
              }
            }}
            onBlur={() => {
              if (telefonszam === "+36") {
                setTelefonszam("");
              }
            }}
          />
        </View>
        {/* Hibaüzenet, ha a telefonszám hibás */}
        {telefonszamHiba && (
          <Text style={Styles.hibaKiiras}>
            Hibás telefonszám! Kérjük adjon meg 9 számjegyet a +36 után.
          </Text>
        )}

      <View style={[Styles.bejelentkezes_FormInputWrapper, jelszoHiba && { borderColor: "red" }]}>
        <Octicons name="lock" size={20} color="#0096FF" />
        <TextInput
          style={Styles.input}
          placeholder="Jelszó"
          secureTextEntry={!jelszoMutatasa}
          value={jelszo}
          onChangeText={setJelszo}
          maxLength={20}
        />
        <TouchableOpacity onPress={() => setJelszoMutatasa(!jelszoMutatasa)}>
          <Ionicons
            name={jelszoMutatasa ? "eye" : "eye-off"}
            size={20}
            color="#0096FF"
          />
        </TouchableOpacity>
      </View>
      {/* Hibaüzenet, ha a jelszó hibás */}
      {jelszoHiba && <Text style={Styles.hibaKiiras}>{jelszoHiba}</Text>}
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="lock" size={20} color="#0096FF" />
        <TextInput
          style={Styles.input}
          placeholder="Jelszó mégegyszer"
          secureTextEntry={!masodikJelszoMutatasa}
          value={joaJelszo}
          onChangeText={setJoaJelszo}
          maxLength={20}
        />
        <TouchableOpacity
          onPress={() => setMasodikJelszoMutatasa(!masodikJelszoMutatasa)}
        >
          <Ionicons
            name={masodikJelszoMutatasa ? "eye" : "eye-off"}
            size={20}
            color="#0096FF"
          />
        </TouchableOpacity>
      </View>
      <View>
        <SajatCheckbox
          felirat="Tanuló vagyok"
          bepipalt={tanulo}
          onPress={() => {
            setTanulo(true);
            setOktato(false);
          }}
        />
        <SajatCheckbox
          felirat="Oktató vagyok"
          bepipalt={oktato}
          onPress={() => {
            setOktato(true);
            setTanulo(false);
          }}
        />
      </View>
      <Ripple
        rippleColor="white"
        rippleOpacity={0.2}
        rippleDuration={300}
        style={Styles.regisztraciosGomb}
        onPress={Regisztralas}
      >
        <Text style={Styles.regisztraciosGombSzoveg}>REGISZTRÁCIÓ</Text>
      </Ripple>

      <TouchableOpacity
        onPress={() => navigation.replace("Bejelentkezes")}
        style={{ marginTop: 20 }}
      >
        <Text style={Styles.marVanFiokom}>
          Már van fiókod? <Text style={Styles.marVanFiokomText}>Jelentkezz be</Text>
        </Text>
      </TouchableOpacity>
      {/*--------------------------------------------- MODÁLOK ------------------------------------------- */}
      <HibaModal
            visible={hibaModalLathato}
            onClose={()=> setHibaModalLathato(false)}
            title={`${hibaCim}`}
            body={`${hibaSzoveg}`}
            buttonText={"Értem"}
      />
      <SikerModal
        visible={sikerultRegisztralniModal}
        onClose={()=>setSikerultRegisztralniModal(false)}
        title={'Sikeres regisztráció!'}
        body={`Most már bejelentkezhet az előzőleg megadott adataival. Kérjük, mihamarabb erősítse meg email címét!`}
        buttonText={"Rendben"}
      />
    </View>
  );
}