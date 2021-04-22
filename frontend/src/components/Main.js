import React from "react";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__image-box">
          <button
            className="profile__image-button"
            onClick={props.onEditAvatar}
          />
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="profile__image"
          />
        </div>

        <div className="profile__description">
          <h1 className="profile__name">{currentUser.name}</h1>
          <p className="profile__info">{currentUser.about}</p>
          <button
            className="profile__edit-button"
            onClick={props.onEditProfile}
            type="button"
            aria-label="Изменить"
          />
        </div>
        <button
          className="profile__add-button"
          onClick={props.onAddPlace}
          type="button"
          aria-label="Добавить"
        />
      </section>

      <section className="elements">
        {props.cards.map((card) => {
          // console.log(props.cards);
          return (
            <Card key={card._id} card={card} onCardClick={props.onCardClick} onCardDelete={props.onCardDelete} onCardLike={props.onCardLike} />//+onCardDelete & onCardLike
          );
        })}
      </section>
    </main>
  );
}

export default Main;
