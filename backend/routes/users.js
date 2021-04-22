const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateCurrentUser,
  validateUserById,
  validateUpdateAvatar,
  validateUpdateUser,
} = require('../middlewares/validatons');

router.get('/users', getUsers);

router.get('/users/me', validateCurrentUser, getCurrentUser);

router.get('/users/:id', validateUserById, getUserById);

router.patch('/users/me', validateUpdateUser, updateUser);

router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
