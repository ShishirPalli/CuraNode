import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { patients, actions } from '../utils/api';
import {
  joinRoleRoom,
  onActionUpdate,
  getSocket,
} from '../utils/socket';
import '../styles/index.css';

// Stats Card Component
const StatCard = ({ icon, label, value, trend, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color === 'green' ? 'var(--light-green)' : 'var(--light-blue)'} 0%, ${color === 'green' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(14, 165, 233, 0.05)'} 100%)`,
    borderLeft: `4px solid ${color === 'green' ? 'var(--primary-green)' : 'var(--primary-blue)'}`,
    padding: '24px',
    borderRadius: '12px',
    flex: '1',
    minWidth: '200px',
  }}>
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '12px', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '8px' }}>
      {label}
    </div>
    <div style={{ fontSize: '28px', fontWeight: '700', color: color === 'green' ? 'var(--primary-green)' : 'var(--primary-blue)' }}>
      {value}
    </div>
    {trend && (
      <div style={{ fontSize: '12px', marginTop: '8px', color: trend.positive ? 'var(--primary-green)' : 'var(--danger)' }}>
        {trend.positive ? '↑' : '↓'} {trend.text}
      </div>
    )}
  </div>
);

// Action Card Component with Medical Design
const ActionCard = ({ action }) => {
  const getPriorityIcon = (priority) => {
    const icons = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🟠',
      'urgent': '🔴',
    };
    return icons[priority] || '🔵';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'in-progress': '⚙️',
      'completed': '✅',
      'cancelled': '❌',
    };
    return icons[status] || '📋';
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--gray-200)',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '12px',
      borderLeft: `4px solid ${
        action.priority === 'urgent' ? 'var(--danger)' :
        action.priority === 'high' ? 'var(--warning)' :
        action.priority === 'medium' ? 'var(--primary-blue)' :
        'var(--gray-400)'
      }`,
      transition: 'all 0.3s ease',
      backgroundColor: action.priority === 'urgent' ? 'rgba(220, 38, 38, 0.02)' : 'white',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: 'var(--gray-600)' }}>
          {action.title}
        </h4>
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
        color: 'var(--gray-400)',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--gray-100)',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
      }}>
        <div>📋 <span style={{ color: 'var(--gray-500)' }}>{action.actionType}</span></div>
        <div>🏥 <span style={{ color: 'var(--gray-500)' }}>{action.departmentAssigned}</span></div>
      </div>
    </div>
  );
};

// Doctor Dashboard Component with Health Overview
const DoctorDashboard = () => {
  const [patientsList, setPatientsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await patients.getAll();
      setPatientsList(response.data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
    const socket = getSocket();
    if (socket) {
      socket.on('patient-updated', loadPatients);
    }
    return () => {
      if (socket) socket.off('patient-updated');
    };
  }, []);

  const activePatients = patientsList.filter(p => p.status === 'Active').length;
  const criticalPatients = Math.floor(patientsList.length * 0.15); // Simulated

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header with Quick Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px', color: 'var(--dark-blue)', fontSize: '24px' }}>
          👨‍⚕️ Doctor Patient Dashboard
        </h2>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <StatCard
            icon="👥"
            label="Total Patients"
            value={patientsList.length}
            color="green"
            trend={{ positive: true, text: '12% increase' }}
          />
          <StatCard
            icon="✅"
            label="Active Patients"
            value={activePatients}
            color="blue"
            trend={{ positive: true, text: 'This week' }}
          />
          <StatCard
            icon="🚨"
            label="Requiring Attention"
            value={criticalPatients}
            color="blue"
            trend={{ positive: false, text: 'Priority cases' }}
          />
          <StatCard
            icon="📊"
            label="Avg Compliance"
            value="92%"
            color="green"
            trend={{ positive: true, text: 'Above target' }}
          />
        </div>
      </div>

      {/* Patient List Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid var(--gray-200)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0', color: 'var(--dark-blue)' }}>My Patients</h3>
          <button
            onClick={() => navigate('/create-patient')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-blue) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ➕ Create New Patient
          </button>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {patientsList.map((patient) => (
              <div
                key={patient._id}
                className="patient-card"
                onClick={() => navigate(`/patient/${patient._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="patient-card-header">
                  <div className="patient-avatar">
                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.firstName} {patient.lastName}</h4>
                    <p>🆔 {patient.medicalRecordNumber}</p>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '12px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--gray-100)',
                }}>
                  <div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '11px' }}>Gender</span>
                    <p style={{ margin: '4px 0', fontWeight: '600', color: 'var(--gray-600)' }}>
                      {patient.gender === 'M' ? '👨' : '👩'} {patient.gender}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '11px' }}>Blood Type</span>
                    <p style={{ margin: '4px 0', fontWeight: '600', color: 'var(--danger)' }}>
                      {patient.bloodType || 'N/A'}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: patient.status === 'Active' ? '#d1fae5' : '#fee2e2',
                    color: patient.status === 'Active' ? '#065f46' : '#7f1d1d',
                  }}>
                    {patient.status === 'Active' ? '🟢' : '⚪'} {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && patientsList.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--gray-400)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p style={{ fontSize: '16px', margin: '0' }}>No patients yet</p>
            <p style={{ fontSize: '14px', color: 'var(--gray-400)', marginTop: '8px' }}>
              Create a new patient to get started with managing their care
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Department Dashboard Component with Action Management
const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [actionsList, setActionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const loadActions = async () => {
    setLoading(true);
    try {
      const response = await actions.getAll();
      setActionsList(response.data);
    } catch (err) {
      console.error('Failed to load actions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    joinRoleRoom();
    loadActions();

    const socket = getSocket();
    if (socket) {
      onActionUpdate((updatedAction) => {
        setActionsList((prev) =>
          prev.map((a) => (a._id === updatedAction._id ? updatedAction : a))
        );
      });
    }
    return () => {
      if (socket) socket.off('action-updated');
    };
  }, []);

  const statusCounts = {
    pending: actionsList.filter((a) => a.status === 'pending').length,
    'in-progress': actionsList.filter((a) => a.status === 'in-progress').length,
    completed: actionsList.filter((a) => a.status === 'completed').length,
    cancelled: actionsList.filter((a) => a.status === 'cancelled').length,
  };

  const filteredActions = actionsList.filter(
    (action) => selectedStatus === 'all' || action.status === selectedStatus
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px', color: 'var(--dark-blue)', fontSize: '24px' }}>
        📋 {user?.role.toUpperCase().replace('-', ' ')} Department
      </h2>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <StatCard
          icon="⏳"
          label="Pending"
          value={statusCounts.pending}
          color="blue"
        />
        <StatCard
          icon="⚙️"
          label="In Progress"
          value={statusCounts['in-progress']}
          color="blue"
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={statusCounts.completed}
          color="green"
        />
        <StatCard
          icon="❌"
          label="Cancelled"
          value={statusCounts.cancelled}
          color="blue"
        />
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        background: 'white',
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid var(--gray-200)',
      }}>
        {['all', 'pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedStatus === status ? 'var(--primary-green)' : 'var(--gray-100)',
              color: selectedStatus === status ? 'white' : 'var(--gray-600)',
              border: '1px solid ' + (selectedStatus === status ? 'var(--primary-green)' : 'var(--gray-300)'),
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (selectedStatus !== status) {
                e.target.style.backgroundColor = 'var(--gray-200)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedStatus !== status) {
                e.target.style.backgroundColor = 'var(--gray-100)';
              }
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid var(--gray-200)',
      }}>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : filteredActions.length > 0 ? (
          filteredActions.map((action) => (
            <ActionCard key={action._id} action={action} />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--gray-400)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '16px', margin: '0' }}>No {selectedStatus} actions</p>
            <p style={{ fontSize: '14px', color: 'var(--gray-400)', marginTop: '8px' }}>
              All tasks for this status have been completed!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'doctor') {
    return <DoctorDashboard />;
  }

  return <DepartmentDashboard />;
};

export default Dashboard;
