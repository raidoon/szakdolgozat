import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ipcim from "../../../Ipcim";

export default function Oktato_LevizsgazottTanuloReszletei({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [email, setEmail] = useState("");
    const [telefonszam, setTelefonszam] = useState("");
    const [osszesBefizetett, setOsszesBefizetett] = useState(0); 
    const [osszesOra, setOsszesOra] = useState(0);

    const letoltes = async () => {
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };
            const response = await fetch(Ipcim.Ipcim + "/tanuloReszletei", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) throw new Error(`Hiba történt: ${response.statusText}`);

            const data = await response.json();
            setAdatok(data);
            setEmail(data[0].felhasznalo_email);
            setTelefonszam(data[0].felhasznalo_telefonszam);
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    };

    const befizetesLekerdezes = async () => {
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };
            const response = await fetch(Ipcim.Ipcim + "/tanuloOsszesFizu", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) throw new Error(`Hiba történt: ${response.statusText}`);
            const data = await response.json();
            setOsszesBefizetett(data.length > 0 && data[0].osszesBefizetett !== null ? data[0].osszesBefizetett : 0);
        } catch (error) {
            console.error("Hiba a befizetés lekérdezése során:", error);
            alert("Nem sikerült a befizetés adatok letöltése.");
        }
    };

    const orakLekerdezes = async () => {
        try {
            const adat = { tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID };
            const response = await fetch(Ipcim.Ipcim + "/tanuloOsszesOra", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) throw new Error(`Hiba történt: ${response.statusText}`);
            const data = await response.json();
            setOsszesOra(data.length > 0 && data[0].osszesOra !== null ? data[0].osszesOra : 0);
        } catch (error) {
            console.error("Hiba az órák lekérdezése során:", error);
            alert("Nem sikerült az órák adatok letöltése.");
        }
    };

    useEffect(() => {
        letoltes();
        befizetesLekerdezes(); 
        orakLekerdezes();
    }, []);

    return (
        <View style={stilus.kontener}>
            <View style={stilus.kartya}>
                <Text style={stilus.cim}>{tanulo.tanulo_neve}Részletei</Text>
                <Text style={stilus.adat}>Email: {email}</Text>
                <Text style={stilus.adat}>Telefonszám: {telefonszam}</Text>
                <Text style={stilus.adat}>Összes befizetés: {osszesBefizetett} Ft</Text>
                <Text style={stilus.adat}>Összes teljesített óra: {osszesOra}</Text>
            </View>
        </View>
    );
}

const stilus = StyleSheet.create({
    kontener: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    kartya: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        width: "90%",
        alignItems: "center",
    },
    cim: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    adat: {
        fontSize: 18,
        color: "#555",
        marginVertical: 4,
    }
});
