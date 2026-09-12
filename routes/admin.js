const express = require('express');
const isAdmin = require('../middlewares/isAdmin');
const adminController = require('../controllers/admin');
const router = express.Router();

router.use(isAdmin);

router.get('/users', adminController.getUsers);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.patch('/users/:id/promote', adminController.promoteUser);
router.delete(
  '/users/:id/uids/:genshinUid',
  adminController.forceDeleteUidCards
);

module.exports = router;
