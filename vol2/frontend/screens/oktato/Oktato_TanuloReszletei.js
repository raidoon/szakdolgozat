import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_TanuloReszletei({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [email, setEmail] = useState("");

    const letoltes = async () => {
        try {
            const adat = {
                tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID,
            }
            console.log("API hívás indítása...");
            console.log("Elküldött adat:", JSON.stringify({ "felhasznaloID": tanulo.tanulo_felhasznaloID }));

            const response = await fetch(Ipcim.Ipcim + "/sajatAdatokT", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            console.log("API válasz:", response);

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Betöltött adatok:", data);
            setAdatok(data);
            setEmail(data[0].felhasznalo_email); // Ha a válasz tömböt ad vissza

        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    }

    useEffect(() => {
        letoltes();
    }, []);

    return (
        <View style={stilus.elso}>
            <View>
                <Text style={stilus.szoveg}>Részletek</Text>
                <Text>{tanulo.tanulo_neve}</Text>
                <Text>{tanulo.tanulo_felhasznaloID}</Text>
                <Text style={stilus.masodik}>{email}</Text>
            </View>
        </View>
    );
}

const stilus = StyleSheet.create({
    elso: {
        flex: 1,
        backgroundColor: 'lightgreen',
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    szoveg: {
        fontSize: 50,
        fontStyle: "italic",
    },
    masodik: {
        justifyContent: "center",
        fontSize: 30,
    }
});
