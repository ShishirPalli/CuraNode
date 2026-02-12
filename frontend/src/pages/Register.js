import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import Loader from '../components/Loader';
import '../styles/index.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'doctor',
    department: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Clear department when switching to roles that don't use it
      if (name === 'role' && (!departments[value] || departments[value].length === 0)) {
        updated.department = '';
      }
      return updated;
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Client-side validation: require department for doctor/nurse
    if ((formData.role === 'doctor' || formData.role === 'nurse') && !formData.department) {
      setError('Please select a department.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📝 Attempting registration...');
      await register(formData);
      console.log('✓ Registration complete, navigating to dashboard...');
      
      // Small delay to ensure token is persisted to localStorage
      setTimeout(() => {
        const tokenCheck = localStorage.getItem('token');
        console.log('✓ Token persisted check:', tokenCheck ? 'YES' : 'NO');
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const departments = {
    'doctor': ['Cardiology', 'Pediatrics', 'Orthopedics'],
    'nurse': ['ICU', 'General Ward', 'Emergency'],
    'diagnostic-staff': [],
    'pharmacy': [],
  };

  return (
    <>
      {isLoading && <Loader fullPage={true} text="Creating account..." type="spinner" />}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>🏥 CURANODE</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '20px', color: '#666' }}>Register</h2>

        {error && (
          <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="doctor">👨‍⚕️ Doctor</option>
              <option value="nurse">👩‍⚕️ Nurse</option>
              <option value="diagnostic-staff">🔬 Diagnostic Staff</option>
              <option value="pharmacy">💊 Pharmacy</option>
            </select>
          </div>

          {departments[formData.role]?.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select Department</option>
                {departments[formData.role].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Already have an account? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</a>
        </p>
      </div>
      </div>
    </>
  );
};

export default Register;
