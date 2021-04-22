/* eslint-disable no-shadow */
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Не найдена карточка по заданному id');
      } else if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      } else {
        Card.findByIdAndRemove(req.params.id)
          .then((card) => {
            res.send(card);
          });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Не найдена карточка по заданному id'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      next(new NotFoundError('Не найдена карточка по заданному id'));
    } else {
      res.send(card);
    }
  })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
