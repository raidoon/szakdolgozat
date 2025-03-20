import { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";

const AktualisDiakok = () => {
    const [adatok, setAdatok] = useState([]);
    const [kereses, setKereses] = useState("");
    const [loading, setLoading] = useState(true);
    const [hiba, setHiba] = useState(null);

    const felhasznaloAdatok = useMemo(() => {
        return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
    }, []);

    const felhasznalo_autosiskola = felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola;

    useEffect(() => {
        if (!felhasznalo_autosiskola) return; // Ha nincs adat, ne fusson le

        setLoading(true);
        setHiba(null);

        fetch(Ipcim.Ipcim + "/suliTanuloi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ felhasznalo_autosiskola }),
        })
        .then((response) => {
            console.log("🔍 Backend válasza:", response);
            if (!response.ok) {
                throw new Error(`Hálózati hiba: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("📊 Lekért tanulók:", data);
            setAdatok(data.filter((item) => item.tanulo_levizsgazott === 0));
        })
        .catch((error) => {
            console.error(" Hiba történt a lekérés során:", error);
            setHiba(error.message);
        })
        .finally(() => {  // ❌ ITT VOLT A HIBA! (A .catch() után volt egy extra `;`)
            setLoading(false);
        });
    }, [felhasznalo_autosiskola]); // ✅ Dependency array-ben szerepel!

    const szurtAdatok = adatok.filter((item) =>
        item.tanulo_neve.toLowerCase().includes(kereses.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Aktuális Diákok</h2>

                <input
                    type="text"
                    placeholder="Keresés név szerint..."
                    value={kereses}
                    onChange={(e) => setKereses(e.target.value)}
                    style={{ padding: "10px", width: "80%", maxWidth: "400px" }}
                />

                {loading && <p>Betöltés...</p>}
                {hiba && <p style={{ color: "red" }}>{hiba}</p>}

                {szurtAdatok.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Autósiskola</th>
                            </tr>
                        </thead>
                        <tbody>
                            {szurtAdatok.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.tanulo_neve}</td>
                                    <td>{item.autosiskola_nev}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nincs találat.</p>
                )}
            </div>
        </div>
    );
};

export default AktualisDiakok;
