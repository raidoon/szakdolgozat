import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import "./css/Kezdolap.css";
import Ipcim from './Ipcim';

const Open = () => {
  const [statisztika, setStatisztika] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    fetch(Ipcim.Ipcim+ "/kezdolapadatok") // Cseréld ki a megfelelő backend címre
      .then(res => res.json())
      .then(data => setStatisztika(data))
      .catch(error => console.error("Hiba a statisztikai adatok lekérésekor:", error));
  }, [navigate]);

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.heading}>Üdvözlünk a rendszerben! 🚗</h1>
      <p style={styles.welcomeText}>
        Nagyszerű, hogy itt vagy! Ez a felület az autósiskola ügyintézői részére készült! 
      </p>

      {statisztika ? (
        <div style={styles.statsContainer}>
          <p style={styles.statItem}>📌 <strong>Eddigi összes tanuló:</strong> {statisztika.osszes_tanulo}</p>
          <p style={styles.statItem}>📌 <strong>Aktív kurzusok:</strong> {statisztika.aktiv_diakok}</p>
          <p style={styles.statItem}>📌 <strong>Ezen a héten vizsgázók:</strong> {statisztika.heti_vizsgak}</p>
        </div>
      ) : (
        <p style={styles.loading}>🔄 Adatok betöltése...</p>
      )}
    </div>
  );
};

// 🌟 Stílusok objektum
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "10px",
  },
  welcomeText: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "20px",
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    display: "inline-block",
    textAlign: "left",
  },
  statItem: {
    fontSize: "16px",
    margin: "5px 0",
    color: "#007BFF",
  },
  loading: {
    fontSize: "16px",
    color: "#888",
  }
};

export default Open;
