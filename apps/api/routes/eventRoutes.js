const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Get all events
router.get('/', eventController.getAllEvents);

// Get all public events
router.get('/public', eventController.getAllPublicEvents);

// Get a specific event by ID
router.get('/:event_id', eventController.getEventById);

// Create a new event (with multiple image uploads)
router.post(
  '/event',
  uploadMiddleware.array('event_images'),
  authMiddleware(['organizer','admin','org_member']),
  eventController.addEvent
);

// Update an existing event
router.put(
  '/:event_id',
  uploadMiddleware.array('event_images'), 
  eventController.updateEvent
);

// Delete an event
router.delete('/:event_id', eventController.deleteEvent);

// Update event status
router.put('/:event_id/status', eventController.updateEventStatus);

// Add member to an event
router.post('/:event_id/add-member', eventController.addMember);

// Get members of an event
router.get('/:event_id/members', eventController.getMembersByEventId);

// Get event from user ID
router.get('/member/:user_id', eventController.getEventsByUserId);
// Get upcoming events for a user
router.get('/member/:user_id/upcoming', eventController.getUserUpcomingEvents);
// Get history events for a user
router.get('/member/:user_id/history', eventController.getUserHistoryEvents);


// Remove member from an event
router.delete('/:event_id/remove-member', eventController.removeMember);

//Remove all members from an event
router.delete('/:event_id/remove-all-members', eventController.removeAllMembersFromEvent);


module.exports = router;