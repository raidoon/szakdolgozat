import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./css/Open.css";
import Ipcim from "./Ipcim";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Open = () => {
  const [hiba, setHiba] = useState("");
  const [siker, setSiker] = useState("");
  const [regisztracioLathato, setRegisztracioLathato] = useState(false);
  //----------------------
  const [email, setEmail] = useState("");
  const [nev, setNev] = useState("");
  const [tipus, setTipus] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [jelszoMutatasa, setJelszoMutatasa] = useState(false);
  const [telefonszam, setTelefonszam] = useState("");
  //----------------------
  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const jelszoValid = (jelszo) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(jelszo);

  const regisztracio = async (e) => {
    e.preventDefault();
    if (!email || !jelszo || !telefonszam || !tipus || !nev) {
      setHiba("Minden mezőt ki kell tölteni!");
      return;
    }
    if (!emailValid(email)) {
      setHiba("Kérjük, adjon meg egy érvényes email címet!");
      return;
    }
    if (!jelszoValid(jelszo)) {
      setHiba(
        "A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell számot, kis- és nagybetűt!"
      );
      return;
    }
    const autosiskola = felhasznaloAdatok.felhasznalo.felhasznalo_autosiskola;
    try {
      const response = await fetch(Ipcim.Ipcim + "/regisztralas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          autosiskola,
          email,
          jelszo,
          telefonszam,
          tipus,
          nev,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Hiba történt a regisztráció során!");
      }
      setSiker("Sikeres regisztráció!");
      setHiba("");
      setRegisztracioLathato(false);
    } catch (err) {
      setHiba(err.message);
      setSiker("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="openBody">
        <h1 style={styles.heading}>Üdvözlünk a rendszerben! 🚗</h1>
        <p style={styles.welcomeText}>
          Nagyszerű, hogy itt vagy! Ez a felület az autósiskola ügyintézői
          részére készült!
        </p>

        <button
          style={styles.registrationButton}
          onClick={() => setRegisztracioLathato(!regisztracioLathato)}
        >
          {regisztracioLathato ? "Bezárás" : "Új felhasználó regisztrálása"}
        </button>

        {regisztracioLathato && (
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
              margin: "20px auto",
              textAlign: "center",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                color: "#007bff",
                fontWeight: 600,
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Új felhasználó regisztrálása
            </h1>

            <p>
              Ezen az oldalon kizárólag a saját autósiskolájához regisztrálhat
              be új oktatót vagy diákot.
            </p>

            <form onSubmit={regisztracio} style={{ textAlign: "left" }}>
              <div className="textbox">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <input
                  type="text"
                  value={nev}
                  placeholder="Teljes név"
                  onChange={(e) => setNev(e.target.value)}
                  required
                />
              </div>

              <div className="textbox">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="textbox">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  type={jelszoMutatasa ? "text" : "password"}
                  value={jelszo}
                  placeholder="Jelszó"
                  onChange={(e) => setJelszo(e.target.value)}
                  required
                />
                <i
                  className="eye-icon"
                  onClick={() => setJelszoMutatasa(!jelszoMutatasa)}
                >
                  {jelszoMutatasa ? <FaEye /> : <FaEyeSlash />}
                </i>
              </div>

              <div className="textbox">
                <FontAwesomeIcon icon={faPhone} className="icon" />
                <input
                  type="tel"
                  value={telefonszam}
                  placeholder="Telefonszám"
                  onChange={(e) => setTelefonszam(e.target.value)}
                  required
                />
              </div>

              <div className="textbox">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <select
                  value={tipus}
                  onChange={(e) => setTipus(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 40px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    appearance: "none",
                    backgroundColor: "white",
                  }}
                  required
                >
                  <option value="">
                    Válassza ki a regisztrálni kívánt felhasználó típusát
                  </option>
                  <option value="1">Oktató</option>
                  <option value="2">Tanuló</option>
                </select>
              </div>
              {hiba && <p style={styles.hiba}>{hiba}</p>}
              {siker && <p style={styles.siker}>{siker}</p>}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                Regisztráció
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  heading: { fontSize: "28px", color: "#333", marginBottom: "10px" },
  welcomeText: { fontSize: "18px", color: "#555", marginBottom: "20px" },
  hiba: { fontSize: "16px", color: "#ff0000" },
  siker: { fontSize: "16px", color: "#008000" },
  registrationButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Open;
