import React, { useEffect, useState } from 'react';
import '../styles/index.css';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { patients, actions } from '../utils/api';
import {
  joinRoleRoom,
  onActionUpdate,
  getSocket,
} from '../utils/socket';

// Component: Action Card
const ActionCard = ({ action }) => {
  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'in-progress': '#0dcaf0',
      'completed': '#198754',
      'cancelled': '#6c757d',
    };
    return colors[status] || '#0dcaf0';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#6c757d',
      'medium': '#0dcaf0',
      'high': '#fd7e14',
      'urgent': '#dc3545',
    };
    return colors[priority] || '#0dcaf0';
  };

  return (
    <div style={{ padding: '12px 16px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>{action.title}</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            padding: '2px 8px',
            fontSize: '11px',
            borderRadius: '4px',
            backgroundColor: getStatusColor(action.status),
            color: 'white',
          }}>
            {action.status}
          </span>
          <span style={{
            padding: '2px 8px',
            fontSize: '11px',
            borderRadius: '4px',
            backgroundColor: getPriorityColor(action.priority),
            color: 'white',
          }}>
            {action.priority}
          </span>
        </div>
      </div>
      <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{action.description}</p>
      <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
        <p style={{ margin: '2px 0' }}>Type: {action.actionType}</p>
        <p style={{ margin: '2px 0' }}>Department: {action.departmentAssigned}</p>
      </div>
    </div>
  );
};

// Dashboard Page Components
const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await patients.getAll();
      setPatients(response.data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
    // Real-time updates
    const socket = getSocket();
    if (socket) {
      socket.on('patient-updated', loadPatients);
    }
    return () => {
      if (socket) socket.off('patient-updated');
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>👨‍⚕️ Doctor Dashboard</h2>
      <button
        onClick={() => navigate('/create-patient')}
        style={{
          padding: '8px 16px',
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        + Create Patient
      </button>
      {loading ? <p>Loading patients...</p> : null}
      <div>
        {patients.map((patient) => (
          <div
            key={patient._id}
            onClick={() => navigate(`/patient/${patient._id}`)}
            style={{
              padding: '12px 16px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
          >
            <h4 style={{ margin: '0 0 4px 0' }}>{patient.firstName} {patient.lastName}</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>MRN: {patient.medicalRecordNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DepartmentDashboard = ({ departmentFilter }) => {
  const { user } = useAuth();
  const [actionsList, setActionsList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const filteredActions = actionsList;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 {user?.role.toUpperCase()} Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Total pending actions: {filteredActions.filter((a) => a.status === 'pending').length}
      </p>
      {loading ? <p>Loading actions...</p> : null}
      <div>
        {filteredActions.length > 0 ? (
          filteredActions.map((action) => (
            <ActionCard key={action._id} action={action} />
          ))
        ) : (
          <p style={{ color: '#999' }}>No actions assigned.</p>
        )}
      </div>
    </div>
  );
};

export { DoctorDashboard, DepartmentDashboard, ActionCard };
