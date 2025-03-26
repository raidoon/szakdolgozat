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
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.header}>{tanulo.tanulo_neve} részletei</Text>
                
                <View style={styles.infok}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{email}</Text>
                </View>
                
                <View style={styles.infok}>
                    <Text style={styles.label}>Telefonszám:</Text>
                    <Text style={styles.value}>{telefonszam}</Text>
                </View>
                
                <View style={styles.infok}>
                    <Text style={styles.label}>Összes befizetés:</Text>
                    <Text style={[styles.value, styles.highlight]}>{osszesBefizetett} Ft</Text>
                </View>
                
                <View style={styles.infok}>
                    <Text style={styles.label}>Összes óra:</Text>
                    <Text style={[styles.value, styles.highlight]}>{osszesOra}</Text>
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
        width: '90%',
        borderRadius: 12,
        padding: 25,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        borderLeftWidth: 6,
        borderLeftColor: '#4CAF50',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00796B',
        marginBottom: 20,
        textAlign: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(76, 175, 80, 0.2)',
    },
    infok: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(76, 175, 80, 0.1)',
    },
    label: {
        fontSize: 18,
        color: '#388E3C',
        fontWeight: '500',
    },
    value: {
        fontSize: 18,
        color: '#2E7D32',
        fontWeight: '600',
    },
    highlight: {
        color: '#00796B',
        fontWeight: 'bold',
    },
});