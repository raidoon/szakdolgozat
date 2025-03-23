import React, { useState, useEffect, useMemo } from "react";
import Ipcim from "./Ipcim";
import Navbar from "./Navbar";
import "./css/Vizsgak.css";

const Vizsgak = () => {
  const [diakTomb, setDiakTomb] = useState([]);
  const [vizsgaTomb, setVizsgaTomb] = useState([]);
  const [selectedDiak, setSelectedDiak] = useState("");
  const [datum, setDatum] = useState("");
  const [oraPerc, setOraPerc] = useState("");
  const [hiba, setHiba] = useState("");
  const [loading, setLoading] = useState(false);

  // Felhasználó adatok betöltése a localStorage-ból
  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []);

  const felhasznalo_autosiskola = felhasznaloAdatok?.felhasznalo?.felhasznalo_autosiskola;

  // ✅ **Tanulók betöltése**
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

  // ✅ **Vizsgák lekérdezése**
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

  // ✅ **Új vizsga felvitele**
  const ujVizsgaFelvitel = async () => {
    if (!datum || !oraPerc || !selectedDiak) {
      alert("Minden mező kitöltése kötelező!");
      return;
    }

    const selectedDiakAdat = diakTomb.find((item) => item.value === selectedDiak);
    if (!selectedDiakAdat) {
      alert("Érvénytelen diák kiválasztva!");
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
      alert("Vizsga sikeresen rögzítve: " + text);
      fetchVizsgak(); // Frissíti a vizsgák listáját
    } catch (error) {
      console.error("Hiba a vizsga rögzítésében:", error);
    }
  };

  // ✅ **Vizsga törlése**
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
  
      // Frissítjük a listát a törölt vizsga eltávolításával
      setVizsgaTomb((prevVizsgak) => prevVizsgak.filter((vizsga) => vizsga.ora_id !== ora_id));
    } catch (error) {
      console.error("Hiba a vizsga törlése során:", error);
    }
  };
  

  // ✅ **Havi bontás**
  const vizsgakHaviBontasban = vizsgaTomb.reduce((acc, vizsga) => {
    const honap = new Date(vizsga.ora_datuma).toLocaleString("hu-HU", { month: "long", year: "numeric" });

    if (!acc[honap]) {
      acc[honap] = [];
    }

    acc[honap].push(vizsga);
    return acc;
  }, {});

  return (
        <div style={{ all: "unset" }}>

          <Navbar />
          <div className="content">
            <h2>Vizsgák kezelése</h2>
      
            <label className="label">Válassz tanulót:</label>
            <select value={selectedDiak || ""} onChange={(e) => setSelectedDiak(e.target.value)}>
              <option value="">-- Válassz tanulót --</option>
              {diakTomb.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
      
            <label className="label">Válassz dátumot:</label>
            <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
      
            <label className="label">Válassz időpontot:</label>
            <input type="time" value={oraPerc} onChange={(e) => setOraPerc(e.target.value)} />
      
            <button onClick={ujVizsgaFelvitel}>Vizsga rögzítése</button>
      
            {loading && <p>Betöltés...</p>}
            {hiba && <p style={{ color: "red" }}>{hiba}</p>}
      
            <h3>Felvett vizsgák (havi bontásban)</h3>
            <div className="vizsga-lista">
            {Object.entries(vizsgakHaviBontasban).map(([honap, vizsgak]) => (
                <div key={honap} className="vizsga-honap">
                <h4>{honap}</h4>
                {vizsgak.map((vizsga) => (
                    <div className="vizsga-kartya" key={vizsga.ora_id}>
                    <span>{vizsga.tanulo_neve} - {vizsga.ora_datuma}</span>
                    <button className="torles-gomb" onClick={() => torolVizsga(vizsga.ora_id)}>Törlés</button>
                    </div>
                ))}
                </div>
            ))}
            </div>


          </div>
        </div>
      );
};

export default Vizsgak;






