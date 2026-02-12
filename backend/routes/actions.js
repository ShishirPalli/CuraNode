const express = require('express');
const actionController = require('../controllers/actionController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', roleMiddleware(['doctor']), actionController.createAction);
router.get('/', actionController.getActionsByRole);
router.get('/patient/:patientId', actionController.getPatientActions);
router.get('/:id', actionController.getActionById);
router.put('/:id/status', actionController.updateActionStatus);
router.post('/:id/notes', actionController.addNote);

module.exports = router;
