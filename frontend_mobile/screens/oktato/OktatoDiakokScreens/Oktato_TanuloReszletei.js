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
                <Text style={styles.header}>Tanuló részletei</Text>
                <View style={styles.infok}>
                    <Text style={styles.infoLabel}>Név:</Text>
                    <Text style={styles.infoValue}>{tanulo.tanulo_neve}</Text>
                </View>
                <View style={styles.infok}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                </View>
                <View style={styles.infok}>
                    <Text style={styles.infoLabel}>Telefonszám:</Text>
                    <Text style={styles.infoValue}>{telefonszam}</Text>
                </View>
                <View style={styles.infok}>
                    <Text style={styles.infoLabel}>Összes befizetés:</Text>
                    <Text style={[styles.infoValue, styles.highlightText]}>{osszesBefizetett} Ft</Text>
                </View>
                <View style={styles.infok}>
                    <Text style={styles.infoLabel}>Összes óra:</Text>
                    <Text style={[styles.infoValue, styles.highlightText]}>{osszesOra}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FBFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        borderRadius: 12,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: '90%',
        borderLeftWidth: 6,
        borderLeftColor: '#4CAF50',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00796B',
        marginBottom: 25,
        textAlign: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F5E9',
    },
    infok: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(76, 175, 80, 0.1)',
    },
    infoLabel: {
        fontSize: 18,
        color: '#388E3C',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 18,
        color: '#2E7D32',
        fontWeight: '600',
    },
    highlightText: {
        color: '#00796B',
        fontWeight: 'bold',
    },
});