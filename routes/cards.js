const express = require('express');
const cardController = require('../controllers/cards');
const router = express.Router();

router.get('/', cardController.getCards);

module.exports = router;
