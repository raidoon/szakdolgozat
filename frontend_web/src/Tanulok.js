import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";

const Tanulok = () => {
    const [adatok, setAdatok] = useState([]);
    const [kereses, setKereses] = useState("");
    const [loading, setLoading] = useState(true);
    const [hiba, setHiba] = useState(null);

    //ezt még majd be kell állítani
    const felhasznalo_autosiskola = 1;

    const letoltes = () => {
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
            setAdatok(data);
        })
        .catch((error) => {
            setHiba(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        letoltes();
    }, []);

    // Keresés a tanulók között
    const szurtAdatok = adatok.filter((item) =>
        item.tanulo_neve.toLowerCase().includes(kereses.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div style={styles.content}>
                <h2>Tanulók listája</h2>

                <input
                    type="text"
                    placeholder="Keresés név szerint..."
                    value={kereses}
                    onChange={(e) => setKereses(e.target.value)}
                    style={styles.input}
                />

                {loading && <p>Betöltés...</p>}
                {hiba && <p style={{ color: "red" }}>{hiba}</p>}

                {szurtAdatok.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Vizsgázott</th>
                                <th>Autósiskola</th>
                            </tr>
                        </thead>
                        <tbody>
                            {szurtAdatok.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.tanulo_neve}</td>
                                    <td>{item.tanulo_levizsgazott ? "✔️ Igen" : "❌ Nem"}</td>
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

const styles = {
    content: {
        padding: "20px",
        textAlign: "center",
        margin: "20px",
    },
    input: {
        padding: "10px",
        marginBottom: "20px",
        width: "80%",
        maxWidth: "400px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    table: {
        width: "80%",
        margin: "0 auto",
        borderCollapse: "collapse",
    },
    th: {
        borderBottom: "2px solid black",
        padding: "10px",
    },
    td: {
        borderBottom: "1px solid gray",
        padding: "10px",
    },
};

export default Tanulok;
