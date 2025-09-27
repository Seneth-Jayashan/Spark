// router.js
const { Router } = require("express");
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/orgRoutes');
const eventRoutes = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactroute');

const router = Router();

router.use('/auth', userRoutes);
router.use('/organization', organizationRoutes);
router.use('/event', eventRoutes);
router.use('/contact', contactRoutes);


module.exports = router;
