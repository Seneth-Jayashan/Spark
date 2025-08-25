const express = require('express');
const router = express.Router();

const {getAllUsers} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllUsers.getUsers);
router.post('/signup', getAllUsers.createUser);
router.post('/user', getAllUsers.getUserById);
router.post('/forgotpassword', getAllUsers.forgotPassword);
router.post('/reset-password/:token', getAllUsers.resetPassword);
router.post('/signin', getAllUsers.login);

router.get('/me', authMiddleware(['admin', 'volunteer', 'employee', 'organizer', 'org_member']), userController.authentication);

module.exports = router;