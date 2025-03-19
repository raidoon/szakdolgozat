import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";
import "./css/Oktatok.css";
import { IoIosSchool } from "react-icons/io";

const Oktatok = () => {
  const [oktatoLista, setOktatoLista] = useState([]);
  const [tanuloLista, setTanuloLista] = useState([]);
  const [kereses, setKereses] = useState("");
  const [betoltes, setBetoltes] = useState(true);
  const [hiba, setHiba] = useState(null);

  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []); //[] - csak egyszer hívjuk meg

  const letoltes = useCallback(async () => {
    try {
      setBetoltes(true);
      setHiba(null);
      const adat = {
        felhasznalo_autosiskola:
          felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola,
      };
      if (adat) {
        //---- oktatók lekérdezése
        const oktatok = await fetch(Ipcim.Ipcim + "/AutosiskolaOktatoi", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (!oktatok.ok) {
          setHiba(
            "Hiba történt az oktatók betöltésekor, kérjük próbálja újra!"
          );
        }
        const oktatokResponse = await oktatok.json();
        setOktatoLista(oktatokResponse);
        setHiba("");
        setBetoltes(false);
        //--- tanulók lekérdezése
        const diakok = await fetch(Ipcim.Ipcim + "/suliTanuloi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adat),
        });
        if (!diakok.ok) {
          setHiba("Hiba történt a tanulók betöltésekor, kérjük próbálja újra!");
        }
        const diakokResponse = await diakok.json();
        setTanuloLista(diakokResponse);
        setHiba("");
        setBetoltes(false);
      }
    } catch (err) {
      setHiba(err.message);
    }
  }, [felhasznaloAdatok]);

  useEffect(() => {
    letoltes();
  }, [letoltes]);

  // Keresés az oktatók között
  const szurtAdatok = oktatoLista.filter((item) =>
    item.oktato_neve.toLowerCase().includes(kereses.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="oktatokBody">
        <div>
          <h1>Az autósiskola oktatói</h1>
        </div>

        <input
          type="text"
          placeholder="Keresés az oktatók között..."
          value={kereses}
          onChange={(e) => setKereses(e.target.value)}
          style={styles.input}
        />

        {betoltes && <p>Oktatók betöltése...</p>}
        {hiba && <p style={{ color: "red" }}>{hiba}</p>}

        {szurtAdatok.length > 0 ? (
          szurtAdatok.map((item, key) => {
            // csak a saját diákjaik száma filter
            const tanulokSzama = tanuloLista.filter(
              (tanulo) => tanulo.tanulo_oktatoja === item.oktato_id
            ).length;

            return (
              <div key={key} className="oktatoKartya">
                <div>
                  <IoIosSchool size={40} color="#0f59d9" />
                </div>

                <div>
                  <h1>{item.oktato_neve}</h1>
                  <p>{item.felhasznalo_email}</p>
                </div>

                <div>{item.felhasznalo_telefonszam}</div>

                <div>
                  <span>Jelenleg oktatott tanulók száma: {tanulokSzama}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p>Nem található ilyen nevű oktató!</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  input: {
    padding: "10px",
    marginBottom: "20px",
    width: "80%",
    maxWidth: "600px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "20px"
  },
};

export default Oktatok;