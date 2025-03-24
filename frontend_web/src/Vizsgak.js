import React, { useState, useEffect, useMemo } from "react";
import Ipcim from "./Ipcim";
import Navbar from "./Navbar";

const Vizsgak = () => {
  const [diakTomb, setDiakTomb] = useState([]);
  const [vizsgaTomb, setVizsgaTomb] = useState([]);
  const [selectedDiak, setSelectedDiak] = useState("");
  const [datum, setDatum] = useState("");
  const [oraPerc, setOraPerc] = useState("");
  const [hiba, setHiba] = useState("");
  const [loading, setLoading] = useState(false);

  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []);

  const felhasznalo_autosiskola = felhasznaloAdatok?.felhasznalo?.felhasznalo_autosiskola;

  useEffect(() => {
    if (!felhasznalo_autosiskola) return;

    const fetchDiakok = async () => {
      setLoading(true);
      setHiba(null);

      try {
        const response = await fetch(Ipcim.Ipcim + "/suliTanuloi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ felhasznalo_autosiskola }),
        });

        if (!response.ok) {
          throw new Error(`Hálózati hiba: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const filteredDiakok = data.filter((item) => item.tanulo_levizsgazott === 0);

        setDiakTomb(
          filteredDiakok.map((item) => ({
            label: item.tanulo_neve,
            value: String(item.tanulo_id),
            oktato_id: item.tanulo_oktatoja,
          }))
        );
      } catch (error) {
        console.error("Hiba történt a lekérés során:", error);
        setHiba(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiakok();
  }, [felhasznalo_autosiskola]);

  const fetchVizsgak = async () => {
    try {
      const response = await fetch(Ipcim.Ipcim + "/vizsgak");
      const data = await response.json();
      setVizsgaTomb(data);
    } catch (error) {
      console.error("Hiba a vizsgák lekérdezésekor:", error);
    }
  };

  useEffect(() => {
    fetchVizsgak();
  }, []);

  const ujVizsgaFelvitel = async () => {
    if (!datum || !oraPerc || !selectedDiak) {
      setHiba("Minden mező kitöltése kötelező!");
      return;
    }

    const selectedDiakAdat = diakTomb.find((item) => item.value === selectedDiak);
    if (!selectedDiakAdat) {
      setHiba("Érvénytelen diák kiválasztva!");
      return;
    }

    const oktato_id = selectedDiakAdat.oktato_id;

    try {
      const response = await fetch(Ipcim.Ipcim + "/vizsgaFelvitel", {
        method: "POST",
        body: JSON.stringify({
            bevitel1: 2, // Vizsga típusa (2)
            bevitel2: oktato_id,
            bevitel3: selectedDiak,
            bevitel4: `${datum} ${oraPerc}`,
            bevitel5: "", // Kezdés helye (opcionális)
          }),          
        headers: { "Content-Type": "application/json" },
      });

      const text = await response.text();
      setHiba(""); // Clear any previous errors
      alert("Vizsga sikeresen rögzítve: " + text);
      fetchVizsgak();
    } catch (error) {
      console.error("Hiba a vizsga rögzítésében:", error);
      setHiba("Hiba történt a vizsga rögzítésekor");
    }
  };

  const torolVizsga = async (ora_id) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a vizsgát?")) {
      return;
    }
  
    try {
      const response = await fetch(Ipcim.Ipcim + "/oraTorles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ora_id }),
      });
  
      if (!response.ok) {
        throw new Error(`Hiba a törlés során: ${response.status}`);
      }
  
      const data = await response.json();
      alert(data.message);
      setVizsgaTomb((prevVizsgak) => prevVizsgak.filter((vizsga) => vizsga.ora_id !== ora_id));
    } catch (error) {
      console.error("Hiba a vizsga törlése során:", error);
    }
  };

  const vizsgakHaviBontasban = vizsgaTomb.reduce((acc, vizsga) => {
    const honap = new Date(vizsga.ora_datuma).toLocaleString("hu-HU", { month: "long", year: "numeric" });
    if (!acc[honap]) acc[honap] = [];
    acc[honap].push(vizsga);
    return acc;
  }, {});

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
          Vizsgák kezelése
        </h2>

        <div style={{ 
          backgroundColor: "#f8fafd", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "25px",
          borderLeft: "4px solid #2c7be5"
        }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#4a6f8a",
              fontWeight: "500"
            }}>Válassz tanulót:</label>
            <select 
              value={selectedDiak || ""} 
              onChange={(e) => setSelectedDiak(e.target.value)}
              style={{
                padding: "10px 15px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #e1e7ec",
                backgroundColor: "white",
                color: "#12263f"
              }}
            >
              <option value="">-- Válassz tanulót --</option>
              {diakTomb.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "15px",
            marginBottom: "15px"
          }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#4a6f8a",
                fontWeight: "500"
              }}>Dátum:</label>
              <input 
                type="date" 
                value={datum} 
                onChange={(e) => setDatum(e.target.value)}
                style={{
                  padding: "10px 15px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #e1e7ec",
                  backgroundColor: "white",
                  color: "#12263f"
                }}
              />
            </div>
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#4a6f8a",
                fontWeight: "500"
              }}>Időpont:</label>
              <input 
                type="time" 
                value={oraPerc} 
                onChange={(e) => setOraPerc(e.target.value)}
                style={{
                  padding: "10px 15px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #e1e7ec",
                  backgroundColor: "white",
                  color: "#12263f"
                }}
              />
            </div>
          </div>

          <button 
            onClick={ujVizsgaFelvitel}
            style={{
              padding: "12px 25px",
              backgroundColor: "#00d97e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.2s",
              width: "100%",
              boxShadow: "0 2px 5px rgba(0, 217, 126, 0.2)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
          >
            Vizsga rögzítése
          </button>
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

        <h3 style={{
          color: "#2c7be5",
          marginBottom: "15px",
          borderBottom: "1px solid #e1e7ec",
          paddingBottom: "10px"
        }}>
          Felvett vizsgák (havi bontásban)
        </h3>

        <div style={{ marginTop: "20px" }}>
          {Object.entries(vizsgakHaviBontasban).map(([honap, vizsgak]) => (
            <div key={honap} style={{ marginBottom: "30px" }}>
              <h4 style={{
                color: "#4a6f8a",
                backgroundColor: "#f8fafd",
                padding: "10px 15px",
                borderRadius: "6px",
                marginBottom: "15px"
              }}>
                {honap}
              </h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: "15px"
              }}>
                {vizsgak.map((vizsga) => (
                  <div key={vizsga.ora_id} style={{
                    backgroundColor: "white",
                    padding: "15px",
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    borderLeft: "3px solid #2c7be5",
                    position: "relative"
                  }}>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#4a6f8a" }}>Tanuló:</strong> {vizsga.tanulo_neve}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#4a6f8a" }}>Időpont:</strong> {new Date(vizsga.ora_datuma).toLocaleString('hu-HU')}
                    </div>
                    <button 
                      onClick={() => torolVizsga(vizsga.ora_id)}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#ff5e5e",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.2s",
                        position: "absolute",
                        bottom: "15px",
                        right: "15px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e04545"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ff5e5e"}
                    >
                      Törlés
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vizsgak;






