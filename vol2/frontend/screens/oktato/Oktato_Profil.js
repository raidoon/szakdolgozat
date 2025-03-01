import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import Ripple from "react-native-material-ripple";
import Styles from "../../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Oktato_Profil = ({atkuld}) => {
  console.log(atkuld)
  const navigation = useNavigation();

  const kijelentkeztetes = async () => {
    await AsyncStorage.removeItem('bejelentkezve');
    navigation.navigate('Bejelentkezes');
  };

  return (
    <View style={styles.default}>
      <View>
        <Text styles={{ textAlign: "center" }}>felhasználó profilkép?</Text>
      </View>

      <View>
        <Text style={Styles.focim}>{atkuld.oktato_neve}</Text>
        <Text style={Styles.alcim}>{atkuld.felhasznalo_email}</Text>
      </View>

      <View style={Styles.profil_gombDiv}>
        <Ripple
          rippleColor="rgb(0,0,0)"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={20}
          style={[Styles.profileGombok, Styles.profil_gombDiv]}
          onPress={() =>
            navigation.navigate("Oktatói Profil", {
              screen: "SzemelyesAdatok",
            })
          }
        >
          <View style={styles.elsoFlex}>
            <Ionicons name="person-outline" size={25} color="green" />
          </View>
          <View styles={styles.masodikFlex}>
            <Text style={{ fontSize: 20 }}>Személyes adatok </Text>
          </View>
          <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray" />
          </View>
        </Ripple>
      </View>

      <View style={Styles.profil_gombDiv}>
        <Ripple
          rippleColor="rgb(0,0,0)"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={20}
          style={[Styles.profileGombok, Styles.profil_gombDiv]}
          onPress={() =>
            navigation.navigate("Tanuló Profil", {
              screen: "JelszoMegvaltoztatasa",
            })
          }
        >
          <View style={styles.elsoFlex}>
            <Ionicons name="shield-half-outline" size={25} color="blue" />
          </View>
          <View styles={styles.masodikFlex}>
            <Text style={{ fontSize: 20 }}>Jelszó megváltoztatása</Text>
          </View>
          <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray" />
          </View>
        </Ripple>
      </View>
      <View style={Styles.profil_gombDiv}>
        <Ripple
          rippleColor="rgb(0,0,0)"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={20}
          style={[Styles.profileGombok, Styles.profil_gombDiv]}
          onPress={() =>
            navigation.navigate("Tanuló Profil", {
              screen: "Beallitasok",
            })
          }
        >
          <View style={styles.elsoFlex}>
            <Ionicons name="settings-outline" size={25} color="purple" />
          </View>
          <View styles={styles.masodikFlex}>
            <Text style={{ fontSize: 20 }}>Beállítások</Text>
          </View>
          <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray" />
          </View>
        </Ripple>
      </View>
      <View style={Styles.profil_gombDiv}>
        <Ripple
          rippleColor="rgb(0,0,0)"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={20}
          style={[Styles.profileGombok, Styles.profil_gombDiv]}
          onPress={() =>
            navigation.navigate("Tanuló Profil", {
              screen: "Kapcsolat",
            })
          }
        >
          <View style={[styles.elsoFlex]}>
            <Ionicons
              name="information-circle-outline"
              size={25}
              color="black"
            />
          </View>
          <View styles={styles.masodikFlex}>
            <Text style={{ fontSize: 20 }}>Kapcsolat</Text>
          </View>
          <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray" />
          </View>
        </Ripple>
      </View>
      <View style={Styles.profil_gombDiv}>
        <Ripple
          rippleColor="rgb(0,0,0)"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={20}
          style={[Styles.profileGombok, Styles.profil_gombDiv]}
          onPress={kijelentkeztetes}
        >
          <View style={styles.elsoFlex}>
            <Ionicons name="log-out-outline" size={25} color="red" />
          </View>

          <Text style={{ fontSize: 20 }}>Kijelentkezés</Text>

          <View style={[styles.harmadikFlex]}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray" />
          </View>
        </Ripple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  elsoFlex: {
    flex: 0,
    marginLeft: 30,
    marginRight: 10,
  },
  harmadikFlex: {
    flex: 0,
    marginRight: 0,
  },
});
export default Oktato_Profil;