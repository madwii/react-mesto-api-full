import React from "react";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext); // Подписка на контекст
  const [name, setName] = React.useState("");
  const [about, setAbout] = React.useState("");

  // После загрузки текущего пользователя из API его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser]);

  function handleUpdateName(e) {
    setName(e.target.value);
  }

  function handleUpdateAbout(e) {
    setAbout(e.target.value);
  }


  // Обработчик формы
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: about,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        value={name ? name : ""}
        onChange={handleUpdateName}
        type="text"
        className="popup__input popup__input_type_name"
        required
        minLength="2"
        maxLength="40"
        name="name"
        placeholder="Имя"
        id="name-input"
      />
      <span id="name-input-error" className="error" aria-live="polite"></span>

      <input
        value={about ? about : ""}
        onChange={handleUpdateAbout}
        type="text"
        className="popup__input popup__input_type_title"
        required
        minLength="2"
        maxLength="200"
        name="about"
        placeholder="О себе"
        id="about-input"
      />
      <span id="about-input-error" className="error" aria-live="polite"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
