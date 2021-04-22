/* eslint-disable no-unused-vars */
const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

const { createUser, login } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/validatons');

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

router.post('/signup', validateCreateUser, createUser);

router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/', userRouter);
router.use('/', cardRouter);

// нашел только здесь. О ней же речь? И спасибо за ревью;)
router.use('/*', (req, res) => {
  throw new NotFoundError('Cервер не может найти запрашиваемый ресурс');
});

module.exports = router;
