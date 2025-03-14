import React, { useState } from 'react';
import '../css/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Ipcim from '../Ipcim';

const Login = () => {
  const [email, setEamil] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [jelszoMutatasa, setJelszoMutatasa] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(Ipcim.Ipcim +'/web/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Nem található ilyen felhasználó!');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      alert('Sikeres bejelentkezés!');
      window.location.href = '/open'; // Átirányítás a védett oldalra
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='LoginBody'>
    <div className="bejelentkezesNagyDiv">
      <div className="udvozloPanel">
        <h1>Üdvözöljük a <span style={{color: '#007bff', fontWeight: 600,fontSize:50}}>Jogsi+</span>  weboldalán!</h1>
        <p>Amennyiben Ön már rendelkezik adminisztrátori jogosultsággal, kérjük, jelentkezzen be a rendszerbe. </p>
        <p>Ha Ön egy autósiskola képviseletében szeretné igénybe venni szolgáltatásainkat, kérjük, lépjen velünk kapcsolatba az alábbi <a href='/kapcsolat' style={{color: '#007bff',fontWeight: 'bold',textDecoration:'none'}}>linken</a>, ahol szívesen válaszolunk minden kérdésére, és segítünk a regisztrációban!</p>
      </div>
      <div className="kisDiv">
        <h1 style={{color: '#007bff', fontWeight: 600,fontSize:40}}>Bejelentkezés</h1>
        
        <form onSubmit={handleLogin}>
          <div className="textbox">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEamil(e.target.value)}
              required
            />
          </div>
          <div className="textbox">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              type={jelszoMutatasa ? "text" : "password"}
              value={password}
              placeholder="Jelszó"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="eye-icon" onClick={() => setJelszoMutatasa(!jelszoMutatasa)}>
              {jelszoMutatasa ? <FaEye /> : <FaEyeSlash />}
            </i>
          </div>
          {error && <p className="hibaUzenet">{error}</p>}
          <button type="submit" className="bejelentkezoGomb">Bejelentkezés</button>
          <a href='/elfelejtettjelszo' className='elfelejtettJelszo'>Elfelejtett jelszó?</a>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default Login;