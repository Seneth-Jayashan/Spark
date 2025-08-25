// router.js
const { Router } = require("express");
const userRoutes = require('./routes/userRoutes');

const router = Router();

router.use('/auth', userRoutes);

module.exports = router;
