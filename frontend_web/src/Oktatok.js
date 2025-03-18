import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";
import './css/Oktatok.css';

const Oktatok = () => {
  const [oktatoLista, setOktatoLista] = useState([]);

  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []); //[] - csak egyszer hívjuk meg

  const letoltes = useCallback(async () => {
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
  }, [felhasznaloAdatok]);

  useEffect(() => {
    letoltes();
  }, [letoltes]); 
  return (
    <div>
      <Navbar />
      <div className="oktatokBody">
        {oktatoLista.map((item, key) => (
          <div key={key} className="oktatoKartya">
            <h1>{item.oktato_neve}</h1>
            <p>Email: {item.felhasznalo_email}</p>
            <p>Telefonszám: {item.felhasznalo_telefonszam}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Oktatok;