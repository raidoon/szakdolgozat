import React, { useState } from 'react';
import '../css/Kapcsolat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faComment, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Kapcsolat = () => {
  const navigate = useNavigate();
  const [nev, setNev] = useState('');
  const [email2, setEamil2] = useState('');
  const [uzenet, setUzenet] = useState('');
  const [error, setError] = useState('');
  const [okUzenet, setOkUzenet] = useState('');

  //EMAIL CÍM VALIDÁLÁS REGEX-EL
  const emailEllenorzes = (megadottEmail) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(megadottEmail);
  }
  const uzenetkuldes = () => {
    if(nev ==='' || email2 ==='' || uzenet ===''  ){
        setUzenet('');
        setError('Kérjük töltse ki az összes mezőt!');
        return;
    }
    if(!emailEllenorzes(email2)){
      setOkUzenet('');
      setError('Kérjük adjon meg egy érvényes email címet!');
      return;
    }
    setNev('');
    setEamil2('');
    setUzenet('');  
    setError('');
    setOkUzenet("Üzenetét megkaptuk! Hamarosan felvesszük Önnel a kapcsolatot.");
  };
  return (
    <div className='KapcsolatBody'>
      <div className="kapcsolatNagyDiv">
        <div className="udvozloPanel">
          <h1>Üzenetküldés a <span style={{ color: '#007bff', fontWeight: 600, fontSize: 50 }}>Jogsi+</span> csapatának</h1>
          <p>Ha bármilyen kérdése van, vagy szeretne több információt kapni szolgáltatásainkról, kérjük, töltse ki az alábbi űrlapot, és mi hamarosan válaszolunk!</p>
          <p>Kérjük az üzenetében azt is tüntesse fel, hogy melyik autósiskolát képviseli!</p>
          <button
            onClick={() => navigate('/')} // vissza a bejelentkezéshez
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
            Vissza a főoldalra
          </button>
        </div>
        <div className="kisDiv">
          <h1 style={{ color: '#007bff', fontWeight: 600, fontSize: 40 }}>Kapcsolatfelvétel</h1>
          <form>
            <div className="textbox">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <input
                type="text"
                placeholder="Teljes név"
                value={nev}
                required
                onChange={(e) => setNev(e.target.value)}
              />
            </div>
            <div className="textbox">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="email"
                placeholder="Email"
                required
                value={email2}
                onChange={(e) => setEamil2(e.target.value)}
              />
            </div>
            <div className="textbox">
              <FontAwesomeIcon icon={faComment} className="icon" />
              <textarea
                placeholder="Üzenet..."
                rows="5"
                required
                value={uzenet}
                onChange={(e) => setUzenet(e.target.value)}
              />
            </div>
            {error && <p className="hibaUzenet">{error}</p>}
            {okUzenet && <p className="okUzenet">{okUzenet}</p>}
            <button type="submit" className="bejelentkezoGomb" onClick={(e) => { e.preventDefault(); uzenetkuldes(); }}>Üzenet elküldése</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Kapcsolat;