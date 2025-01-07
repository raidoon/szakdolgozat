import React from "react";
import { useState,useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, } from 'react-native';
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";
import { useNavigation } from '@react-navigation/native';

const Oktato_Kezdolap = ({atkuld}) => {
    const [adatok,setAdatok]=useState([])

    const letoltes=async ()=>{
        //alert("hello")
 var adatok={
    "oktatoid": atkuld.oktato_id
 }
        const x=await fetch("http://192.168.10.58:3000/egyOktatoDiakjai",{
            method: "POST",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        const y=await x.json()
        setAdatok(y)
        alert(JSON.stringify(y))
    }
    useEffect(()=>{
        letoltes()
        
    },[])
    return(
        <View style={Styles.bejelentkezes_Container}>
            <View>
            <Text>Sikeres bejelentkezés! </Text>
            <Text>{atkuld ? `Felhasználó ID: ${atkuld.oktato_felhasznaloID}` : "Nincs adat"}</Text>
            </View>
        </View>
    );
}
export default Oktato_Kezdolap;