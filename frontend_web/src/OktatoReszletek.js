import { IoIosArrowDropdown } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/OktatoReszletek.css";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";
import { useNavigate } from "react-router-dom";

const OktatoReszletek = () => {
  const navigate = useNavigate();
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
            <p>Email: {oktato.felhasznalo_email}</p>
            <p>Telefonszám: {oktato.felhasznalo_telefonszam}</p>
            <p>Eddigi diákjai száma: {aktualisLista.length + levizsgazottLista.length}</p>
            
            <button className="editButton">Oktató adatainak szerkesztése</button>
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
                <div>
                  {aktualisLista.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f8fafd" }}>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}>Név</th>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}>Email</th>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}>Telefonszám</th>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}>Órák száma</th>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {aktualisLista.map((diak, index) => (
                            <tr key={index} style={{
                              borderBottom: "1px solid #e1e7ec",
                              transition: "background-color 0.2s",
                              ":hover": {
                                backgroundColor: "#f8fafd"
                              }
                            }}>
                              <td style={{ padding: "15px", color: "#12263f" }}>{diak.tanulo_neve}</td>
                              <td style={{ padding: "15px", color: "#4a6f8a" }}>{diak.tanulo_email}</td>
                              <td style={{ padding: "15px", color: "#4a6f8a" }}>{diak.tanulo_telefon}</td>
                              <td style={{ padding: "15px", color: "#4a6f8a" }}>{diak.oral_szama}</td>
                              <td style={{ padding: "15px" }}>
                                <button 
                                  onClick={() => navigate(`/tanuloreszletek/${diak.tanulo_felhasznaloID}`)}
                                  style={{
                                    padding: "8px 15px",
                                    backgroundColor: "#2c7be5",
                                    color: "white",
                                    borderRadius: "4px",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    transition: "all 0.2s",
                                    border: "none",
                                    cursor: "pointer",
                                    ":hover": {
                                      backgroundColor: "#1a68d1",
                                      transform: "translateY(-1px)"
                                    }
                                  }}
                                >
                                  Tanuló adatainak megtekintése
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      padding: "20px",
                      backgroundColor: "#f8fafd",
                      borderRadius: "8px",
                      textAlign: "center",
                      color: "#6e84a3",
                      border: "1px dashed #e1e7ec"
                    }}>
                      A kiválasztott oktatónak jelenleg nincs egy aktuális tanulója sem!
                    </div>
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
                <div>
                  {levizsgazottLista.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f8fafd" }}>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}>Név</th>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}>Vizsga dátuma</th>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}>Végeredmény</th>
                            <th style={{
                              padding: "15px",
                              textAlign: "left",
                              color: "#4a6f8a",
                              fontWeight: "600",
                              borderBottom: "1px solid #e1e7ec"
                            }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {levizsgazottLista.map((diak, index) => (
                            <tr key={index} style={{
                              borderBottom: "1px solid #e1e7ec",
                              transition: "background-color 0.2s",
                              ":hover": {
                                backgroundColor: "#f8fafd"
                              }
                            }}>
                              <td style={{ padding: "15px", color: "#12263f" }}>{diak.tanulo_neve}</td>
                              <td style={{ padding: "15px", color: "#4a6f8a" }}>{diak.vizsga_datuma}</td>
                              <td style={{ padding: "15px", color: "#4a6f8a" }}>{diak.vegeredmeny}</td>
                              <td style={{ padding: "15px" }}>
                                <button 
                                  onClick={() => navigate(`/tanuloreszletek/${diak.tanulo_felhasznaloID}`)}
                                  style={{
                                    padding: "8px 15px",
                                    backgroundColor: "#2c7be5",
                                    color: "white",
                                    borderRadius: "4px",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    transition: "all 0.2s",
                                    border: "none",
                                    cursor: "pointer",
                                    ":hover": {
                                      backgroundColor: "#1a68d1",
                                      transform: "translateY(-1px)"
                                    }
                                  }}
                                >
                                  Tanuló adatainak megtekintése
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      padding: "20px",
                      backgroundColor: "#f8fafd",
                      borderRadius: "8px",
                      textAlign: "center",
                      color: "#6e84a3",
                      border: "1px dashed #e1e7ec"
                    }}>
                      A kiválasztott oktatónak egyelőre még nincs levizsgázott tanulója beírva!
                    </div>
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