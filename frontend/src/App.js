import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './utils/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import CreatePatient from './pages/CreatePatient';
import './styles/index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #10b981 100%)',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(3, 105, 161, 0.2)',
        borderBottom: '2px solid rgba(16, 185, 129, 0.2)',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🏥 CURANODE
        </h1>
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '14px',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.8)',
                  textTransform: 'capitalize',
                }}>
                  {user.role}
                </div>
              </div>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:patientId"
          element={
            <ProtectedRoute>
              <PatientDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-patient"
          element={
            <ProtectedRoute>
              <CreatePatient />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
