import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/Navbar.css"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/open" className="link" onClick={() => setMenuOpen(false)}>
          Kezdőlap
        </Link>
        <Link to="/penzugyek" className="link" onClick={() => setMenuOpen(false)}>
          Pénzügyek
        </Link>
        <Link to="/oktatok" className="link" onClick={() => setMenuOpen(false)}>
          Oktatók
        </Link>
        <Link to="/tanulok" className="link" onClick={() => setMenuOpen(false)}>
          Tanulók
        </Link>
        <Link to="/vizsgak" className="link" onClick={() => setMenuOpen(false)}>
          Vizsgák
        </Link>
      </div>
      <button className="logoutButton" onClick={handleLogout}>
        Kijelentkezés
      </button>
    </nav>
  );
};

export default Navbar;