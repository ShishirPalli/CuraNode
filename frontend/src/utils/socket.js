import io from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

export const joinPatientRoom = (patientId) => {
  if (socket) {
    socket.emit('join-patient', patientId);
  }
};

export const leavePatientRoom = (patientId) => {
  if (socket) {
    socket.emit('leave-patient', patientId);
  }
};

export const joinRoleRoom = () => {
  if (socket) {
    socket.emit('join-role-room');
  }
};

export const onActionUpdate = (callback) => {
  if (socket) {
    socket.on('action-updated', callback);
  }
};

export const onStatusChange = (callback) => {
  if (socket) {
    socket.on('action-status-changed', callback);
  }
};

export const offActionUpdate = () => {
  if (socket) {
    socket.off('action-updated');
  }
};

export const offStatusChange = () => {
  if (socket) {
    socket.off('action-status-changed');
  }
};
