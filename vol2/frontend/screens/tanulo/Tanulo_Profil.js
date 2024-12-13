import React, { useState,useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import Ripple from "react-native-material-ripple";
import Styles from "../../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import Ipcim from "../../Ipcim";
import { useNavigation } from "@react-navigation/native";

export default function Tanulo_Profil({atkuld}) {
  const navigation = useNavigation();
    const [adatok,setAdatok] = useState([]);
    const [felhasznalonev,setFelhasznalonev] = useState("");
    
    console.log("\n\t\t\tmost itt vagyok: tanuló profil oldal")
    console.log(atkuld)

  return(
    <View style={styles.default}>

      <View>
        <Text styles={{textAlign:'center'}}>felhasználó profilkép?</Text>
      </View>

      <View>
        <Text style={{fontSize: 30, fontWeight: 'bold',textAlign:'center',marginTop: 10}}>{atkuld[0].tanulo_neve}</Text>
        <Text style={{fontSize: 20, color:'grey',textAlign:'center',marginBottom: 20}}>{atkuld[0].felhasznalo_email}</Text>
      </View>

      <View style={styles.gombDiv}>
        <Ripple
              rippleColor="rgb(0,0,0)"
              rippleOpacity={0.05}
              rippleDuration={300}
              rippleCentered={true}
              rippleFades={false}
              rippleContainerBorderRadius={20}
              style={[styles.profileGombok, styles.gombDiv] }
              onPress={() => navigation.navigate("Tanuló Profil", {
                screen: "SzemelyesAdatok",
              })
              }
          >
            <View style={styles.elsoFlex}>
            <Ionicons name="person-outline" size={25} color="green"/>
            </View>
            <View styles={styles.masodikFlex}>
            <Text style={{fontSize: 20, }}>Személyes adatok </Text>
            </View>
            <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray"/>
            </View>
         </Ripple>
      </View>

      <View style={styles.gombDiv}>
        <Ripple
              rippleColor="rgb(0,0,0)"
              rippleOpacity={0.05}
              rippleDuration={300}
              rippleCentered={true}
              rippleFades={false}
              rippleContainerBorderRadius={20}
              style={[styles.profileGombok, styles.gombDiv] }
              onPress={() => navigation.navigate("Tanuló Profil", {
                screen: "JelszoMegvaltoztatasa",
              })
              }
          >
            <View style={styles.elsoFlex}>
            <Ionicons name="shield-half-outline" size={25} color="blue"/>
            </View>
            <View styles={styles.masodikFlex}>
            <Text style={{fontSize: 20, }}>Jelszó megváltoztatása</Text>
            </View>
            <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray"/>
            </View>
         </Ripple>
      </View>
      <View style={styles.gombDiv}>
        <Ripple
              rippleColor="rgb(0,0,0)"
              rippleOpacity={0.05}
              rippleDuration={300}
              rippleCentered={true}
              rippleFades={false}
              rippleContainerBorderRadius={20}
              style={[styles.profileGombok, styles.gombDiv] }
              onPress={() => navigation.navigate("Tanuló Profil", {
                screen: "Beallitasok",
              })
              }
          >
            <View style={styles.elsoFlex}>
            <Ionicons name="settings-outline" size={25} color="purple"/>
            </View>
            <View styles={styles.masodikFlex}>
            <Text style={{fontSize: 20, }}>Beállítások</Text>
            </View>
            <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray"/>
            </View>
         </Ripple>
      </View>
      <View style={styles.gombDiv}>
        <Ripple
              rippleColor="rgb(0,0,0)"
              rippleOpacity={0.05}
              rippleDuration={300}
              rippleCentered={true}
              rippleFades={false}
              rippleContainerBorderRadius={20}
              style={[styles.profileGombok, styles.gombDiv] }
              onPress={() => navigation.navigate("Tanuló Profil", {
                screen: "Kapcsolat",
              })
              }
          >
            <View style={[styles.elsoFlex,]}>
            <Ionicons name="information-circle-outline" size={25} color="black"/>
            </View>
            <View styles={styles.masodikFlex}>
            <Text style={{fontSize: 20}}>Kapcsolat</Text>
            </View>
            <View style={styles.harmadikFlex}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray"/>
            </View>
         </Ripple>
      </View>
      <View style={styles.gombDiv}>
        <Ripple
              rippleColor="rgb(0,0,0)"
              rippleOpacity={0.05}
              rippleDuration={300}
              rippleCentered={true}
              rippleFades={false}
              rippleContainerBorderRadius={20}
              style={[styles.profileGombok, styles.gombDiv] }
              onPress={() => navigation.navigate("Bejelentkezes")}
          >
            <View style={styles.elsoFlex}>
            <Ionicons name="log-out-outline" size={25} color="red"/>
            </View>
            
            <Text style={{fontSize: 20,}}>Kijelentkezés</Text>
            
            <View style={[styles.harmadikFlex,]}>
            <Ionicons name="chevron-forward-outline" size={25} color="gray"/>
            </View>
         </Ripple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    default: {
      flex:1,
      flexDirection: 'column',
      backgroundColor:'#fff'
    },
    gombDiv:{
      flexDirection:'row',
      marginBottom: 0,
      marginTop:0,
    },
    elsoFlex:{
      flex:0,
      marginLeft: 30,
      marginRight: 10
    },
    harmadikFlex:{
      flex: 0,
      marginRight:0,
      backgroundColor: 'yellow',
    },
    profileGombok:{
      width:'100%',
      marginTop:7,
      paddingVertical:10,
    }
  });