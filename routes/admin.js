const express = require('express');
const isAdmin = require('../middlewares/isAdmin');
const adminController = require('../controllers/admin');
const router = express.Router();

router.use(isAdmin);

router.get('/users', adminController.getUsers);

module.exports = router;
