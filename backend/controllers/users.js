/* eslint-disable no-unused-vars */
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const NotUniqueEmailError = require('../errors/not-unique-email-err');
const UnAuthError = require('../errors/un-auth-err');

// поиск всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// создание пользователя
const createUser = (req, res, next) => {
  const data = { ...req.body };
  if (!data.password) {
    throw new BadRequestError('Проверьте пароль');
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: data.email,
      password: hash,
      name: data.name,
      about: data.about,
      avatar: data.avatar,
    }))
    .then((user) => {
      res.status(201).send({ data: user.toJSON() });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new NotUniqueEmailError('Пользователь с таким электронным адресом уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// поиск одного пользователя по id
const getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по заданному id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Пользователь по заданному id не найден'));
      } else {
        next(err);
      }
    });
};

// получить текущего пользователя
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по заданному id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Пользователь по заданному id не найден'));
      } else {
        next(err);
      }
    });
};

// обновить имя/информацию пользователя
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Передан id в неверном формате');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// смена аватарки пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Передан id в неверном формате');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError' || err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// вход
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch((err) => {
      throw new UnAuthError('Ошибка авторизации');
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
  login,
};
