import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_LevizsgazottTanuloReszletei({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [email, setEmail] = useState("");
    const [telefonszam, setTelefonszam] = useState("");

    const letoltes = async () => {
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };

            console.log("API hívás indítása...");
            const response = await fetch(Ipcim.Ipcim + "/levizsgazottTanuloReszletei", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Üres vagy hibás válasz érkezett a szervertől.");
            }

            console.log("Betöltött adatok:", data);
            setAdatok(data);
            setEmail(data[0]?.felhasznalo_email || "Nincs adat");
            setTelefonszam(data[0]?.felhasznalo_telefonszam || "Nincs adat");

        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    };

    useEffect(() => {
        letoltes();
    }, []);

    return (
        <View style={stilus.elso}>
            <View style={stilus.kartya}>
                <Text style={stilus.szoveg}>Részletek</Text>
                <Text style={stilus.masodik}>Név: {tanulo.tanulo_neve}</Text>
                <Text style={stilus.masodik}>ID: {tanulo.tanulo_felhasznaloID}</Text>
                <Text style={stilus.masodik}>Email: {email}</Text>
                <Text style={stilus.masodik}>Telefonszám: {telefonszam}</Text>
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
        fontWeight: "bold",
        marginBottom: 20,
    },
    masodik: {
        fontSize: 25,
        color: "#333",
        fontWeight: "500",
        marginVertical: 5,
    },
    kartya: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        width: "80%",
        alignItems: "center",
    },
});
