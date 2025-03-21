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
          // Fetch active students
          const oktatoid = { oktato_id: oktatoId };
          const aktualisDiakok = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
            method: "POST",
            body: JSON.stringify(oktatoid),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
          if (!aktualisDiakok.ok) {
            setHiba("Hiba történt az aktuális diákok betöltésekor, kérjük próbálja meg később!");
          }
          const aktualisDiakokResponse = await aktualisDiakok.json();
          setAktualisLista(aktualisDiakokResponse);

          // Fetch finished students
          const levizsgazottDiakok = await fetch(Ipcim.Ipcim + "/levizsgazottDiakok", {
            method: "POST",
            body: JSON.stringify(oktatoid),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
          if (!levizsgazottDiakok.ok) {
            setHiba("Hiba történt a levizsgázott diákok betöltésekor, kérjük próbálja meg később!");
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
    <div className="oktatoReszletekContainer">
      <Navbar />
      <div className="oktatokBody">
        {betoltes && <p>Oktató adatainak betöltése...</p>}
        {hiba && <p style={{ color: "red" }}>{hiba}</p>}

        <div className="container">
          {/* ---------------------------- OKTATÓ ADATAI BAL OLDALON KIÍRVA ---------------------*/}
          <div className="oktatoReszletekSection">
            <h1>{oktato.oktato_neve}</h1>
            <p>Email: {oktato.oktato_email}</p>
            <p>Telefonszám: {oktato.oktato_telefon}</p>
            <p>Összes tanuló: {aktualisLista.length + levizsgazottLista.length}</p>
            
            <button className="editButton">Oktató adatainak szerkesztése</button>
            <button className="actionButton">Értesítés küldése</button>
          </div>
          {/* ---------------------------- TANULÓK JOBB OLDALON LISTÁZVA ---------------------*/}
          <div className="studentsSection">
            {/* ---------------------------- NEM LEVIZSGÁZOTT TANULÓK ---------------------*/}
            <div className="lenyiloKartya" onClick={() => setAktualisLathato(!aktualisLathato)}>
              <div>
                <h1>Aktuális tanulók ({aktualisLista.length})</h1>
              </div>
              <div className="jobbraNyil">
                <IoIosArrowDropdown size={55} color="#0f59d9" />
              </div>
            </div>

            {aktualisLathato && (
              <div className="diakLista">
                {aktualisLista.length > 0 ? (
                  aktualisLista.map((diak, key) => (
                    <div key={key} className="diakKartya">
                      <h2>{diak.tanulo_neve}</h2>
                      <p>Email: {diak.tanulo_email}</p>
                      <p>Telefonszám: {diak.tanulo_telefon}</p>
                      <p>Órák száma: {diak.oral_szama}</p>
                      <button className="actionButton">Tanuló adatainak megtekintése</button>
                    </div>
                  ))
                ) : (
                  <p>A kiválasztott oktatónak jelenleg nincs egy aktuális tanulója sem!</p>
                )}
              </div>
            )}

            {/* ---------------------------- LEVIZSGÁZOTT TANULÓK LISTÁZVA ---------------------*/}
            <div className="lenyiloKartya" onClick={() => setLevizsgazottLathato(!levizsgazottLathato)}>
              <div>
                <h1>Levizsgázott tanulók ({levizsgazottLista.length})</h1>
              </div>
              <div className="jobbraNyil">
                <IoIosArrowDropdown size={55} color="#0f59d9" />
              </div>
            </div>

            {levizsgazottLathato && (
              <div className="diakLista">
                {levizsgazottLista.length > 0 ? (
                  levizsgazottLista.map((diak, key) => (
                    <div key={key} className="diakKartya">
                      <h2>{diak.tanulo_neve}</h2>
                      <p>Vizsga dátuma: {diak.vizsga_datuma}</p>
                      <p>Végeredmény: {diak.vegeredmeny}</p>
                      <button className="actionButton">Tanuló adatainak megtekintése</button>
                    </div>
                  ))
                ) : (
                  <p>A kiválasztott oktatónak egyelőre még nincs levizsgázott tanulója beírva!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OktatoReszletek;