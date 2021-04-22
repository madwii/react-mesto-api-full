const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateLikeCard,
  validateDeleteCard,
} = require('../middlewares/validatons');

router.get('/cards', getCards);

router.post('/cards', validateCreateCard, createCard);

router.delete('/cards/:id', validateDeleteCard, deleteCard);

router.put('/cards/:id/likes', validateLikeCard, likeCard);

router.delete('/cards/:id/likes', validateLikeCard, dislikeCard);

module.exports = router;
