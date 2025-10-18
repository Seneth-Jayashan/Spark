// router.js
const { Router } = require("express");
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/orgRoutes');
const eventRoutes = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactroute');
const chatRoutes = require('./routes/chatRoute');
const VolunteerParticipationRoutes = require('./routes/VolunteerParticipation');
const NotificationRoutes = require('./routes/notificationRoute');

const router = Router();

router.use('/auth', userRoutes);
router.use('/organization', organizationRoutes);
router.use('/event', eventRoutes);
router.use('/contact', contactRoutes);
router.use('/chat', chatRoutes);
router.use('/participation', VolunteerParticipationRoutes);
router.use('/notifications', NotificationRoutes)



module.exports = router;
