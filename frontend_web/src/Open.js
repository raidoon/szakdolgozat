import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import "./css/Kezdolap.css"

const Open = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='openBody'>
      <Navbar />
      <h1>Üdvözlünk a védett oldalon!</h1>

    </div>
  );
};


export default Open;
