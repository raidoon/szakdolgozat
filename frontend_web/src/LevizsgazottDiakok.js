import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
        if (!felhasznalo_autosiskola) return;

        setLoading(true);
        setHiba(null);

        fetch(Ipcim.Ipcim + "/suliTanuloi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ felhasznalo_autosiskola }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Hálózati hiba: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            setAdatok(data.filter((item) => item.tanulo_levizsgazott === 1));
        })
        .catch((error) => {
            console.error("Hiba történt a lekérés során:", error);
            setHiba(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [felhasznalo_autosiskola]);

    const szurtAdatok = adatok.filter((item) =>
        item.tanulo_neve.toLowerCase().includes(kereses.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: "#f5f9ff", minHeight: "100vh" }}>
            <Navbar />
            <div style={{
                maxWidth: "1000px",
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
                    Levizsgázott Diákok
                </h2>

                <div style={{ marginBottom: "25px", textAlign: "center" }}>
                    <input
                        type="text"
                        placeholder="Keresés név szerint..."
                        value={kereses}
                        onChange={(e) => setKereses(e.target.value)}
                        style={{
                            padding: "12px 15px",
                            width: "100%",
                            maxWidth: "400px",
                            borderRadius: "6px",
                            border: "1px solid #e1e7ec",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.2s",
                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
                        }}
                    />
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "20px", color: "#4a6f8a" }}>
                        Betöltés...
                    </div>
                )}

                {hiba && (
                    <div style={{
                        padding: "15px",
                        backgroundColor: "#fff0f0",
                        color: "#d92525",
                        borderRadius: "6px",
                        marginBottom: "20px",
                        border: "1px solid #ffd6d6"
                    }}>
                        {hiba}
                    </div>
                )}

                {szurtAdatok.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f8fafd" }}>
                                    <th style={{
                                        padding: "15px",
                                        textAlign: "left",
                                        color: "#4a6f8a",
                                        fontWeight: "600",
                                        borderBottom: "1px solid #e1e7ec"
                                    }}>Név</th>
                                    <th style={{
                                        padding: "15px",
                                        textAlign: "left",
                                        color: "#4a6f8a",
                                        fontWeight: "600",
                                        borderBottom: "1px solid #e1e7ec"
                                    }}>Autósiskola</th>
                                    <th style={{
                                        padding: "15px",
                                        textAlign: "left",
                                        color: "#4a6f8a",
                                        fontWeight: "600",
                                        borderBottom: "1px solid #e1e7ec"
                                    }}>Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {szurtAdatok.map((item, index) => (
                                    <tr key={index} style={{
                                        borderBottom: "1px solid #e1e7ec",
                                        transition: "background-color 0.2s",
                                        ":hover": {
                                            backgroundColor: "#f8fafd"
                                        }
                                    }}>
                                        <td style={{ padding: "15px", color: "#12263f" }}>{item.tanulo_neve}</td>
                                        <td style={{ padding: "15px", color: "#4a6f8a" }}>{item.autosiskola_nev}</td>
                                        <td style={{ padding: "15px" }}>
                                            <Link 
                                                to={`/tanuloreszletek/${item.tanulo_felhasznaloID}`}
                                                style={{
                                                    padding: "8px 15px",
                                                    backgroundColor: "#00d97e",
                                                    color: "white",
                                                    borderRadius: "4px",
                                                    textDecoration: "none",
                                                    fontSize: "14px",
                                                    display: "inline-block",
                                                    transition: "all 0.2s",
                                                    ":hover": {
                                                        backgroundColor: "#00c771",
                                                        transform: "translateY(-1px)"
                                                    }
                                                }}
                                            >
                                                Részletek
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    !loading && (
                        <div style={{
                            padding: "20px",
                            backgroundColor: "#f8fafd",
                            borderRadius: "8px",
                            textAlign: "center",
                            color: "#6e84a3",
                            border: "1px dashed #e1e7ec"
                        }}>
                            Nincs találat.
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default LevizsgazottDiakok;

