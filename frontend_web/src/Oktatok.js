import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";
import "./css/Oktatok.css";
import {
  IoIosSchool,
  IoIosSearch,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Link } from "react-router-dom";
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
                <div className="jobbraNyil">
                  <Link
                    to={`/oktatok/${item.oktato_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <IoIosArrowDroprightCircle size={55} color="#0f59d9" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.nincsIlyenNevuOktatoDiv}>
            <div
              style={styles.nincsIlyenNevuOktato}
              className="nincsIlyenNevuOktato"
            >
              <IoIosSearch size={60} color="#888" />{" "}
              <h2 style={styles.nincsIlyenNevuOktatoText}>
                Nem található ilyen nevű oktató!
              </h2>
              <p style={styles.probaldUjra}>Próbálja meg újra másik névvel.</p>
            </div>
          </div>
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
    fontSize: "20px",
  },
  nincsIlyenNevuOktatoDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh", // 50 = kép fele vh = viewport height
    textAlign: "center",
  },
  nincsIlyenNevuOktato: {
    maxWidth: "400px",
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // halvány árnyék
    border: "1px solid #e0e0e0", // icipici border
  },
  nincsIlyenNevuOktatoText: {
    fontSize: "24px",
    color: "#333",
    marginTop: "20px",
  },
  probaldUjra: {
    fontSize: "16px",
    color: "#666",
    marginTop: "10px",
  },
};
export default Oktatok;