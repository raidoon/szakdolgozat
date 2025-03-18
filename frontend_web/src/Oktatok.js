import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";
import './css/Oktatok.css';

const Oktatok = () => {
  const [oktatoLista, setOktatoLista] = useState([]);

  // Memoize felhasznaloAdatok
  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []); // Empty dependency array means this only runs once

  const letoltes = useCallback(async () => {
    console.log("sajt"); // This will log only when letoltes is called
    try {
      const adat = {
        felhasznalo_autosiskola:
          felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola,
      };
      if (adat) {
        const oktatok = await fetch(Ipcim.Ipcim + "/AutosiskolaOktatoi", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (!oktatok.ok) {
          throw new Error("Hiba történt a bejelentkezés folyamán!");
        }
        const oktatokResponse = await oktatok.json();
        setOktatoLista(oktatokResponse);
      }
    } catch (err) {
      console.log(err.message);
    }
  }, [felhasznaloAdatok]); // Add felhasznaloAdatok as a dependency

  useEffect(() => {
    letoltes();
  }, [letoltes]); // Add letoltes to the dependency array

  return (
    <div >
      <Navbar />
      <div className="oktatokBody">
        {oktatoLista.map((item, key) => (
          <div key={key} className="oktatoKartya">
            <h1>{item.oktato_neve}</h1>
            <p className="dolt">Email: {item.felhasznalo_email}</p>
            <p>Telefonszám: {item.felhasznalo_telefonszam}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Oktatok;