import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patients, actions } from '../utils/api';
import { joinPatientRoom, leavePatientRoom, getSocket, onActionUpdate } from '../utils/socket';
import '../styles/index.css';

// Vital Sign Component
const VitalSign = ({ label, value, unit, status, icon }) => (
  <div className="vital-item">
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <div className="vital-label">{label}</div>
    <div className="vital-value">{value}</div>
    <div className="vital-unit">{unit}</div>
    <div className={`vital-status vital-status-${status}`}>
      {status === 'normal' ? '✓ Normal' : status === 'warning' ? '⚠ Warning' : '🚨 Critical'}
    </div>
  </div>
);

// Health Alert Card
const HealthAlert = ({ type, message, severity }) => {
  const severityColors = {
    critical: { bg: '#fee2e2', border: '#fecaca', text: '#7f1d1d', icon: '🔴' },
    warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', icon: '🟡' },
    info: { bg: '#dbeafe', border: '#bfdbfe', text: '#1e40af', icon: '🔵' },
  };
  
  const colors = severityColors[severity] || severityColors.info;

  return (
    <div style={{
      backgroundColor: colors.bg,
      border: `1px solid ${colors.border}`,
      borderLeft: `4px solid ${colors.border}`,
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '12px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{colors.icon}</span>
      <div>
        <h4 style={{ margin: '0 0 4px 0', color: colors.text, fontSize: '14px' }}>{type}</h4>
        <p style={{ margin: '0', color: colors.text, fontSize: '13px' }}>{message}</p>
      </div>
    </div>
  );
};

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [actionsList, setActionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewActionForm, setShowNewActionForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    actionType: 'prescription',
    priority: 'medium',
    departmentAssigned: 'pharmacy',
  });

  // Mock health vitals - in production, these would come from API
  const [vitals] = useState({
    heartRate: { value: 72, unit: 'bpm', status: 'normal', icon: '❤️' },
    bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal', icon: '🩸' },
    temperature: { value: 98.6, unit: '°F', status: 'normal', icon: '🌡️' },
    oxygenSaturation: { value: 98, unit: '%', status: 'normal', icon: '💨' },
  });

  const loadPatient = async () => {
    try {
      const response = await patients.getById(patientId);
      setPatient(response.data);
    } catch (err) {
      console.error('Failed to load patient:', err);
    }
  };

  const loadActions = async () => {
    try {
      const response = await actions.getForPatient(patientId);
      setActionsList(response.data);
    } catch (err) {
      console.error('Failed to load actions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatient();
    loadActions();
    joinPatientRoom(patientId);

    const socket = getSocket();
    if (socket) {
      onActionUpdate((updatedAction) => {
        setActionsList((prev) =>
          prev.map((a) => (a._id === updatedAction._id ? updatedAction : a))
        );
      });
    }

    return () => {
      leavePatientRoom(patientId);
      if (socket) socket.off('action-updated');
    };
  }, [patientId]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAction = async (e) => {
    e.preventDefault();
    try {
      await actions.create({ ...formData, patientId });
      setFormData({
        title: '',
        description: '',
        actionType: 'prescription',
        priority: 'medium',
        departmentAssigned: 'pharmacy',
      });
      setShowNewActionForm(false);
      loadActions();
    } catch (err) {
      console.error('Failed to create action:', err);
    }
  };

  const handleStatusChange = async (actionId, newStatus) => {
    try {
      await actions.updateStatus(actionId, newStatus);
      loadActions();
    } catch (err) {
      console.error('Failed to update action status:', err);
    }
  };

  if (loading || !patient) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'in-progress': '⚙️',
      'completed': '✅',
      'cancelled': '❌',
    };
    return icons[status] || '📋';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🟠',
      'urgent': '🔴',
    };
    return icons[priority] || '🔵';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
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

      {/* Patient Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--light-green) 0%, var(--light-blue) 100%)',
        border: '1px solid var(--gray-200)',
        padding: '28px',
        borderRadius: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-green), var(--primary-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '28px',
          }}>
            {patient.firstName?.[0]}{patient.lastName?.[0]}
          </div>
          <div style={{ flex: '1' }}>
            <h2 style={{ margin: '0 0 12px 0', color: 'var(--dark-blue)', fontSize: '28px' }}>
              {patient.firstName} {patient.lastName}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              fontSize: '13px',
            }}>
              <div>
                <span style={{ color: 'var(--gray-500)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>Medical Record</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: 'var(--gray-600)' }}>🆔 {patient.medicalRecordNumber}</p>
              </div>
              <div>
                <span style={{ color: 'var(--gray-500)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>Age</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: 'var(--gray-600)' }}>
                  {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                </p>
              </div>
              <div>
                <span style={{ color: 'var(--gray-500)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>Blood Type</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: 'var(--danger)' }}>🩸 {patient.bloodType || 'Not recorded'}</p>
              </div>
              <div>
                <span style={{ color: 'var(--gray-500)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>Status</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: 'var(--primary-green)' }}>
                  {patient.status === 'Active' ? '🟢' : '⚪'} {patient.status}
                </p>
              </div>
            </div>
            {patient.allergies?.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '6px',
                color: 'var(--danger)',
                fontWeight: '600',
                fontSize: '13px',
              }}>
                ⚠️ <strong>Allergies:</strong> {patient.allergies.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Vitals Section */}
      <div style={{
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: 'var(--dark-blue)' }}>📊 Current Health Vitals</h3>
        <div className="vitals-grid">
          <VitalSign
            label="Heart Rate"
            value={vitals.heartRate.value}
            unit={vitals.heartRate.unit}
            status={vitals.heartRate.status}
            icon={vitals.heartRate.icon}
          />
          <VitalSign
            label="Blood Pressure"
            value={vitals.bloodPressure.value}
            unit={vitals.bloodPressure.unit}
            status={vitals.bloodPressure.status}
            icon={vitals.bloodPressure.icon}
          />
          <VitalSign
            label="Temperature"
            value={vitals.temperature.value}
            unit={vitals.temperature.unit}
            status={vitals.temperature.status}
            icon={vitals.temperature.icon}
          />
          <VitalSign
            label="Oxygen Saturation"
            value={vitals.oxygenSaturation.value}
            unit={vitals.oxygenSaturation.unit}
            status={vitals.oxygenSaturation.status}
            icon={vitals.oxygenSaturation.icon}
          />
        </div>
      </div>

      {/* Health Alerts Section */}
      <div style={{
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: 'var(--dark-blue)' }}>🔔 Active Health Alerts</h3>
        <HealthAlert
          type="Medication Reminder"
          message="Next dose of Metformin due in 2 hours. Contains allergy warning."
          severity="info"
        />
        <HealthAlert
          type="Lab Result Available"
          message="Blood test results are ready for review. Glucose levels slightly elevated."
          severity="warning"
        />
      </div>

      {/* Clinical Actions Section */}
      <div style={{
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0', color: 'var(--dark-blue)' }}>📋 Clinical Actions</h3>
          <button
            onClick={() => setShowNewActionForm(!showNewActionForm)}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-blue) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {showNewActionForm ? '✕ Cancel' : '➕ New Action'}
          </button>
        </div>

        {/* New Action Form */}
        {showNewActionForm && (
          <form onSubmit={handleCreateAction} style={{
            backgroundColor: 'var(--gray-50)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '24px',
            border: '1px solid var(--gray-200)',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                color: 'var(--gray-600)',
                fontSize: '13px',
              }}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
                placeholder="e.g., Blood Test Request"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                color: 'var(--gray-600)',
                fontSize: '13px',
              }}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                required
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                }}
                placeholder="Describe the clinical action needed"
              />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '20px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--gray-600)',
                  fontSize: '13px',
                }}>Action Type</label>
                <select
                  name="actionType"
                  value={formData.actionType}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <option value="prescription">💊 Prescription</option>
                  <option value="diagnostic-request">🔬 Diagnostic Request</option>
                  <option value="referral">➡️ Referral</option>
                  <option value="care-instruction">📝 Care Instruction</option>
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--gray-600)',
                  fontSize: '13px',
                }}>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--gray-600)',
                  fontSize: '13px',
                }}>Department</label>
                <select
                  name="departmentAssigned"
                  value={formData.departmentAssigned}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <option value="pharmacy">💊 Pharmacy</option>
                  <option value="lab">🔬 Lab</option>
                  <option value="imaging">🖼️ Imaging</option>
                  <option value="nursing">👩‍⚕️ Nursing</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: '12px 20px',
                backgroundColor: 'var(--primary-green)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ✓ Create Clinical Action
            </button>
          </form>
        )}

        {/* Actions Timeline */}
        {actionsList.length > 0 ? (
          <div className="timeline">
            {actionsList.map((action) => (
              <div key={action._id} className="timeline-item">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px',
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--gray-600)', fontSize: '14px' }}>
                      {action.title}
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--gray-400)' }}>
                      {new Date(action.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: '20px',
                      backgroundColor: action.status === 'completed' ? '#d1fae5' :
                        action.status === 'in-progress' ? '#cffafe' :
                        action.status === 'pending' ? '#fef3c7' : '#e5e7eb',
                      color: action.status === 'completed' ? '#065f46' :
                        action.status === 'in-progress' ? '#164e63' :
                        action.status === 'pending' ? '#92400e' : '#374151',
                      fontWeight: '600',
                    }}>
                      {getStatusIcon(action.status)} {action.status}
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: '20px',
                      backgroundColor: action.priority === 'urgent' ? '#fee2e2' :
                        action.priority === 'high' ? '#fef3c7' :
                        action.priority === 'medium' ? '#cffafe' : '#e5e7eb',
                      color: action.priority === 'urgent' ? '#7f1d1d' :
                        action.priority === 'high' ? '#92400e' :
                        action.priority === 'medium' ? '#164e63' : '#374151',
                      fontWeight: '600',
                    }}>
                      {getPriorityIcon(action.priority)} {action.priority}
                    </span>
                  </div>
                </div>
                <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--gray-500)' }}>
                  {action.description}
                </p>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--gray-4000)',
                  marginTop: '12px',
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  <span>📋 {action.actionType}</span>
                  <span>🏥 {action.departmentAssigned}</span>
                  {action.initiatedBy && <span>👤 {action.initiatedBy.firstName}</span>}
                </div>
                {action.status === 'pending' && (
                  <div style={{ marginTop: '12px' }}>
                    <select
                      onChange={(e) => e.target.value && handleStatusChange(action._id, e.target.value)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        borderRadius: '6px',
                        border: '1px solid var(--gray-300)',
                        backgroundColor: 'var(--white)',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Update Status...</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--gray-400)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ margin: '0', fontSize: '14px' }}>No clinical actions yet</p>
            <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px', margin: '8px 0 0 0' }}>
              Create a new action to start managing patient care
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
