import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Ipcim from "./Ipcim";
import Navbar from "./Navbar";

const TanuloReszletek = () => {
    const { tanuloId } = useParams(); // Extract tanuloId from the URL
    const [tanulo, setTanulo] = useState(null);
    const [oktatok, setOktatok] = useState([]); // State for instructors
    const [ujOktatoId, setUjOktatoId] = useState(""); // State for new instructor ID
    const [uzenet, setUzenet] = useState(""); // State for messages
    const [loading, setLoading] = useState(true);
    const [hiba, setHiba] = useState(null);

    const felhasznaloAdatok = JSON.parse(localStorage.getItem("felhasznaloAdatok"));
    const felhasznalo_autosiskola = felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola;

    // Fetch student details
    useEffect(() => {
        setLoading(true);
        setHiba(null);

        fetch(Ipcim.Ipcim + "/tanuloReszletei", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanulo_felhasznaloID: tanuloId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Hálózati hiba: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setTanulo(data[0]); // Assuming the response is an array with one object
            })
            .catch((error) => {
                console.error("Hiba történt a lekérés során:", error);
                setHiba(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tanuloId]);

    // Fetch instructors (only for current students)
    useEffect(() => {
        if (!felhasznalo_autosiskola || (tanulo && tanulo.tanulo_levizsgazott === 1)) return;

        fetch(Ipcim.Ipcim + "/AutosiskolaOktatoi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ felhasznalo_autosiskola }),
        })
            .then((res) => res.json())
            .then((data) => setOktatok(data))
            .catch(() => setUzenet("Hiba történt az oktatók betöltésekor!"));
    }, [felhasznalo_autosiskola, tanulo]);

    // Handle instructor change
    const oktatoCsere = () => {
        if (!tanulo || !ujOktatoId) {
            setUzenet("Válassz ki egy új oktatót!");
            return;
        }

        fetch(Ipcim.Ipcim + "/oktatovaltas", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanulo_id: tanulo.tanulo_id, oktato_id: ujOktatoId }),
        })
            .then((res) => res.json())
            .then((data) => {
                setUzenet(data.uzenet || "Sikeres oktatóváltás!");
                // Refresh student details after successful change
                fetch(Ipcim.Ipcim + "/tanuloReszletei", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tanulo_felhasznaloID: tanuloId }),
                })
                    .then((res) => res.json())
                    .then((data) => setTanulo(data[0]))
                    .catch(() => setUzenet("Hiba történt a tanuló adatainak frissítésekor!"));
            })
            .catch(() => setUzenet("Hiba történt az oktatóváltás során!"));
    };

    if (loading) return <p>Betöltés...</p>;
    if (hiba) return <p style={{ color: "red" }}>{hiba}</p>;
    if (!tanulo) return <p>Nincs ilyen tanuló.</p>;

    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Tanuló részletei</h2>
                <p><strong>Név:</strong> {tanulo.tanulo_neve}</p>
                <p><strong>Jelenlegi oktató:</strong> {tanulo.oktato_neve || "Nincs oktató hozzárendelve"}</p>

                {/* Oktatóváltás (only for current students) */}
                {tanulo.tanulo_levizsgazott === 0 && (
                    <>
                        <h3>Oktatóváltás</h3>
                        <label>Új oktató kiválasztása:</label>
                        <select
                            onChange={(e) => setUjOktatoId(e.target.value)}
                            style={{ padding: "10px", marginBottom: "20px", width: "80%", maxWidth: "400px" }}
                        >
                            <option value="">Válassz egy oktatót</option>
                            {oktatok
                                .filter(oktato => oktato.oktato_id !== (tanulo?.tanulo_oktatoja || "")) // Exclude current instructor
                                .map((oktato) => (
                                    <option key={oktato.oktato_id} value={oktato.oktato_id}>
                                        {oktato.oktato_neve}
                                    </option>
                                ))}
                        </select>

                        <button
                            onClick={oktatoCsere}
                            style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                        >
                            Oktatóváltás
                        </button>
                    </>
                )}

                {uzenet && <p style={{ marginTop: "15px", color: "green" }}>{uzenet}</p>}
            </div>
        </div>
    );
};

export default TanuloReszletek;