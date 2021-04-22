import React from "react";
import PopupWithForm from "./PopupWithForm.js";

function EditAvatarPopup(props) {
  const refAvatar = React.useRef("");

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: refAvatar.current.value, // Значение инпута, полученное с помощью рефа
    });
  }

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        ref={refAvatar}
        type="url"
        className="popup__input popup__input_type_avatar"
        required
        name="avatar"
        placeholder="Ссылка на картинку"
        id="avatar-input"
      />
      <span id="avatar-input-error" className="error" aria-live="polite"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;