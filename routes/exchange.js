const express = require('express');
const exchangeController = require('../controllers/exchange');
const router = express.Router();

router.get('/', exchangeController.getMatch);

module.exports = router;
