import React from "react";
import authImageSuccess from "../images/auth_success.svg";
import authImageFailure from "../images/auth_failure.svg";

function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_type_tooltip ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__content">
        <button
          type="button"
          className="popup__close"
          onClick={props.onClose}
        />
        <div className="tooltip">
          <img
            src={props.success ? authImageSuccess : authImageFailure}
            className="tooltip__image"
            alt="Результат ригистрации"
          />
          <p className="tooltip__text">
            {props.success
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
