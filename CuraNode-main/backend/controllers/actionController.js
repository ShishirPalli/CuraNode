const ClinicalAction = require('../models/ClinicalAction');
const Joi = require('joi');

const actionSchema = Joi.object({
  patientId: Joi.string().required(),
  actionType: Joi.string()
    .valid('prescription', 'diagnostic-request', 'referral', 'care-instruction')
    .required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  departmentAssigned: Joi.string()
    .valid('lab', 'imaging', 'pharmacy', 'nursing')
    .required(),
  details: Joi.any(),
});

// Create clinical action
exports.createAction = async (req, res) => {
  try {
    const { error, value } = actionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    value.initiatedBy = req.user._id;
    const newAction = new ClinicalAction(value);
    await newAction.save();

    const populatedAction = await newAction.populate([
      { path: 'patientId', select: 'firstName lastName medicalRecordNumber' },
      { path: 'initiatedBy', select: 'firstName lastName role' },
    ]);

    // Emit socket event for real-time update
    if (req.socketManager) {
      req.socketManager.emitActionUpdate(value.patientId, populatedAction);
      // Notify all users of this department
      req.socketManager.emitActionToRole(value.departmentAssigned, populatedAction);
    }

    res.status(201).json(populatedAction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get actions for a patient
exports.getPatientActions = async (req, res) => {
  try {
    const actions = await ClinicalAction.find({
      patientId: req.params.patientId,
    })
      .populate('initiatedBy', 'firstName lastName role')
      .populate('assignedTo', 'firstName lastName')
      .populate('patientId', 'firstName lastName medicalRecordNumber')
      .sort({ createdAt: -1 });

    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get action by ID
exports.getActionById = async (req, res) => {
  try {
    const action = await ClinicalAction.findById(req.params.id)
      .populate('patientId', 'firstName lastName medicalRecordNumber')
      .populate('initiatedBy', 'firstName lastName role')
      .populate('assignedTo', 'firstName lastName')
      .populate('notes.userId', 'firstName lastName');

    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    res.json(action);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update action status
exports.updateActionStatus = async (req, res) => {
  try {
    const { status, completionNotes } = req.body;

    if (!['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
      updateData.completedBy = req.user._id;
      if (completionNotes) updateData.completionNotes = completionNotes;
    }

    const action = await ClinicalAction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('patientId', 'firstName lastName medicalRecordNumber')
      .populate('initiatedBy', 'firstName lastName role')
      .populate('assignedTo', 'firstName lastName');

    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    // Emit socket event for real-time update
    if (req.socketManager) {
      req.socketManager.emitActionUpdate(action.patientId._id.toString(), action);
      req.socketManager.emitActionToRole(req.user.role, action);
    }

    res.json(action);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add note to action
exports.addNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({ message: 'Note cannot be empty' });
    }

    const action = await ClinicalAction.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: {
            userId: req.user._id,
            note: note,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate('patientId', 'firstName lastName medicalRecordNumber')
      .populate('initiatedBy', 'firstName lastName role')
      .populate('assignedTo', 'firstName lastName')
      .populate('notes.userId', 'firstName lastName role');

    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    // Emit socket event for real-time update
    if (req.socketManager) {
      req.socketManager.emitActionUpdate(action.patientId._id.toString(), action);
      req.socketManager.emitActionToRole(req.user.role, action);
    }

    res.json(action);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all actions (dashboard view based on role)
exports.getActionsByRole = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'doctor') {
      filter.initiatedBy = req.user._id;
    } else if (req.user.role === 'pharmacy') {
      filter.departmentAssigned = 'pharmacy';
    } else if (req.user.role === 'diagnostic-staff') {
      filter.departmentAssigned = { $in: ['lab', 'imaging'] };
    } else if (req.user.role === 'nurse') {
      filter.departmentAssigned = 'nursing';
    }

    const actions = await ClinicalAction.find(filter)
      .populate('patientId', 'firstName lastName medicalRecordNumber')
      .populate('initiatedBy', 'firstName lastName role')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
