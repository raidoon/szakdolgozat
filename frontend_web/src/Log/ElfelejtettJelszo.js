import React, { useState } from 'react';
import '../css/ElfelejtettJelszo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Ipcim from '../Ipcim';
const ElfelejtettJelszo = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const jelszoVisszaallitas = async (e) => {
    e.preventDefault();
    if (email === '') {
      alert('Kérjük, adja meg az email címét!');
      return;
    }
    try {
      // Backend hívása
      const response = await fetch(Ipcim.Ipcim+'/adminEmailEllenorzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 404) {
        alert(data.message); // "404 = Ez az email cím nem található"
      } else if (response.status === 403) {
        alert(data.message); // "403 = Nincs jogosultságod a belépéshez!"
      } else if (response.status === 200) {
        // 200 = Minden jó. Sikeres admin email ellenőrzés, van email cím is és a jogosultság is jó!
        // További logika, pl. jelszó visszaállítási link küldése
        alert("A jelszó visszaállítási linket elküldtük az email címére!")
      }
    } catch (error) {
      console.error('Hiba történt:', error);
      alert('Szerverhiba történt!');
    }
  };

  return (
    <div className='ElfelejtettJelszoBody'>
      <div className="elfelejtettJelszoNagyDiv">
        <div className="udvozloPanel">
          <h1>Elfelejtett jelszó</h1>
          <p>Ha elfelejtette a jelszavát, kérjük, adja meg az email címét, és mi elküldjük Önnek a jelszó visszaállítási linket.</p>
          <button
            onClick={() => navigate('/')} // Vissza a bejelentkezéshez
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem',
              fontSize: '1rem',
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
            Vissza a bejelentkezéshez
          </button>
        </div>
        <div className="kisDiv">
          <h1 style={{ color: '#007bff', fontWeight: 600, fontSize: 40 }}>Jelszó visszaállítás</h1>
          <form onSubmit={jelszoVisszaallitas}>
            <div className="textbox">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="bejelentkezoGomb">Link küldése</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ElfelejtettJelszo;