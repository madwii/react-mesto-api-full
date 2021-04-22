// npm start

import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import api from "../utils/api.js";

import { register, authorize, checkToken } from "../utils/auth.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoTooltip from "./InfoTooltip.js";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const history = useHistory();

  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  // токен
  useEffect(() => {
    const token = localStorage.getItem("token"); //получаем токен из локального хранилища
    if (token) {
      checkToken(token)
        .then((result) => {
          if (result) {
            setLoggedIn(true);
            setEmail(result.email);
            history.push("/"); // После получения данных пользователя перенаправляем
          }
        })
        .catch(() => history.push("/sign-in")); // Если возникла ошибка запроса, то перенаправляем пользователя на страницу авторизации
    }
  }, [history]);

    // информация о пользователе + карточки
    useEffect(() => {
      if (loggedIn) {
      api
        .getServerData()      
        .then((response => {
          const [userData, initialCards] = response;
          setCurrentUser(userData);
          setCards(initialCards);
          }))
        .catch((err) => console.log(err));
      }
    }, [loggedIn]);

  // Метод обработки логина
  const handleLogin = ({ email, password }) => {
    return authorize(email, password)
      .then((res) => {
        if (res.token) {
          setLoggedIn(true);
          setEmail(email);
          history.push("/");
          localStorage.setItem("token", res.token);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRegister = ({ email, password }) => {
    return register(email, password)
      .then((res) => {
        setSuccess(true);
        setIsInfoTooltipPopupOpen(true);
        history.push("/sign-in");
        return res;
      })
      .catch((err) => {
        console.log(err);
        // setSuccess(false);
        setIsInfoTooltipPopupOpen(true);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Удаляем токен из локального хранилища при логауте
    // Возвращаем пользовательские данные к начальному состоянию
    setEmail("");
    setLoggedIn(false);
    // Перенаправляем пользователя на страницу логина
    history.push("/sign-in");
  };

  // Показать попап аватарки
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // Показать попап профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // Показать попап добавления карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // Показать попап картинки
  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  // Закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    // setSelectedCard({});
    setIsInfoTooltipPopupOpen(false);
  }

  // Прожатие лайка
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .likeCard(card._id, !isLiked)
      .then((newCard) => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        // Обновляем стейт
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  // Удаление карточки
  function handleDeleteCard(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  // Апдейт профиля
  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  // Апдейт аватарки
  function handleUpdateAvatar(data) {
    api
      .changeAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(item) {
    api
      .createCard(item)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={email} onSignOut={handleSignOut} />
        <Switch>
          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>
          <ProtectedRoute
            component={Main}
            path="/"
            loggedIn={loggedIn}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardDelete={handleDeleteCard}
            onCardLike={handleCardLike}
            cards={cards}
          />
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          onClose={closeAllPopups}
          title="Вы уверены?"
          name="confirm"
          isOpen={false}
        />

        <ImagePopup
          onClose={closeAllPopups}
          card={selectedCard}
          isOpen={isImagePopupOpen}
        />
        <InfoTooltip
          success={success}
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
        />

        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
