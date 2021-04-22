import React, { useState } from "react";

function Login({ onLogin }) {
  // устанавливаем начальное значения для данных
  const initialData = {
    email: "",
    password: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      return;
    }
    onLogin(data);
  };

  return (
    <section className="auth">
      <h2 className="auth__title">Вход</h2>
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
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;