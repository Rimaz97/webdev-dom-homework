import { registerUser } from "./api.js";
import { state } from "./state.js";
import { renderComments } from "./render.js";
import { renderLogin } from "./login.js";

// renderRegister: Отрисовывает форму регистрации.
export function renderRegister({ onRegisterSuccess }) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="container">
      <div class="register-form">
        <h2>Регистрация</h2>
        <input type="text" class="register-name add-form-name" placeholder="Имя" />
        <input type="text" class="register-login add-form-name" placeholder="Логин" />
        <input type="password" class="register-password add-form-text" placeholder="Пароль" />
        <div class="add-form-row">
          <button class="register-button add-form-button">Зарегистрироваться</button>
        </div>
        <div class="register-error" style="color: red; display: none;"></div>
        <div class="register-link-block">
          <a href="#" class="to-login-link">Уже есть аккаунт? Войти</a>
        </div>
        <div class="register-link-block">
          <a href="#" class="back-to-comments">Вернуться к комментариям</a>
        </div>
      </div>
    </div>
  `;

  document
    .querySelector(".register-button")
    .addEventListener("click", async () => {
      const name = document.querySelector(".register-name").value.trim();
      const login = document.querySelector(".register-login").value.trim();
      const password = document
        .querySelector(".register-password")
        .value.trim();
      const errorDiv = document.querySelector(".register-error");

      errorDiv.style.display = "none";
      errorDiv.textContent = "";

      try {
        const { token, name: userName } = await registerUser({
          login,
          name,
          password,
        });
        state.token = token;
        state.userName = userName;
        // Сохраняем в LocalStorage
        localStorage.setItem("user", JSON.stringify({ token, userName }));
        if (onRegisterSuccess) {
          onRegisterSuccess({ token, name: userName });
        } else {
          renderComments();
        }
      } catch (e) {
        errorDiv.textContent = e.message || "Ошибка регистрации";
        errorDiv.style.display = "block";
      }
    });

  // Переход на форму логина
  document.querySelector(".to-login-link").addEventListener("click", (e) => {
    e.preventDefault();
    renderLogin({
      onLoginSuccess: ({ token, name }) => {
        state.token = token;
        state.userName = name;
        // Сохраняем в LocalStorage
        localStorage.setItem("user", JSON.stringify({ token, userName: name }));
        renderComments();
      },
    });
  });

  // Возврат к комментариям
  document.querySelector(".back-to-comments").addEventListener("click", (e) => {
    e.preventDefault();
    renderComments();
  });
}
