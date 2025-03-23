import React, { useState, useEffect, useMemo } from "react";
import Ipcim from "./Ipcim"; // Adjust the import path as needed
import "./css/Penzugyek.css"; // Ensure the CSS file is correctly imported

const Penzugyek = () => {
  const [adatTomb, setAdatTomb] = useState([]);
  const [diakTomb, setDiakTomb] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  const [selectedDiak, setSelectedDiak] = useState(null);
  const [datum, setDatum] = useState("");
  const [oraPerc, setOraPerc] = useState("");
  const [osszeg, setOsszeg] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hiba, setHiba] = useState("");

  // Get user data from localStorage
  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []);

  const felhasznalo_autosiskola = felhasznaloAdatok?.felhasznalo?.felhasznalo_autosiskola;

  // Fetch típusok
  useEffect(() => {
    const fetchAdatok = async () => {
      try {
        const response = await fetch(Ipcim.Ipcim + "/valasztTipus");
        const data = await response.json();
        setAdatTomb(data.map((item) => ({ label: item.oratipus_neve, value: item.oratipus_id })));
      } catch (error) {
        console.error("Hiba a valasztTipus adatok betöltésekor:", error);
      }
    };
    fetchAdatok();
  }, []);

  // Fetch diákok where tanulo_levizsgazott = 0
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
        // Filter students where tanulo_levizsgazott = 0
        const filteredDiakok = data.filter((item) => item.tanulo_levizsgazott === 0);
        setDiakTomb(
          filteredDiakok.map((item) => ({
            label: item.tanulo_neve,
            value: String(item.tanulo_id), // Ensure value is a string
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

  const felvitel = async () => {
    if (!datum || !oraPerc || !selectedValue || !selectedDiak || !osszeg) {
      alert("Minden mező kitöltése kötelező!");
      return;
    }

    console.log("diakTomb:", diakTomb);
    console.log("selectedDiak:", selectedDiak);

    // Find the selected diák's oktato_id
    const selectedDiakAdat = diakTomb.find((item) => item.value === selectedDiak);

    console.log("selectedDiakAdat:", selectedDiakAdat);

    if (!selectedDiakAdat) {
      alert("Érvénytelen diák kiválasztva!");
      return;
    }

    const oktato_id = selectedDiakAdat.oktato_id;

    if (!oktato_id) {
      alert("Nincs érvényes oktató ID!");
      return;
    }

    try {
      const response = await fetch(Ipcim.Ipcim + "/suliBefizetesFelvitel", {
        method: "POST",
        body: JSON.stringify({
          bevitel1: selectedDiak,
          bevitel2: oktato_id,
          bevitel3: selectedValue,
          bevitel4: osszeg,
          bevitel5: `${datum} ${oraPerc}`,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const text = await response.text();
      alert("Befizetés sikeresen rögzítve: " + text);
    } catch (error) {
      console.error("Hiba a befizetés rögzítésében:", error);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h2 className="title">Új befizetés rögzítése</h2>

        <label className="label">Válassz típust:</label>
        <select className="dropdown" value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
          <option value="">-- Válassz --</option>
          {adatTomb.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <label className="label">Válassz diákot:</label>
        <select className="dropdown" value={selectedDiak || ""} onChange={(e) => setSelectedDiak(e.target.value)}>
          <option value="">-- Válassz diákot --</option>
          {diakTomb.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <input type="number" className="input" placeholder="Összeg" value={osszeg} onChange={(e) => setOsszeg(e.target.value)} />

        <button className="button" onClick={() => setShowDatePicker(true)}>Dátum kiválasztása</button>
        {datum && <p className="dateText">{datum}</p>}

        <button className="button" onClick={() => setShowTimePicker(true)}>Idő kiválasztása</button>
        {oraPerc && <p className="dateText">{oraPerc}</p>}

        {showDatePicker && <input type="date" value={datum} onChange={(e) => { setDatum(e.target.value); setShowDatePicker(false); }} />}
        {showTimePicker && <input type="time" value={oraPerc} onChange={(e) => { setOraPerc(e.target.value); setShowTimePicker(false); }} />}

        <button className="submitButton" onClick={felvitel}>Új befizetés rögzítése</button>

        {loading && <p>Betöltés...</p>}
        {hiba && <p style={{ color: "red" }}>{hiba}</p>}
      </div>
    </div>
  );
};

export default Penzugyek;
