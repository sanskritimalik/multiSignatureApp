const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();
router.get('/', authenticateToken, userController.getUsers);

module.exports = router;

