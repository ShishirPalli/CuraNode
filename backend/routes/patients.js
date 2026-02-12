const express = require('express');
const patientController = require('../controllers/patientController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
// Allow both doctors and nurses to create patients
router.post('/', roleMiddleware(['doctor', 'nurse']), patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', roleMiddleware(['doctor']), patientController.deletePatient);

module.exports = router;
