import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

//создание класса Card

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner === currentUser._id;

  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? "element__delete" : "element__delete_active"
  }`;

  const isLiked = props.card.likes.some((i) => i === currentUser._id);

  const cardLikeButtonClassName = `element__like ${
    isLiked && "element__like_linked"
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <div className="element">
      <div className="element__item">
        <img
          onClick={handleClick}
          src={props.card.link}
          alt={props.card.name}
          className="element__image"
        ></img>
        <button
          className={cardDeleteButtonClassName}
          onClick={handleDeleteClick}
          type="button"
          aria-label="Удалить"
        />
      </div>
      <div className="element__description">
        <h3 className="element__title">{props.card.name}</h3>
        <div className="element__like-box">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="button"
            aria-label="Нравится"
          ></button>
          <span className="element__like_counter">
            {props.card.likes.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
