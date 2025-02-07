import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Ripple from "react-native-material-ripple";
import Styles from "../../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tanulo_Profil = ({ atkuld }) => {
  const navigation = useNavigation();

  const kijelentkeztetesAlert = () => {
    Alert.alert("Figyelem!", "Biztosan ki szeretne jelentkezni?", [
      {
        text: "Mégse",
        onPress: () => console.log("mégse megnyomva"),
        style: "cancel",
      },
      {
        text: "Igen",
        onPress: () => kijelentkeztetes(),
      },
    ]);
  };
  const kijelentkeztetes = async () => {
    await AsyncStorage.removeItem("bejelentkezve");
    navigation.navigate("Bejelentkezes");
  };

  return (
    <View style={styles.default}>
      
        <Text style={{ textAlign: "center" }}>felhasználó profilkép?</Text>
        <Text style={[Styles.focim, { textAlign: "center" }]}>
          {atkuld.tanulo_neve}
        </Text>
        <Text style={[Styles.alcim, { textAlign: "center" }]}>
          {atkuld.felhasznalo_email}
        </Text>
 

        <View style={Styles.profil_gombDiv}>
  {/* SZEMÉLYES ADATOK */}
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
        screen: "SzemelyesAdatok",
      })
    }
  >
    <View style={styles.elsoFlex}>
      <Ionicons name="person-outline" size={25} color="green" />
    </View>
    <View style={styles.masodikFlex}>
      <Text style={{ fontSize: 20 }}>Személyes adatok</Text>
    </View>
    <View style={styles.harmadikFlex}>
      <Ionicons name="chevron-forward-outline" size={25} color="gray" />
    </View>
  </Ripple>
</View>

<View style={Styles.profil_gombDiv}>
  {/* JELSZÓ MEGVÁLTOZTATÁSA */}
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
    <View style={styles.masodikFlex}>
      <Text style={{ fontSize: 20 }}>Jelszó megváltoztatása</Text>
    </View>
    <View style={styles.harmadikFlex}>
      <Ionicons name="chevron-forward-outline" size={25} color="gray" />
    </View>
  </Ripple>
</View>

<View style={Styles.profil_gombDiv}>
  {/* KAPCSOLAT */}
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
    <View style={styles.elsoFlex}>
      <Ionicons name="information-circle-outline" size={25} color="black" />
    </View>
    <View style={styles.masodikFlex}>
      <Text style={{ fontSize: 20 }}>Kapcsolat</Text>
    </View>
    <View style={styles.harmadikFlex}>
      <Ionicons name="chevron-forward-outline" size={25} color="gray" />
    </View>
  </Ripple>
</View>

<View style={styles.kijelentkezoGombView}>
  {/* KIJELENTKEZÉS */}
  <Ripple
    rippleColor="rgb(0,0,0)"
    rippleOpacity={0.05}
    rippleDuration={300}
    rippleCentered={true}
    rippleFades={false}
    rippleContainerBorderRadius={20}
    style={[styles.kijelentkezoGombRipple]}
    onPress={kijelentkeztetesAlert}
  >
      <Text style={styles.kijelentkezoGombText}>Kijelentkezés</Text>
  </Ripple>
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    textAlign: "center",
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
  kijelentkezoGombView:{
    backgroundColor: 'red',
    opacity: 0.7,
    padding: 20,
    width: 'auto',
    borderRadius: 40,
    marginTop: 30,
    marginRight: 50,
    marginLeft: 50
  },
  kijelentkezoGombRipple:{
  },
  kijelentkezoGombText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  }
});
export default Tanulo_Profil;
