import {useEffect, useState} from "react";
import { View, Text, Button,StyleSheet } from "react-native";
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";

export default function Oktato_TanuloReszletei({route}){
    const {tanulo}=route.params
    const [adatok,setAdatok]=useState([])
    const [email,setEmail]=useState("")
    
        const letoltes=async ()=>{
        //alert("hello")
            //alert(tanulo.tanulo_felhasznaloID)
            var adatok={
                "felhasznaloID":tanulo.tanulo_felhasznaloID
            }
                    const x=await fetch(Ipcim.Ipcim +"/sajatAdatokT",{
                        method: "POST",
                        body: JSON.stringify(adatok),
                        headers: {"Content-type": "application/json; charset=UTF-8"}
                    })
                    const y=await x.json()
                    setAdatok(y)
                    setEmail(y[0].felhasznalo_email)
                    //alert(JSON.stringify(y))
                    //console.log(y)
        
    }
  
    useEffect(()=>{
        letoltes()
        
    },[])
    return(
        <View style={stilus.elso}>
            <View >
            <Text style={stilus.szoveg}>Részletek</Text>
            <Text>{tanulo.tanulo_neve}</Text>
            <Text>{tanulo.tanulo_felhasznaloID}</Text>
            <Text style={stilus.masodik}> {email}</Text>
          
            </View>
        </View>
    );
}
const stilus = StyleSheet.create({
    elso:{
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems:"center",
    justifyContent:"center",
    padding:20,
    
    
},
szoveg:{
    fontSize:50,
    fontStyle:"italic",
    

},
masodik:{
    justifyContent:"center",
    fontSize:30,
    
}
    
})