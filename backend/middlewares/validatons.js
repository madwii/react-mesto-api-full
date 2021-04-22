/* eslint-disable max-len, object-curly-spacing */
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

// с помощью custom валидации проверяется ObjectId:
// id: Joi.string().required().custom((value, helpers) => {
//       if (ObjectId.isValid(value)) {
//         return value;
//       }
//       return helpers.message('Невалидный id');
//     }),

// const regExpURL = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;
// const regExpEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value, {require_protocol: true})) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }),
    password: Joi.string().required().min(8),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(),
});

const validateCurrentUser = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

const validateUserById = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, {require_protocol: true})) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(),
});

// карты
const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, {require_protocol: true})) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(),
});

const validateLikeCard = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

const validateDeleteCard = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateCurrentUser,
  validateUserById,
  validateUpdateAvatar,
  validateUpdateUser,
  validateCreateCard,
  validateLikeCard,
  validateDeleteCard,
};
