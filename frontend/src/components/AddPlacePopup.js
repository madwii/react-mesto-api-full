import React from "react";
import PopupWithForm from "./PopupWithForm.js";

function AddPlacePopup(props) {
  const [placeName, setPlaceName] = React.useState("");
  const [placeLink, setPlaceLink] = React.useState("");

  React.useEffect(() => {
    setPlaceName("");
    setPlaceLink("");
  }, [props.isOpen])

  function handleAddPlaceName(e) {
    setPlaceName(e.target.value);
  }

  function handleAddPlaceLink(e) {
    setPlaceLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      name: placeName,
      link: placeLink,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      title="Новое место"
      name="add"
    >
      <input
        value={placeName || ""}
        onChange={handleAddPlaceName}
        type="text"
        className="popup__input popup__input_type_add"
        required
        minLength="2"
        maxLength="30"
        name="name"
        placeholder="Название"
        id="new-card"
      />

      <span id="new-card-error" className="error" aria-live="polite"></span>

      <input
        value={placeLink || ""}
        onChange={handleAddPlaceLink}
        type="url"
        className="popup__input popup__input_type_link"
        required
        name="link"
        placeholder="Ссылка на картинку"
        id="link-card"
      />

      <span id="link-card-error" className="error" aria-live="polite"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
