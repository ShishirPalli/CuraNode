const jwt = require('jwt-simple');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

const setupSocket = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.decode(token, SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected with role ${socket.userRole}`);

    // Join patient room
    socket.on('join-patient', (patientId) => {
      socket.join(`patient-${patientId}`);
      console.log(`User ${socket.userId} joined patient-${patientId}`);
    });

    // Leave patient room
    socket.on('leave-patient', (patientId) => {
      socket.leave(`patient-${patientId}`);
      console.log(`User ${socket.userId} left patient-${patientId}`);
    });

    // Join role-based room for dashboard
    socket.on('join-role-room', () => {
      socket.join(`role-${socket.userRole}`);
      console.log(`User ${socket.userId} joined role-${socket.userRole}`);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  return {
    // Emit action update to specific patient room
    emitActionUpdate: (patientId, action) => {
      io.to(`patient-${patientId}`).emit('action-updated', action);
    },

    // Emit action update to role-based room
    emitActionToRole: (role, action) => {
      io.to(`role-${role}`).emit('action-updated', action);
    },

    // Broadcast to all users
    emitGlobalUpdate: (event, data) => {
      io.emit(event, data);
    },

    // Emit action status change
    emitStatusChange: (patientId, actionId, newStatus) => {
      io.to(`patient-${patientId}`).emit('action-status-changed', {
        actionId,
        newStatus,
        timestamp: new Date(),
      });
    },
  };
};

module.exports = setupSocket;
