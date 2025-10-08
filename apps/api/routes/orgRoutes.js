const express = require('express');
const router = express.Router();

const organizationController = require('../controllers/orgController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Get all organizes
router.get('/', organizationController.getAllOrganization);
router.get('/export', authMiddleware(['admin']), organizationController.exportOrganizationsCsv);

// Get an organize by user ID
router.get('/my', authMiddleware(['organizer','admin']),organizationController.getOwnOrg);

// Get a specific organize by ID
router.get('/:org_id', organizationController.getOrganizationById);

router.post(
  '/create',
  uploadMiddleware.single('org_logo'),authMiddleware(['organizer','admin']),
  organizationController.createOrganization
);

// Add member to an organize
router.post('/:org_id/add-member', organizationController.addMember);

// Update an existing organize
router.put('/:org_id',authMiddleware(['organizer','admin']),uploadMiddleware.single('org_logo'), organizationController.updateOrganization);

// Update organize status
router.patch('/:org_id/status', organizationController.updateOrganizationStatus);

// Delete an organize
router.delete('/:org_id', organizationController.deleteOrganization);

// Add member to a oragnize
router.post('/:org_id/add-member', organizationController.addMember);

// Get members of a oragnize
router.get('/:org_id/members', organizationController.getMembersByOrgId);

// Get organize from user ID
router.get('/member/:user_id', organizationController.getOrgByUserId);

// Remove member from a oragnize
router.delete('/:org_id/remove-member', organizationController.removeMember);

//Remove all members from a oragnize
router.delete('/:org_id/remove-all-members', organizationController.removeAllMembersFromOrg);

module.exports = router;
