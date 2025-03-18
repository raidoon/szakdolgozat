import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ipcim from "../../../Ipcim";

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
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.header}>Részletek</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Név:</Text>
                    <Text style={styles.infoValue}>{tanulo.tanulo_neve}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Telefonszám:</Text>
                    <Text style={styles.infoValue}>{telefonszam}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Összes befizetés:</Text>
                    <Text style={styles.infoValue}>{osszesBefizetett} Ft</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Összes óra:</Text>
                    <Text style={styles.infoValue}>{osszesOra}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fffde7", // Light pleasant yellow background
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff3e0", // Light orange card background
        padding: 25,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: "90%",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ff8f00", // Orange for emphasis
        marginBottom: 20,
        textAlign: "center",
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 18,
        color: "#333",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
    },
});