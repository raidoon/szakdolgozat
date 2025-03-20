import { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";

const OktatoValtas = () => {
    const [tanulok, setTanulok] = useState([]);
    const [oktatok, setOktatok] = useState([]);
    const [valasztottTanulo, setValasztottTanulo] = useState(null);
    const [ujOktatoId, setUjOktatoId] = useState("");
    const [uzenet, setUzenet] = useState("");

    const felhasznaloAdatok = useMemo(() => {
        return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
    }, []);

    const felhasznalo_autosiskola = felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola;

    // Aktuális tanulók és oktatók betöltése
    useEffect(() => {
        if (!felhasznalo_autosiskola) return;

        fetch(Ipcim.Ipcim + "/suliTanuloi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ felhasznalo_autosiskola }),
        })
            .then((res) => res.json())
            .then((data) => {
                setTanulok(data.filter((t) => t.tanulo_levizsgazott === 0)); // Csak aktuális diákok
            })
            .catch(() => setUzenet("Hiba történt a tanulók betöltésekor!"));

        fetch(Ipcim.Ipcim + "/AutosiskolaOktatoi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ felhasznalo_autosiskola }),
        })
            .then((res) => res.json())
            .then((data) => setOktatok(data))
            .catch(() => setUzenet("Hiba történt az oktatók betöltésekor!"));
    }, [felhasznalo_autosiskola]);

    // Tanuló kiválasztásának kezelése
    const handleTanuloValasztas = (e) => {
        const tanuloId = e.target.value;
        const tanulo = tanulok.find(t => t.tanulo_id.toString() === tanuloId);
        setValasztottTanulo(tanulo || null);
        setUjOktatoId(""); // Reset új oktató választás
    };

    // Oktatócsere kérése
    const oktatoCsere = () => {
        if (!valasztottTanulo || !ujOktatoId) {
            setUzenet("Válassz ki egy tanulót és egy új oktatót!");
            return;
        }

        fetch(Ipcim.Ipcim + "/oktatovaltas", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanulo_id: valasztottTanulo.tanulo_id, oktato_id: ujOktatoId }), // Frissítve!
        })        
            .then((res) => res.json())
            .then((data) => setUzenet(data.uzenet || "Sikeres oktatóváltás!"))
            .catch(() => setUzenet("Hiba történt az oktatóváltás során!"));
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2>Oktatóváltás</h2>

                {/* Tanuló kiválasztása */}
                <label>Tanuló kiválasztása:</label>
                <select onChange={handleTanuloValasztas} style={styles.select}>
                    <option value="">Válassz egy tanulót</option>
                    {tanulok.map((tanulo) => (
                        <option key={tanulo.tanulo_id} value={tanulo.tanulo_id}>
                            {tanulo.tanulo_neve}
                        </option>
                    ))}
                </select>

                {/* Jelenlegi oktató megjelenítése */}
                {valasztottTanulo && (
                    <p><strong>Jelenlegi oktató:</strong> {valasztottTanulo.oktato_neve || "Nincs oktató hozzárendelve"}</p>
                )}

                {/* Új oktató kiválasztása (kivéve a jelenlegit) */}
                <label>Új oktató kiválasztása:</label>
                <select onChange={(e) => setUjOktatoId(e.target.value)} style={styles.select}>
                    <option value="">Válassz egy oktatót</option>
                    {oktatok
                        .filter(oktato => oktato.oktato_id !== (valasztottTanulo?.tanulo_oktatoja || "")) 
                        .map((oktato) => (
                            <option key={oktato.oktato_id} value={oktato.oktato_id}>
                                {oktato.oktato_neve}
                            </option>
                        ))}

                </select>

                <button onClick={oktatoCsere} style={styles.button}>Oktatóváltás</button>

                {uzenet && <p style={styles.message}>{uzenet}</p>}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        textAlign: "center",
    },
    select: {
        padding: "10px",
        marginBottom: "20px",
        width: "80%",
        maxWidth: "400px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "10px",
    },
    message: {
        marginTop: "15px",
        color: "green",
    },
};

export default OktatoValtas;
