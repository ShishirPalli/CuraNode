const mongoose = require('mongoose');

const clinicalActionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    actionType: {
      type: String,
      enum: ['prescription', 'diagnostic-request', 'referral', 'care-instruction'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    departmentAssigned: {
      type: String,
      enum: ['lab', 'imaging', 'pharmacy', 'nursing'],
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    notes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    completionNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClinicalAction', clinicalActionSchema);
