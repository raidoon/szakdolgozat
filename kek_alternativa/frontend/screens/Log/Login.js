import React, { useState, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,BackHandler,StyleSheet,} from "react-native";
import Styles from "../../Styles";
import { Octicons, Ionicons } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import Ipcim from "../../Ipcim";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HibaModal from "../../extra/HibaModal";
import SikerModal from "../../extra/SikerModal";
const LoginScreen = ({ navigation }) => {
  const [sikerModalLathato, setSikerModalLathato] = useState(false);
  const [sikerultRegisztralniModal,setSikerultRegisztralniModal] = useState(false);
  const [hibaModalLathato, setHibaModalLathato] = useState(false);
  const [felhasznalo_email, setFelhasznaloEmail] = useState('');
  const [felhasznalo_jelszo, setFelhasznaloJelszo] = useState('');
  const [jelszoMutatasa, setJelszoMutatasa] = useState(false);
  const [kitUdvozlunk,setKitudvozlunk] = useState('');
  useEffect(() => {
    //ide jöhetne adatok betöltése cuccli !!!
    const bejelentkezesEllenorzes = async () => {
      const eltaroltFelhasznalo = await AsyncStorage.getItem('bejelentkezve');
      if (eltaroltFelhasznalo) {
        const bejelentkezettFelhasznalo = JSON.parse(eltaroltFelhasznalo);
        if (bejelentkezettFelhasznalo.felhasznalo_id !== 0) {
          if (bejelentkezettFelhasznalo.felhasznalo_tipus === 1) {
            navigation.replace('Oktato_BejelentkezesUtan2');
          } else {
            navigation.replace('Tanulo_BejelentkezesUtan');
          }
        }
      }
    };
    bejelentkezesEllenorzes();
    const sikeresRegisztracioEllenorzes = async () => {
      const modalLathatoe = await AsyncStorage.getItem('sikeresRegisztraciosModal');
      if (modalLathatoe === 'true') {
        setSikerultRegisztralniModal(true);
        await AsyncStorage.removeItem('sikeresRegisztraciosModal'); // Törlés, hogy csak egyszer jelenjen meg, csak regisztráció után
      }
    };
    sikeresRegisztracioEllenorzes();
    const backAction = () => true; // Megakadályozza a visszalépést
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove(); // Eltávolítás, ha a komponens elhagyja a képernyőt
  }, []);
  const bejelentkeztetes = async () => {
    const adatok = {
      felhasznalo_email,
      felhasznalo_jelszo,
    };
    try {
      const response = await fetch(Ipcim.Ipcim + "/beleptetes", {
        method: 'POST',
        body: JSON.stringify(adatok),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      const adat = await response.json();
      if (adat.error) {
        setHibaModalLathato(true);
      } else {
        if (adat.felhasznalo_id !== 0) {
          await AsyncStorage.setItem('bejelentkezve', JSON.stringify(adat));
          await AsyncStorage.setItem('showSuccessModal', 'true'); // Siker modalt jelző tárolás
          if (adat.felhasznalo_tipus === 1) {
            setKitudvozlunk('oktató');    
            setSikerModalLathato(true);        
            navigation.replace('Oktato_BejelentkezesUtan2');
          } else {
            setKitudvozlunk('tanuló');
            setSikerModalLathato(true);
            navigation.replace('Tanulo_BejelentkezesUtan');
          }
        } else {
          setHibaModalLathato(true);
        }
      }
    } catch (error) {
      setHibaModalLathato(true);
    }
  };

  return (
    <View style={Styles.bejelentkezes_Container}>
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="person" size={20} color="#0096FF" />
        <TextInput
          style={Styles.input}
          placeholder="Email"
          value={felhasznalo_email}
          onChangeText={setFelhasznaloEmail}
        />
      </View>

      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="lock" size={20} color="#0096FF" />
        <TextInput
          style={Styles.input}
          placeholder="Jelszó"
          secureTextEntry={!jelszoMutatasa}
          value={felhasznalo_jelszo}
          onChangeText={setFelhasznaloJelszo}
        />
        <TouchableOpacity onPress={() => setJelszoMutatasa(!jelszoMutatasa)}>
          <Ionicons
            name={jelszoMutatasa ? "eye" : "eye-off"}
            size={20}
            color="#0096FF"
          />
        </TouchableOpacity>
      </View>
      <Ripple
        rippleColor="rgb(0,0,0)"
        rippleOpacity={0.05}
        rippleDuration={300}
        rippleCentered={true}
        rippleFades={false}
        rippleContainerBorderRadius={20}
        style={Styles.bejelentkezes_Gomb}
        onPress={bejelentkeztetes}
      >
        <Text style={Styles.bejelentkezes_bejelentkezoGomb}>Bejelentkezés</Text>
      </Ripple>
      <View style={Styles.bejelentkezes_kerdes}>
        <Text style={Styles.bejelentkezes_kerdesSzoveg}>Nincs fiókod?</Text>
        <Ripple
          rippleColor="rgb(0,0,0)"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={20}
          style={[
            Styles.bejelentkezes_Gomb,
            Styles.bejelentkezes_regisztaciosGomb,
          ]}
          onPress={() => navigation.replace("Regisztracio")}
        >
          <Text style={Styles.bejelentkezes_regiGombSzoveg}>Regisztálj!</Text>
        </Ripple>
      </View>
      <HibaModal
            visible={hibaModalLathato}
            onClose={()=> setHibaModalLathato(false)}
            title={'Hiba a bejelentkezés során!'}
            body={"Hibás email cím vagy jelszó! Kérjük ellenőrizze, hogy biztosan jól írta-e be az adatait!"}
            buttonText={"Bezárás"}
      />
      <SikerModal
        visible={sikerModalLathato}
        onClose={()=>setSikerModalLathato(false)}
        title={'Sikeres bejelentkezés!'}
        body={`Üdvözöljük kedves ${kitUdvozlunk}`}
        buttonText={"Oké"}
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
};
const styles = StyleSheet.create({
  modalNagyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalKisView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'left',
  },
  modalCim: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalLeiras: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 30,
  },
  modalGombView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalMegseGomb: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalMegseGombText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalKijelentkezesGomb: {
    backgroundColor: '#FF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalKijelentkezesGombText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default LoginScreen;