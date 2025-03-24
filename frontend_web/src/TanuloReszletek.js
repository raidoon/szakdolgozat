import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Ipcim from "./Ipcim";
import Navbar from "./Navbar";

const TanuloReszletek = () => {
    const { tanuloId } = useParams();
    const [tanulo, setTanulo] = useState(null);
    const [oktatok, setOktatok] = useState([]);
    const [ujOktatoId, setUjOktatoId] = useState("");
    const [uzenet, setUzenet] = useState("");
    const [loading, setLoading] = useState(true);
    const [hiba, setHiba] = useState(null);
    const [oktatovaltasLathato, setOktatovaltasLathato] = useState(false);
    const [orak, setOrak] = useState([]);
    const [orakLathato, setOrakLathato] = useState(false);
    const [befizetes, setBefizetes] = useState([]);
    const [befizetesLathato, setBefizetesLathato] = useState(false);

    const felhasznaloAdatok = JSON.parse(localStorage.getItem("felhasznaloAdatok"));
    const felhasznalo_autosiskola = felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola;

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
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
                setTanulo(data[0]);
            })
            .catch((error) => {
                console.error("Hiba történt a lekérés során:", error);
                setHiba(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tanuloId]);

    useEffect(() => {
        if (!tanulo || !tanulo.tanulo_felhasznaloID) return;

        fetch(Ipcim.Ipcim + "/diakokOrai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID }),
        })
            .then((res) => res.json())
            .then((data) => setOrak(data))
            .catch(() => setUzenet("Hiba történt az órák betöltésekor!"));
    }, [tanulo]);

    useEffect(() => {
        if (!tanulo || !tanulo.tanulo_felhasznaloID) return;

        fetch(Ipcim.Ipcim + "/diakokBefizetesei", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanulo_felhasznaloID: tanulo.tanulo_felhasznaloID }),
        })
            .then((res) => res.json())
            .then((data) => setBefizetes(data))
            .catch(() => setUzenet("Hiba történt a befizetések betöltésekor!"));
    }, [tanulo]);

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

    if (loading) return <div style={{ textAlign: "center", padding: "20px" }}>Betöltés...</div>;
    if (hiba) return <div style={{ textAlign: "center", padding: "20px", color: "red" }}>{hiba}</div>;
    if (!tanulo) return <div style={{ textAlign: "center", padding: "20px" }}>Nincs ilyen tanuló.</div>;

    return (
        <div style={{ backgroundColor: "#f5f9ff", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ 
                maxWidth: "800px", 
                margin: "0 auto", 
                padding: "30px", 
                backgroundColor: "white", 
                borderRadius: "10px", 
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                marginTop: "20px"
            }}>
                <h2 style={{ 
                    color: "#2c7be5", 
                    marginBottom: "25px", 
                    textAlign: "center",
                    borderBottom: "2px solid #e1e7ec",
                    paddingBottom: "15px"
                }}>
                    Tanuló részletei
                </h2>
                
                <div style={{ 
                    backgroundColor: "#f8fafd", 
                    padding: "20px", 
                    borderRadius: "8px", 
                    marginBottom: "25px",
                    borderLeft: "4px solid #2c7be5"
                }}>
                    <p style={{ margin: "10px 0", fontSize: "16px" }}>
                        <strong style={{ color: "#4a6f8a", minWidth: "150px", display: "inline-block" }}>Név:</strong> 
                        <span style={{ color: "#12263f" }}>{tanulo.tanulo_neve}</span>
                    </p>
                    <p style={{ margin: "10px 0", fontSize: "16px" }}>
                        <strong style={{ color: "#4a6f8a", minWidth: "150px", display: "inline-block" }}>Jelenlegi oktató:</strong> 
                        <span style={{ color: "#12263f" }}>{tanulo.oktato_neve || "Nincs oktató hozzárendelve"}</span>
                    </p>
                </div>

                <div style={{ 
                    display: "flex", 
                    gap: "15px", 
                    marginBottom: "25px",
                    justifyContent: "center",
                    flexWrap: "wrap"
                }}>
                    <button 
                        onClick={() => setOrakLathato(!orakLathato)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: orakLathato ? "#e1e7ec" : "#2c7be5",
                            color: orakLathato ? "#4a6f8a" : "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "all 0.2s"
                        }}
                    >
                        {orakLathato ? "Órák elrejtése" : "Órák megtekintése"}
                    </button>

                    <button 
                        onClick={() => setBefizetesLathato(!befizetesLathato)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: befizetesLathato ? "#e1e7ec" : "#2c7be5",
                            color: befizetesLathato ? "#4a6f8a" : "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "all 0.2s"
                        }}
                    >
                        {befizetesLathato ? "Befizetések elrejtése" : "Befizetések megtekintése"}
                    </button>
                </div>

                {orakLathato && (
                    <div style={{ 
                        backgroundColor: "#f8fafd", 
                        padding: "20px", 
                        borderRadius: "8px", 
                        marginBottom: "20px",
                        border: "1px solid #e1e7ec"
                    }}>
                        <h3 style={{ color: "#2c7be5", marginTop: "0", marginBottom: "15px" }}>Órák</h3>
                        {orak.length === 0 ? (
                            <p style={{ color: "#6e84a3" }}>Nincs elérhető óra.</p>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
                                {orak.map((ora, index) => (
                                    <div key={index} style={{ 
                                        backgroundColor: "white", 
                                        padding: "15px", 
                                        borderRadius: "6px", 
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                    }}>
                                        <p style={{ margin: "5px 0", color: "#4a6f8a" }}>
                                        <strong>Dátum:</strong> {ora.ora_datuma ? formatDateTime(ora.ora_datuma) : "Nincs dátum"}
                                        </p>
                                        
                                        <p style={{ margin: "5px 0", color: "#4a6f8a" }}>
                                            <strong>Típus:</strong> {ora.oratipus_neve || "Nincs megadva"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {befizetesLathato && (
                    <div style={{ 
                        backgroundColor: "#f8fafd", 
                        padding: "20px", 
                        borderRadius: "8px", 
                        marginBottom: "20px",
                        border: "1px solid #e1e7ec"
                    }}>
                        <h3 style={{ color: "#2c7be5", marginTop: "0", marginBottom: "15px" }}>Befizetések</h3>
                        {befizetes.length === 0 ? (
                            <p style={{ color: "#6e84a3" }}>Nincs elérhető befizetés.</p>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
                                {befizetes.map((befizetes, index) => (
                                    <div key={index} style={{ 
                                        backgroundColor: "white", 
                                        padding: "15px", 
                                        borderRadius: "6px", 
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                    }}>
                                        <p style={{ margin: "5px 0", color: "#4a6f8a" }}>
                                            <strong>Dátum:</strong> {befizetes.befizetesek_ideje ? formatDateTime(befizetes.befizetesek_ideje) : "Nincs dátum"}
                                        </p>
                                        <p style={{ margin: "5px 0", color: "#4a6f8a" }}>
                                            <strong>Összeg:</strong> {befizetes.befizetesek_osszeg} Ft
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tanulo.tanulo_levizsgazott === 0 && (
                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={() => setOktatovaltasLathato(!oktatovaltasLathato)}
                            style={{
                                padding: "12px 25px",
                                backgroundColor: oktatovaltasLathato ? "#e1e7ec" : "#00d97e",
                                color: oktatovaltasLathato ? "#4a6f8a" : "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500",
                                display: "block",
                                margin: "0 auto",
                                transition: "all 0.2s"
                            }}
                        >
                            {oktatovaltasLathato ? "Oktatóváltás elrejtése" : "Oktatóváltás megnyitása"}
                        </button>

                        {oktatovaltasLathato && (
                            <div style={{ 
                                marginTop: "25px", 
                                padding: "20px", 
                                borderRadius: "8px", 
                                backgroundColor: "#f8fafd",
                                border: "1px solid #e1e7ec"
                            }}>
                                <h3 style={{ color: "#2c7be5", marginTop: "0" }}>Oktatóváltás</h3>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ 
                                        display: "block", 
                                        marginBottom: "8px", 
                                        color: "#4a6f8a",
                                        fontWeight: "500"
                                    }}>
                                        Új oktató kiválasztása:
                                    </label>
                                    <select
                                        onChange={(e) => setUjOktatoId(e.target.value)}
                                        style={{ 
                                            padding: "10px 15px", 
                                            width: "100%", 
                                            maxWidth: "400px", 
                                            borderRadius: "6px",
                                            border: "1px solid #e1e7ec",
                                            backgroundColor: "white",
                                            color: "#12263f"
                                        }}
                                    >
                                        <option value="">Válassz egy oktatót</option>
                                        {oktatok
                                            .filter(oktato => oktato.oktato_id !== (tanulo?.tanulo_oktatoja || "")) 
                                            .map((oktato) => (
                                                <option key={oktato.oktato_id} value={oktato.oktato_id}>
                                                    {oktato.oktato_neve}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <button
                                    onClick={oktatoCsere}
                                    style={{ 
                                        padding: "12px 25px", 
                                        backgroundColor: "#00d97e", 
                                        color: "white", 
                                        border: "none", 
                                        borderRadius: "6px", 
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        transition: "all 0.2s",
                                        marginTop: "10px"
                                    }}
                                >
                                    Oktatóváltás
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {uzenet && (
                    <div style={{ 
                        marginTop: "20px", 
                        padding: "15px", 
                        backgroundColor: uzenet.includes("Hiba") ? "#fff0f0" : "#f0fff4",
                        color: uzenet.includes("Hiba") ? "#d92525" : "#00a854",
                        borderRadius: "6px",
                        textAlign: "center",
                        border: uzenet.includes("Hiba") ? "1px solid #ffd6d6" : "1px solid #d4edda"
                    }}>
                        {uzenet}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TanuloReszletek;
