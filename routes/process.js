
const express = require('express');
const router = express.Router();
const processesController = require('../controllers/processController.js');
const authenticateToken = require('../middleware/authenticateToken.js');


// Route for creating a new process
router.post('/', authenticateToken, processesController.createProcess);

// Route for signing off on a process
router.post('/:processId/sign-off', authenticateToken, processesController.signOffProcess);

// Route to get process details with signatures
router.get('/:processId', authenticateToken, processesController.getProcessDetails);

module.exports = router;
