const express = require('express');

const { PORT = 3000 } = process.env;// слушаем фронт на 3000 порте
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
require('dotenv').config();
const { handlerError } = require('./middlewares/handler-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
}).then(() => console.log('Успешное подключение к базе данных!'));

const app = express();

app.use(cors()); // разрешаем кросс-доменные запросы

app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router); // любой запрос предавай на корневой роутер

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(handlerError); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log('App start');
});
