import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Open from './Open';
import Users from './Users';
import Oktatok from './Oktatok';
import Login from './Login';
import Tanulok from './Tanulok';


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
          <Route 
          path="/tanulok" 
          element={
            <ProtectedRoute>
              <Tanulok />
            </ProtectedRoute>
          } 
          />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
