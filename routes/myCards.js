const express = require('express');
const isAuth = require('../middlewares/isAuth');
const myCardController = require('../controllers/myCards');
const router = express.Router();

router.get('/uids', isAuth, myCardController.getUidSummary);
router.get('/', isAuth, myCardController.getMyCards);
router.post('/', isAuth, myCardController.updateCards);

module.exports = router;
