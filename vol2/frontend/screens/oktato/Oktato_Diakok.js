import { useState,useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Styles from "../../Styles";
import Oktato_Styles from "../../Oktato_Styles";
import Ipcim from "../../Ipcim";


export default function Oktato_Diakok({atkuld}){
    const [adatok,setAdatok]=useState([])
    const navigation = useNavigation();
    const letoltes=async ()=>{
        //alert("hello")
        //alert(atkuld.oktato_id)
 var adatok={
    "oktatoid":atkuld.oktato_id
 }
        const x=await fetch(Ipcim.Ipcim +"/egyOktatoDiakjai",{
            method: "POST",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        const y=await x.json()
        setAdatok(y)
        alert(JSON.stringify(y))
        console.log(y)
    }
  
    useEffect(()=>{
        letoltes()
        
    },[])
    const katt = (tanulo) => {
        //alert(tanulo.tanulo_neve)
        navigation.navigate("Oktato_TanuloReszletei", { tanulo });
    };
    return(
        <View style={Oktato_Styles.diakok_container}>
            <View>
            <Text>Aktuális Diákok </Text>
            </View>

            <View >
            <View>
            
            <Text>hello</Text>
            <FlatList
        data={adatok}
        
        renderItem={({item}) => (
            <View >
                <Text>{item.tanulo_neve}</Text>
                <Text>{item.tanulo_id}</Text>
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
        </View>
    );
}