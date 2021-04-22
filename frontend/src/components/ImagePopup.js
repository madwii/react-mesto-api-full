import React from "react";

function ImagePopup(props) {
  return (
    <div
      className={`popup popup_type_image ${props.isOpen ? "popup_opened" : ""}`}
    >
      <div className="popup__image-zoom">
        <button
          type="button"
          className="popup__close"
          onClick={props.onClose}
        ></button>
        <img
          src={props.card ? props.card.link : "#"}
          alt={props.card.name}
          className="popup__image-big"
        />
        <p className="popup__image-title">{props.card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
