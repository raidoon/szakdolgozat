import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ipcim from "./Ipcim";
import Navbar from "./Navbar";

const ElsoSiker = () => {
  const navigate = useNavigate();
  const [tanulok, setTanulok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Nincs dátum";
    const date = new Date(dateTimeString);
    return date.toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(Ipcim.Ipcim + "/elsoreSiker");
        if (!response.ok) {
          throw new Error(`Hálózati hiba: ${response.status}`);
        }
        const data = await response.json();
        setTanulok(Array.isArray(data) ? data : [data]); 
      } catch (err) {
        console.error("Hiba történt a lekérés során:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: "#f5f9ff", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "2px solid #e1e7ec", paddingBottom: "15px" }}>
          <h2 style={{ color: "#2c7be5", margin: 0 }}>
            Első sikeres vizsgák
          </h2>
          <button 
            onClick={() => navigate("/vizsgak")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2c7be5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
              boxShadow: "0 2px 5px rgba(44, 123, 229, 0.2)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
          >
            Vissza a vizsgákhoz
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#4a6f8a" }}>
            Betöltés...
          </div>
        ) : error ? (
          <div style={{ padding: "15px", backgroundColor: "#fff0f0", color: "#d92525", borderRadius: "6px", marginBottom: "20px", border: "1px solid #ffd6d6" }}>
            {error}
          </div>
        ) : tanulok.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#4a6f8a" }}>
            Nincsenek első sikeres vizsgák rögzítve
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
              gap: "15px"
            }}>
              {tanulok.map((tanulo) => (
                <div key={tanulo.tanulo_id} style={{ 
                  backgroundColor: "white",
                  padding: "15px", 
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  borderLeft: "3px solid #00d97e",
                  position: "relative"
                }}>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "#4a6f8a" }}>Név:</strong> {tanulo.tanulo_neve} <br />
                    <strong style={{ color: "#4a6f8a" }}>Oktató:</strong> {tanulo.oktato_neve} <br />
                    <strong style={{ color: "#4a6f8a" }}>Óra dátuma:</strong> {formatDateTime(tanulo.ora_datuma)}
                    <div style={{ marginBottom: "10px" }}>
 
</div>

                  </div>
                  
                  
                  <div style={{ 
                    position: "absolute", 
                    top: "15px", 
                    right: "15px",
                    backgroundColor: "#00d97e",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    Első sikeres
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElsoSiker;