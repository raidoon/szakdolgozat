import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ipcim from "../../../Ipcim";

export default function Oktato_TanuloReszletei({ route }) {
    const { tanulo } = route.params;
    const [email, setEmail] = useState("");
    const [telefonszam, setTelefonszam] = useState("");
    const [osszesBefizetett, setOsszesBefizetett] = useState(0);
    const [osszesOra, setOsszesOra] = useState(0);

    const fetchData = async () => {
        try {
            const body = JSON.stringify({ tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID });
            const headers = { "Content-Type": "application/json; charset=UTF-8" };

            const [res1, res2, res3] = await Promise.all([
                fetch(Ipcim.Ipcim + "/tanuloReszletei", { method: "POST", body, headers }),
                fetch(Ipcim.Ipcim + "/tanuloOsszesFizu", { method: "POST", body, headers }),
                fetch(Ipcim.Ipcim + "/tanuloOsszesOra", { method: "POST", body, headers })
            ]);

            if (!res1.ok || !res2.ok || !res3.ok) throw new Error("Hiba történt a lekérdezés során.");

            const [adatok, fizuData, oraData] = await Promise.all([res1.json(), res2.json(), res3.json()]);

            if (adatok.length > 0) {
                setEmail(adatok[0].felhasznalo_email);
                setTelefonszam(adatok[0].felhasznalo_telefonszam);
            }
            setOsszesBefizetett(fizuData[0]?.osszesBefizetett ?? 0);
            setOsszesOra(oraData[0]?.osszesOra ?? 0);
        } catch (err) {
            console.error(err);
            alert("Hiba az adatok lekérése során.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Tanuló Részletei</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Név:</Text>
                    <Text style={styles.value}>{tanulo.tanulo_neve}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{email}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Telefonszám:</Text>
                    <Text style={styles.value}>{telefonszam}</Text>
                </View>

                <View style={[styles.highlightBox]}>
                    <Text style={styles.highlightLabel}>Összes befizetés:</Text>
                    <Text style={styles.highlightValue}>{osszesBefizetett} Ft</Text>
                </View>

                <View style={styles.highlightBox}>
                    <Text style={styles.highlightLabel}>Összes óra:</Text>
                    <Text style={styles.highlightValue}>{osszesOra}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6F8",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 25,
        borderRadius: 16,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#2E7D32",
        marginBottom: 25,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        paddingBottom: 8,
    },
    label: {
        fontSize: 16,
        color: "#555",
        fontWeight: "500",
    },
    value: {
        fontSize: 16,
        color: "#111",
        fontWeight: "600",
    },
    highlightBox: {
        backgroundColor: "#E8F5E9",
        borderRadius: 8,
        padding: 12,
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    highlightLabel: {
        fontSize: 16,
        color: "#388E3C",
        fontWeight: "600",
    },
    highlightValue: {
        fontSize: 16,
        color: "#1B5E20",
        fontWeight: "bold",
    },
});
