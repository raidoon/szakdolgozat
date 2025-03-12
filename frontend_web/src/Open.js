import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Open = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div style={styles.content}>
        <h1>Üdvözlünk a védett oldalon!</h1>
      </div>
    </div>
  );
};

const styles = {
  content: {
    padding: '20px',
    textAlign: 'center',
  },
};

export default Open;
