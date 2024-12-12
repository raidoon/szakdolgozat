import { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";
import { useNavigation } from '@react-navigation/native';

export default function Oktato_Kezdolap({atkuld}){
    const [adatok,setAdatok]=useState([])
    const navigation = useNavigation();
    const letoltes=async ()=>{
        //alert("hello")
 var adatok={
    "oktatoid":atkuld
 }
        const x=await fetch("http://192.168.10.58:3000/egyOktatoDiakjai",{
            method: "POST",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        const y=await x.json()
        setAdatok(y)
        //alert(JSON.stringify(y))
    }
  
    useEffect(()=>{
        letoltes()
        
    },[])
    const katt = (tanulo) => {
        navigation.navigate("Oktato_TanuloReszletei", { tanulo });
    };

    return(
        <View style={Styles.bejelentkezes_Container}>
            <View>
            <Text>Sikeres bejelentkezés! </Text>
            <Text>{atkuld ? `Felhasználó ID: ${atkuld}` : "Nincs adat"}</Text>
            <Text>hello</Text>
            <FlatList
        data={adatok}
        renderItem={({item}) => (
            <View>
                <Text>{item.tanulo_neve}</Text>
    {/* 
                <Image 
                source={{uri: "http://10.0.0.162:3000/"+item.film_kep}} 
                style={{width:100, height:100}}/>
    */}
                <TouchableOpacity 
                    style={{backgroundColor:"#0000ff"}} 
                    onPress={() => katt(item)}>
                  <Text style={{color:"white"}}>Részletek</Text>
                </TouchableOpacity>
            
            </View>
          )
        }
        keyExtractor={item => item.tanulo_id}
      />

            
            </View>
        </View>
    );
}