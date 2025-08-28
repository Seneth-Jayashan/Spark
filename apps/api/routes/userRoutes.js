const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload  = require('../middleware/uploadMiddleware');

router.get('/all', userController.getUsers);
router.post('/signup', upload.single("user_profile_picture"), userController.createUser);
router.post('/user', userController.getUserById);
router.post('/forgotpassword', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/signin', userController.login);

router.get('/me', authMiddleware(['admin', 'volunteer', 'employee', 'organizer', 'org_member']), userController.authentication);

router.post('/verify', userController.verifyEmail);
router.put('/update', upload.single("user_profile_picture"), userController.updateUser);
router.delete('/delete', userController.deleteUser);

module.exports = router;