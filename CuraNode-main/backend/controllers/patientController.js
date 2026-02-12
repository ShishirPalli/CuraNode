const Patient = require('../models/Patient');
const Joi = require('joi');

const patientSchema = Joi.object({
  medicalRecordNumber: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid('M', 'F', 'Other').required(),
  bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  allergies: Joi.array().items(Joi.string()),
  medicalHistory: Joi.array().items(Joi.string()),
});

// Get all patients (with filters for assigned doctor)
exports.getAllPatients = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'doctor') {
      filter.assignedDoctor = req.user._id;
    }
    const patients = await Patient.find(filter).populate('assignedDoctor', 'firstName lastName');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('assignedDoctor', 'firstName lastName');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create patient (doctor only)
exports.createPatient = async (req, res) => {
  try {
    const { error, value } = patientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    value.assignedDoctor = req.user._id;
    const newPatient = new Patient(value);
    await newPatient.save();

    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { error, value } = patientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const patient = await Patient.findByIdAndUpdate(req.params.id, value, {
      new: true,
    }).populate('assignedDoctor', 'firstName lastName');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
