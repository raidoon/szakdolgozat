import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_TanuloReszletei({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [email, setEmail] = useState("");
    const [telefonszam, setTelefonszam] = useState("");
    const [osszesBefizetett, setOsszesBefizetett] = useState(0);
    const [osszesOra, setOsszesOra] = useState(0);

    const letoltes = async () => {
        try {
            const adat = {
                tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID,
            };
            console.log("API hívás indítása...");
            const response = await fetch(Ipcim.Ipcim + "/tanuloReszletei", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            setAdatok(data);
            setEmail(data[0].felhasznalo_email);
            setTelefonszam(data[0].felhasznalo_telefonszam);
        } catch (error) {
            console.error("Hiba az API-hívás során:", error);
            alert("Nem sikerült az adatok letöltése.");
        }
    }

    const befizetesLekerdezes = async () => {
        try {
            const adat = {
                tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID,
            };

            const response = await fetch(Ipcim.Ipcim + "/tanuloOsszesFizu", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.length > 0 && data[0].osszesBefizetett !== null) {
                setOsszesBefizetett(data[0].osszesBefizetett);
            } else {
                setOsszesBefizetett(0);
            }
        } catch (error) {
            console.error("Hiba a befizetés lekérdezése során:", error);
            alert("Nem sikerült a befizetés adatok letöltése.");
        }
    };

    const orakLekerdezes = async () => {
        try {
            const adat = {
                tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID,
            };

            const response = await fetch(Ipcim.Ipcim + "/tanuloOsszesOra", { 
                method: "POST",
                body: JSON.stringify(adat),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!response.ok) {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.length > 0 && data[0].osszesOra !== null) {
                setOsszesOra(data[0].osszesOra);
            } else {
                setOsszesOra(0);
            }
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
        <View style={stilus.container}>
            <View style={stilus.card}>
                <Text style={stilus.header}>Részletek</Text>
                <Text style={stilus.info}>Név: {tanulo.tanulo_neve}</Text>
                <Text style={stilus.info}>Email: {email}</Text>
                <Text style={stilus.info}>Telefonszám: {telefonszam}</Text>
                <Text style={stilus.info}>Összes megerősített befizetés: {osszesBefizetett} Ft</Text>
                <Text style={stilus.info}>Összes teljesített óra: {osszesOra}</Text>
            </View>
        </View>
    );
}

const stilus = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff', // világoskék háttér
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 25,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: "90%",
        alignItems: "flex-start", // Kicsit balra igazítva
    },
    header: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#4B0082", // Sötétlila szín
        marginBottom: 15,
        textAlign: "center", // Középre igazítva
    },
    info: {
        fontSize: 20,
        color: "#333",
        fontWeight: "500",
        marginBottom: 10,
        lineHeight: 25,
    }
});
