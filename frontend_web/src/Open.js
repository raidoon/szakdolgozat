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
  
        {/* Main container with responsive flex layout */}
        <div className="mainContainer">
          {/* Left side - stats and upcoming lessons */}
          <div className="statsContainer">
            {/* ADATOK IDE */}
            <div className="statsGrid">
              <div style={styles.statCard}>
                <h3>Tanulók</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>42</p>
              </div>
              <div style={styles.statCard}>
                <h3>Oktatók</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>5</p>
              </div>
              <div style={styles.statCard}>
                <h3>Mai órák</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>0</p>
              </div>
            </div>
  
            {/* KÖZELGŐ ÓRÁK */}
            <div className="upcomingLessons">
              <h3 style={{ marginTop: 0 }}>Közelgő órák (ma)</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  A mai napra nincs több bejegyzett óra.
                </li>
              </ul>
            </div>
  
            {!regisztracioLathato && (
              <button
                className="registrationToggleButton"
                onClick={() => setRegisztracioLathato(true)}
              >
                Új felhasználó regisztrálása
              </button>
            )}
          </div>
  
          {/* Registration form - appears below on mobile */}
          {regisztracioLathato && (
            <div className="registrationForm">
              <div className="formHeader">
                <h1>
                  Új felhasználó regisztrálása
                </h1>
                <button 
                  onClick={() => setRegisztracioLathato(false)}
                  className="closeButton"
                >
                  ✕
                </button>
              </div>
  
              <p className="formDescription">
                Ezen az oldalon kizárólag a saját <span>()</span> autósiskolájához regisztrálhat
                be új adminisztrátort, oktatót vagy diákot.
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
                    className="formSelect"
                    required
                  >
                    <option value="">
                      Válassza ki a regisztrálni kívánt felhasználó típusát
                    </option>
                    <option value="1">Oktató</option>
                    <option value="2">Tanuló</option>
                    <option value="3">Adminisztrátor</option>
                  </select>
                </div>
                {hiba && <p style={styles.hiba}>{hiba}</p>}
                {siker && <p style={styles.siker}>{siker}</p>}
                <button
                  type="submit"
                  className="submitButton"
                >
                  Regisztráció
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  heading: { fontSize: "28px", color: "#333", marginBottom: "10px" },
  welcomeText: { fontSize: "18px", color: "#555", marginBottom: "20px" },
  hiba: { fontSize: "16px", color: "#ff0000" },
  siker: { fontSize: "16px", color: "#008000" },
  statCard: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flex: 1,
    textAlign: "center"
  }
};

export default Open;