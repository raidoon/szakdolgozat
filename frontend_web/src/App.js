import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Open from './Open';
import Users from './Users';
import Oktatok from './Oktatok';
import Login from './Log/Login';
import Tanulok from './Tanulok';
import Kapcsolat from './Log/Kapcsolat';
import ElfelejtettJelszo from './Log/ElfelejtettJelszo';
import OktatoReszletek from './OktatoReszletek';
import AktualisDiakok from './AktualisDiakok';
import LevizsgazottDiakok from './LevizsgazottDiakok';
import UjDiak from './UjDiak';
import TanuloReszletek from './TanuloReszletek'; // Import the TanuloReszletek component

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/open" 
          element={
            <ProtectedRoute>
              <Open />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/oktatok" 
          element={
            <ProtectedRoute>
              <Oktatok />
            </ProtectedRoute>
          } 
        />
        <Route path="/oktatok/:oktatoId" element={<OktatoReszletek />} />
        <Route 
          path="/tanulok" 
          element={
            <ProtectedRoute>
              <Tanulok />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/aktualisdiakok" 
          element={
            <ProtectedRoute>
              <AktualisDiakok />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/levizsgazottdiakok" 
          element={
            <ProtectedRoute>
              <LevizsgazottDiakok />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ujdiak" 
          element={
            <ProtectedRoute>
              <UjDiak />
            </ProtectedRoute>
          } 
        />
        {/* Removed OktatoValtas route */}
        <Route path="/kapcsolat" element={<Kapcsolat />} />
        <Route path="/elfelejtettjelszo" element={<ElfelejtettJelszo />} />
        <Route 
          path="/tanuloreszletek/:tanuloId" 
          element={
            <ProtectedRoute>
              <TanuloReszletek />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;