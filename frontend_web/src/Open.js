import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import "./css/Kezdolap.css";
import Ipcim from './Ipcim';

const Open = () => {
  const [statisztika, setStatisztika] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const felhasznaloAdatok = useMemo(() => {
    return JSON.parse(localStorage.getItem("felhasznaloAdatok"));
  }, []);

  const [formData, setFormData] = useState({
    autosiskola: felhasznaloAdatok.felhasznalo_autosiskola || '',
    email: '',
    jelszo: '',
    telefonszam: '',
    tipus: '',
    nev: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchStatistics();
  }, [navigate]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(Ipcim.Ipcim + "/kezdolapadatok", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nem sikerült lekérni a statisztikai adatokat.");
      }

      const data = await response.json();
      setStatisztika(data);
    } catch (err) {
      console.error("Hiba a statisztikai adatok betöltésekor:", err);
      setError("Hiba történt az adatok betöltése közben. Kérjük, próbálja újra később.");
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      autosiskola: felhasznaloAdatok.felhasznalo_autosiskola || '',
      email: '',
      jelszo: '',
      telefonszam: '',
      tipus: '',
      nev: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, jelszo, telefonszam, tipus, nev } = formData;
    if (!email || !jelszo || !telefonszam || !tipus || !nev) {
      setError('Minden mezőt ki kell tölteni!');
      return;
    }

    if (!validateEmail(email)) {
      setError('Kérjük, adjon meg egy érvényes email címet!');
      return;
    }

    if (!validatePassword(jelszo)) {
      setError('A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell számot, kis- és nagybetűt!');
      return;
    }

    const registrationData = {
      ...formData,
      autosiskola: felhasznaloAdatok.felhasznalo_autosiskola || '',
    };

    try {
      const response = await fetch(Ipcim.Ipcim + '/regisztralas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Hiba történt a regisztráció során!');
      }

      setSuccess('Sikeres regisztráció!');
      setError('');
      setShowRegistrationForm(false);
      resetForm();
      fetchStatistics();
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.heading}>Üdvözlünk a rendszerben! 🚗</h1>
      <p style={styles.welcomeText}>
        Nagyszerű, hogy itt vagy! Ez a felület az autósiskola ügyintézői részére készült!
      </p>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {statisztika ? (
        <div style={styles.statsContainer}>
          <p style={styles.statItem}>📌 <strong>Eddigi összes tanuló:</strong> {statisztika.osszes_tanulo}</p>
          <p style={styles.statItem}>📌 <strong>Aktív kurzusok:</strong> {statisztika.aktiv_diakok}</p>
          <p style={styles.statItem}>📌 <strong>Ezen a héten vizsgázók:</strong> {statisztika.heti_vizsgak}</p>
        </div>
      ) : (
        <p style={styles.loading}>🔄 Adatok betöltése...</p>
      )}

      <button
        style={styles.registrationButton}
        onClick={() => setShowRegistrationForm(!showRegistrationForm)}
      >
        {showRegistrationForm ? 'Bezárás' : 'Új felhasználó regisztrálása'}
      </button>

      {showRegistrationForm && (
        <form onSubmit={handleSubmit} style={styles.registrationForm}>
          {['email', 'jelszo', 'telefonszam', 'nev'].map((field) => (
            <div key={field} style={styles.formGroup}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input type={field === 'jelszo' ? 'password' : 'text'} name={field} value={formData[field]} onChange={handleChange} required />
            </div>
          ))}
          <div style={styles.formGroup}>
            <label>Regisztráció típusa:</label>
            <select name="tipus" value={formData.tipus} onChange={handleChange} required>
              <option value="">Válassz típust...</option>
              <option value="1">Oktató</option>
              <option value="2">Tanuló</option>
            </select>
          </div>
          <button type="submit" style={styles.submitButton}>Regisztráció</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', textAlign: 'center', backgroundColor: '#f4f4f4', minHeight: '100vh' },
  heading: { fontSize: '28px', color: '#333', marginBottom: '10px' },
  welcomeText: { fontSize: '18px', color: '#555', marginBottom: '20px' },
  error: { fontSize: '16px', color: '#ff0000' },
  success: { fontSize: '16px', color: '#008000' },
  registrationButton: { padding: '10px', fontSize: '16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' },
};

export default Open;
