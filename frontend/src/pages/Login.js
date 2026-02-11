import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/index.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)',
      padding: '20px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        maxWidth: '1000px',
        width: '100%',
        alignItems: 'center',
      }}>
        {/* Left Side - Feature Highlights */}
        <div style={{ display: 'none' }} className='hidden-on-mobile'>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#0369a1',
            marginBottom: '24px',
            lineHeight: '1.2',
          }}>
            🏥 CURANODE
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#4b5563',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}>
            Advanced Clinical Workflow & Coordination System for Modern Healthcare Providers
          </p>

          <div style={{ space: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'start', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                flexShrink: 0,
              }}>⚡</div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '16px' }}>Real-time Coordination</h3>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>Instantly coordinate with your medical team across departments</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'start', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                flexShrink: 0,
              }}>📊</div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '16px' }}>Patient Analytics</h3>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>Track patient health metrics and vital signs in real-time</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                flexShrink: 0,
              }}>🔒</div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '16px' }}>HIPAA Compliant</h3>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>Enterprise-grade security for healthcare data protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.1)',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '32px',
            fontSize: '24px',
            fontWeight: '700',
            color: '#0369a1',
          }}>Welcome Back</h2>

          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '24px',
              backgroundColor: '#fee2e2',
              color: '#7f1d1d',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#4b5563',
              }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
                placeholder="your@email.com"
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#4b5563',
              }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: isLoading
                  ? 'linear-gradient(135deg, #9ca3af 0%, #9ca3af 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              {isLoading ? '🔄 Logging in...' : '🔐 Login'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '14px',
            color: '#6b7280',
          }}>
            Don't have an account?{' '}
            <a href="/register" style={{
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: '600',
              hover: { textDecoration: 'underline' },
            }}>Create Account</a>
          </p>

          <div style={{
            marginTop: '32px',
            padding: '20px',
            backgroundColor: '#ecfdf5',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#065f46',
            border: '1px solid #a7f3d0',
          }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '13px' }}>📋 Demo Credentials:</p>
            <div style={{ space: '8px' }}>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>👨‍⚕️ <strong>Doctor:</strong> doctor@hospital.com / password123</p>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>💊 <strong>Pharmacy:</strong> pharmacy@hospital.com / password123</p>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>🔬 <strong>Lab:</strong> lab@hospital.com / password123</p>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>👩‍⚕️ <strong>Nurse:</strong> nurse@hospital.com / password123</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
