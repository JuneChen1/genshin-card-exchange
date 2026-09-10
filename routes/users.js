const express = require('express');
const userController = require('../controllers/users');
const isAuth = require('../middlewares/isAuth');
const { authLimiter } = require('../middlewares/limiter');
const router = express.Router();

router.get('/me', isAuth, userController.getMe);
router.patch('/me', isAuth, userController.updateMe);
router.patch(
  '/me/password',
  isAuth,
  authLimiter,
  userController.updatePassword
);

module.exports = router;
