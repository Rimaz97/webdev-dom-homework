import { loginUser } from "./api.js";
import { state } from "./state.js";
import { renderComments } from "./render.js";
import { renderRegister } from "./register.js";

// renderLogin: Отрисовывает форму логина.
export function renderLogin({ onLoginSuccess }) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="container">
      <div class="login-form">
        <h2>Вход</h2>
        <input type="text" class="login-input add-form-name" placeholder="Логин" />
        <input type="password" class="password-input add-form-text" placeholder="Пароль" />
        <div class="add-form-row">
          <button class="login-button add-form-button">Войти</button>
        </div>
        <div class="login-error" style="color: red; display: none;"></div>
        <div class="login-link-block">
          <a href="#" class="to-register-link">Нет аккаунта? Зарегистрироваться</a>
        </div>
        <div class="login-link-block">
          <a href="#" class="back-to-comments">Вернуться к комментариям</a>
        </div>
      </div>
    </div>
  `;

  document
    .querySelector(".login-button")
    .addEventListener("click", async () => {
      const login = document.querySelector(".login-input").value.trim();
      const password = document.querySelector(".password-input").value.trim();
      const errorDiv = document.querySelector(".login-error");

      errorDiv.style.display = "none";
      errorDiv.textContent = "";

      try {
        const { token, name } = await loginUser({ login, password });
        state.token = token;
        state.userName = name;
        // Сохраняем в LocalStorage
        localStorage.setItem("user", JSON.stringify({ token, userName: name }));
        if (onLoginSuccess) {
          onLoginSuccess({ token, name });
        } else {
          renderComments();
        }
      } catch (e) {
        errorDiv.textContent = e.message || "Ошибка авторизации";
        errorDiv.style.display = "block";
      }
    });

  // Переход на форму регистрации
  document.querySelector(".to-register-link").addEventListener("click", (e) => {
    e.preventDefault();
    renderRegister({
      onRegisterSuccess: ({ token, name }) => {
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
