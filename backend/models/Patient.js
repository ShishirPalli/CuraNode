const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    medicalRecordNumber: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['M', 'F', 'Other'],
      required: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    phoneNumber: String,
    email: String,
    address: String,
    allergies: [String],
    currentMedications: [
      {
        medicationName: String,
        dosage: String,
        frequency: String,
      },
    ],
    medicalHistory: [String],
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Active', 'Discharged', 'Admitted'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
