import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ipcim from "../../Ipcim";

export default function Oktato_TanuloReszletei({ route }) {
    const { tanulo } = route.params;
    const [adatok, setAdatok] = useState([]);
    const [email, setEmail] = useState("");
    const [telefonszam, setTelefonszam]=useState("");
    const [osszesBefizetett, setOsszesBefizetett] = useState(0); // Új állapotváltozó
    const [osszesOra,setOsszesOra]=useState(0);
    const letoltes = async () => {
        try {
            const adat = {
                tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID,
            }
            console.log("API hívás indítása...");
            console.log("Elküldött adat:", JSON.stringify({ "felhasznaloID": tanulo.tanulo_felhasznaloID }));

            const response = await fetch(Ipcim.Ipcim + "/tanuloReszletei", { 
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
    
                console.log("Befizetés API hívás...");
                const response = await fetch(Ipcim.Ipcim + "/tanuloOsszesFizu", { 
                    method: "POST",
                    body: JSON.stringify(adat),
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                });
    
                if (!response.ok) {
                    throw new Error(`Hiba történt: ${response.statusText}`);
                }
    
                const data = await response.json();
                console.log("Befizetés adatok:", data);
                
                // Ellenőrizzük, hogy a visszatérő adat tartalmaz-e értéket
                if (data.length > 0 && data[0].osszesBefizetett !== null) {
                    setOsszesBefizetett(data[0].osszesBefizetett);
                } else {
                    setOsszesBefizetett(0); // Ha nincs befizetés, akkor 0
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
    
                console.log("Befizetés API hívás...");
                const response = await fetch(Ipcim.Ipcim + "/tanuloOsszesOra", { 
                    method: "POST",
                    body: JSON.stringify(adat),
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                });
    
                if (!response.ok) {
                    throw new Error(`Hiba történt: ${response.statusText}`);
                }
    
                const data = await response.json();
                console.log("Befizetés adatok:", data);
                
                // Ellenőrizzük, hogy a visszatérő adat tartalmaz-e értéket
                if (data.length > 0 && data[0].osszesOra !== null) {
                    setOsszesOra(data[0].osszesOra);
                } else {
                    setOsszesOra(0); 
                }
    
            } catch (error) {
                console.error("Hiba a befizetés lekérdezése során:", error);
                alert("Nem sikerült a befizetés adatok letöltése.");
            }
        };

    useEffect(() => {
        letoltes();
        befizetesLekerdezes();
        orakLekerdezes();
    }, []);

    return (
        <View style={stilus.elso}>
            <View>
               <Text style={stilus.szoveg}>Részletek</Text>
                <Text style={stilus.masodik}>Név: {tanulo.tanulo_neve}</Text>
                <Text style={stilus.masodik}>Email: {email}</Text>
                <Text style={stilus.masodik}>Telefonszám: {telefonszam}</Text>
                <Text style={stilus.masodik}>Összes megerősített befizetés: {osszesBefizetett} Ft</Text> 
                <Text style={stilus.masodik}> Összes teljesített óra: {osszesOra}</Text>
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

