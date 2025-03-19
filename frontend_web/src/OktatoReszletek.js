import { IoIosArrowDropdown } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/OktatoReszletek.css";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";

const OktatoReszletek = () => {
  const { oktatoId } = useParams();
  const [oktato, setOktato] = useState(null);
  const [betoltes, setBetoltes] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [aktualisLathato, setAktualisLathato] = useState(false);
  const [aktualisLista, setAktualisLista] = useState([]);
  const [levizsgazottLathato, setLevizsgazottLathato] = useState(false);
  const [levizsgazottLista, setLevizsgazottLista] = useState([]);

  useEffect(() => {
    const oktatoLekerdezes = async () => {
      try {
        const oktatoResponse = await fetch(Ipcim.Ipcim + `/oktato/${oktatoId}`);
        if (!oktatoResponse.ok) throw new Error("Ez az oktató nem található!");
        const kivalasztottOktato = await oktatoResponse.json();
        setOktato(kivalasztottOktato);
        if (kivalasztottOktato) {
          //-------------------------- kiválasztott oktató aktuális diákjainak lekérdezése
          const oktatoid = { oktato_id: oktatoId };
          const aktualisDiakok = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
            method: "POST",
            body: JSON.stringify(oktatoid),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
          if (!aktualisDiakok.ok) {
            setHiba(
              "Hiba történt az aktuális diákok betöltésekor, kérjük próbálja meg később!"
            );
          }
          const aktualisDiakokResponse = await aktualisDiakok.json();
          setAktualisLista(aktualisDiakokResponse);
          //-------------------------- kiválasztott oktató levizsgázott diákjainak lekérdezése
          const levizsgazottDiakok = await fetch(Ipcim.Ipcim+ "/levizsgazottDiakok",{
            method: "POST",
            body: JSON.stringify(oktatoid),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
          if(!levizsgazottDiakok.ok){
            setHiba(
                "Hiba történt a levizsgázott diákok betöltésekor, kérjük próbálja meg később!"
            );
          }
          const levizsgazottDiakokResponse = await levizsgazottDiakok.json();
          setLevizsgazottLista(levizsgazottDiakokResponse);
        }
        setHiba("");
        setBetoltes(false);
      } catch (err) {
        setHiba(err.message);
        setBetoltes(false);
      }
    };
    oktatoLekerdezes();
  }, [oktatoId]);

  if (betoltes) return <p>Betöltés...</p>;
  if (hiba) return <p style={{ color: "red" }}>{hiba}</p>;

  return (
    <div>
      <Navbar />
      <div className="oktatokBody">
        {betoltes && <p>Oktató adatainak betöltése...</p>}
        {hiba && <p style={{ color: "red" }}>{hiba}</p>}

        <h1>{oktato.oktato_neve}</h1>

        <div
          className="lenyiloKartya"
          onClick={() => setAktualisLathato(!aktualisLathato)}
        >
          <div>
            <h1>Aktuális tanulók</h1>
          </div>
          <div className="jobbraNyil">
            <IoIosArrowDropdown size={55} color="#0f59d9" />
          </div>
        </div>

        {aktualisLathato ? (
          aktualisLista.length > 0 ? (
            aktualisLista.map((diak, key) => {
              return (
                <div key={key} className="diakKartya">
                  <h1>{diak.tanulo_neve}</h1>
                </div>
              );
            })
          ) : (
            <p>A kiválasztott oktatónak jelenleg nincs egy aktuális tanulója sem!</p>
          )
        ) : (
          <p></p>
        )}

        <div
          className="lenyiloKartya"
          onClick={() => setLevizsgazottLathato(!levizsgazottLathato)}
        >
          <div>
            <h1>Levizsgázott tanulók </h1>
          </div>
          <div className="jobbraNyil">
            <IoIosArrowDropdown size={55} color="#0f59d9" />
          </div>
        </div>

        {levizsgazottLathato ? (
          levizsgazottLista.length > 0 ? (
            levizsgazottLista.map((diak, key) => {
              return (
                <div key={key} className="diakKartya">
                  <h1>{diak.tanulo_neve}</h1>
                </div>
              );
            })
          ) : (
            <p>A kiválasztott oktatónak egyelőre még nincs levizsgázott tanulója beírva!</p>
          )
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default OktatoReszletek;
