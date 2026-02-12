import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
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
    <>
      {isLoading && <Loader fullPage={true} text="Logging in to CURANODE..." type="spinner" />}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ecf0f5 100%)',
        padding: '20px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '50px',
          maxWidth: '1100px',
          width: '100%',
          alignItems: 'center',
        }} className="login-grid">
          {/* Left Side - Feature Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="login-left">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <Logo size="large" variant="default" />
              <p style={{
                fontSize: '17px',
                color: '#4b5563',
                lineHeight: '1.7',
                maxWidth: '350px',
                margin: '0',
                fontWeight: '500',
              }}>
                Advanced Clinical Workflow & Coordination System for Modern Healthcare Providers
              </p>
            </div>

            {/* Feature Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Feature 1 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
                }}>⚡</div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', color: '#1e3a5f', fontSize: '16px', fontWeight: '700' }}>Real-time Coordination</h3>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>Instant updates across all departments</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                }}>📊</div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', color: '#1e3a5f', fontSize: '16px', fontWeight: '700' }}>Patient Analytics</h3>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>Track health metrics and vitals</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
                }}>🔒</div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', color: '#1e3a5f', fontSize: '16px', fontWeight: '700' }}>HIPAA Compliant</h3>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
          }}>
            <h2 style={{
              textAlign: 'center',
              marginBottom: '8px',
              fontSize: '26px',
              fontWeight: '700',
              color: '#1e3a5f',
            }}>Welcome Back</h2>
            <p style={{
              textAlign: 'center',
              marginBottom: '32px',
              fontSize: '14px',
              color: '#6b7280',
            }}>Sign in to access your dashboard</p>

            {error && (
              <div style={{
                padding: '14px 16px',
                marginBottom: '24px',
                backgroundColor: '#fee2e2',
                color: '#7f1d1d',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '17px' }}>🚨</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#1f2937',
                }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="doctor@hospital.com"
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#1f2937',
                }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                    ? '#d1d5db'
                    : 'linear-gradient(135deg, #1e3a5f 0%, #0d9488 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: !isLoading ? '0 6px 20px rgba(30, 58, 95, 0.25)' : 'none',
                }}
                onMouseOver={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
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
                color: '#0d9488',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.color = '#059669'}
              onMouseOut={(e) => e.target.style.color = '#0d9488'}
              >Create Account</a>
            </p>

            <div style={{
              marginTop: '32px',
              padding: '18px 16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#166534',
              border: '1px solid #bbf7d0',
            }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: '700', fontSize: '13px' }}>📋 Demo Credentials:</p>
              <div style={{ space: '6px' }}>
                <p style={{ margin: '4px 0', fontSize: '12px', fontFamily: 'monospace' }}>👨‍⚕️ doctor@hospital.com / password123</p>
                <p style={{ margin: '4px 0', fontSize: '12px', fontFamily: 'monospace' }}>👩‍⚕️ nurse@hospital.com / password123</p>
                <p style={{ margin: '4px 0', fontSize: '12px', fontFamily: 'monospace' }}>💊 pharmacy@hospital.com / password123</p>
                <p style={{ margin: '4px 0', fontSize: '12px', fontFamily: 'monospace' }}>🔬 lab@hospital.com / password123</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .login-grid {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }
            .login-left {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Login;
