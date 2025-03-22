import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; // Import Link
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";

const LevizsgazottDiakok = () => {
    const [adatok, setAdatok] = useState([]);
    const [kereses, setKereses] = useState("");
    const [loading, setLoading] = useState(true);
    const [hiba, setHiba] = useState(null);

    const felhasznaloAdatok = useMemo(() => {
        return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
    }, []);

    const felhasznalo_autosiskola = felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola;

    useEffect(() => {
        if (!felhasznalo_autosiskola) return; // Ha nincs érték, ne csináljon semmit

        setLoading(true);
        setHiba(null);

        fetch(Ipcim.Ipcim + "/suliTanuloi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ felhasznalo_autosiskola }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Hálózati hiba");
                }
                return response.json();
            })
            .then((data) => {
                setAdatok(data.filter((item) => item.tanulo_levizsgazott === 1)); // Csak vizsgázottak
            })
            .catch((error) => {
                setHiba(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [felhasznalo_autosiskola]); // ✅ Hozzáadva a dependency array-hez!

    const szurtAdatok = adatok.filter((item) =>
        item.tanulo_neve.toLowerCase().includes(kereses.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Levizsgázott Diákok</h2>

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
                                <th>Műveletek</th> {/* New column for the link */}
                            </tr>
                        </thead>
                        <tbody>
                            {szurtAdatok.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.tanulo_neve}</td>
                                    <td>{item.autosiskola_nev}</td>
                                    <td>
                                        <Link to={`/tanuloreszletek/${item.tanulo_felhasznaloID}`}>
                                            Részletek
                                        </Link>
                                    </td>
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

export default LevizsgazottDiakok;


