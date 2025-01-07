import { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import Oktato_Styles from '../../Oktato_Styles';
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
        alert(JSON.stringify(y))
    }
  
    useEffect(()=>{
        letoltes()
        
    },[])
    

    return(
        <View style={Oktato_Styles.reszletek_container}>
            <View>
            <Text>Sikeres bejelentkezés! </Text>
            <Text>{atkuld ? `Felhasználó ID: ${atkuld}` : "Nincs adat"}</Text>
            <Text>hello</Text>
            

            
            </View>
        </View>
    );
}