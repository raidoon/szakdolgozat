import React, { useState,useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Button } from "react-native-web";
import Ripple from "react-native-material-ripple";
import Styles from "../../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Profil({navigation}) {
  const [adatok,setAdatok] = useState([]);
  const letoltes = async()=>{
    const x = await fetch("http://192.168.10.57:3000/tanuloLista"); //Fanni: 58 --> EH: 57
    const y = await x.json();
    setAdatok(y);
  };
  useEffect(() => {
    letoltes();
  }, []);
  return(
    <View style={styles.default}>

      <View>
        <Text styles={{textAlign:'center'}}>felhasználó profilkép?</Text>
      </View>

      <View>
        <Text style={{fontSize: 30, fontWeight: 'bold',textAlign:'center',marginTop: 10}}>név helye</Text>
        <Text style={{fontSize: 20, color:'grey',textAlign:'center',marginBottom: 20}}>email cím helye</Text>
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
              onPress={() => navigation.navigate("")}
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
              onPress={() => navigation.navigate("")}
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
              onPress={() => navigation.navigate("")}
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
              onPress={() => navigation.navigate("")}
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
              onPress={() => navigation.navigate("")}
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