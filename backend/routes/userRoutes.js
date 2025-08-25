const express = require('express');
const router = express.Router();

const {getAllUsers} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllUsers);

router.get('/me', authMiddleware(['admin', 'volunteer', 'employee', 'organizer', 'org_member']), userController.authentication);

module.exports = router;