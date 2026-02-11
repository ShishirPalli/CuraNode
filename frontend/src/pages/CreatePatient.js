import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patients } from '../utils/api';
import '../styles/index.css';

const CreatePatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicalRecordNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'M',
    bloodType: 'O+',
    phoneNumber: '',
    email: '',
    address: '',
    allergies: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      };

      await patients.create(dataToSubmit);
      setSuccess('Patient created successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)',
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{
            marginBottom: '24px',
            padding: '10px 16px',
            backgroundColor: 'var(--gray-200)',
            color: 'var(--gray-600)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--gray-300)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--gray-200)'}
        >
          ← Back to Dashboard
        </button>

        {/* Main Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--gray-200)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{
              margin: '0 0 8px 0',
              color: 'var(--dark-blue)',
              fontSize: '28px',
            }}>
              ➕ Create New Patient
            </h2>
            <p style={{
              margin: '0',
              color: 'var(--gray-500)',
              fontSize: '14px',
            }}>
              Register a new patient in the system
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              backgroundColor: '#fee2e2',
              color: '#7f1d1d',
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>✓</span>
              {success}
            </div>
          )}

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '28px',
            borderBottom: '2px solid var(--gray-200)',
            paddingBottom: '0',
          }}>
            {['personal', 'medical', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  color: activeTab === tab ? 'var(--primary-green)' : 'var(--gray-500)',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid var(--primary-green)' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'personal' && '👤'} {tab === 'medical' && '🏥'} {tab === 'contact' && '📞'} {tab}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: 'var(--gray-600)',
                  }}>Medical Record Number *</label>
                  <input
                    type="text"
                    name="medicalRecordNumber"
                    value={formData.medicalRecordNumber}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease',
                    }}
                    placeholder="MRN-001"
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '20px',
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '13px',
                      color: 'var(--gray-600)',
                    }}>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '13px',
                      color: 'var(--gray-600)',
                    }}>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '20px',
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '13px',
                      color: 'var(--gray-600)',
                    }}>Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '13px',
                      color: 'var(--gray-600)',
                    }}>Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="M">👨 Male</option>
                      <option value="F">👩 Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Information Tab */}
            {activeTab === 'medical' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '20px',
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '13px',
                      color: 'var(--gray-600)',
                    }}>Blood Type</label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="A+">🩸 A+</option>
                      <option value="A-">🩸 A-</option>
                      <option value="B+">🩸 B+</option>
                      <option value="B-">🩸 B-</option>
                      <option value="AB+">🩸 AB+</option>
                      <option value="AB-">🩸 AB-</option>
                      <option value="O+">🩸 O+</option>
                      <option value="O-">🩸 O-</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: 'var(--gray-600)',
                  }}>Allergies (comma-separated)</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    placeholder="e.g., Penicillin, Sulfa, Latex"
                  />
                  <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '12px',
                    color: 'var(--gray-400)',
                  }}>
                    📌 Important: This information will be flagged in all clinical interactions
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: 'var(--gray-600)',
                  }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    placeholder="patient@email.com"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: 'var(--gray-600)',
                  }}>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: 'var(--gray-600)',
                  }}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: loading
                  ? 'linear-gradient(135deg, #9ca3af 0%, #9ca3af 100%)'
                  : 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-blue) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '24px',
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? '🔄 Creating Patient...' : '✓ Create Patient'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;
