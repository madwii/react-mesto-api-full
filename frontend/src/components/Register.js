import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  // устанавливаем начальное значения для данных
  const initialData = {
    email: '',
    password: '',
  };

  const [data, setData] = useState(initialData);

  // обработка изменения в инпутах и запись их в стейт
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  // очищаем форму
  const resetForm = () => {
    setData(initialData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Если поля email или password пустые, то ничего не происходит
    if (!data.email || !data.password) {
      return;
    }

    onRegister(data).then(resetForm);
  };

  return (
    <section className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form name="login" className="auth__form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          className="auth__input auth__input_type_email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          className="auth__input auth__input_type_password"
          value={data.password}
          onChange={handleChange}
          placeholder="Пароль"
          minLength="4"
          maxLength="16"
          required
        />
        <button type="submit" className="auth__button">
          Зарегистрироваться
        </button>
      </form>
      <div className="auth__signin">
        <p>Уже зарегиcтрированы?</p>
        <Link to="/sign-in" className="auth__link-signin">
          Войти
        </Link>
      </div>
    </section>
  );
}

export default Register;
