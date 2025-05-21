import { state } from "./state.js";
import { sanitize } from "./sanitize.js";
import { initHandlers } from "./handlers.js";

// renderComments: Отрисовывает комментарии и форму/ссылку авторизации.
export const renderComments = () => {
  const app = document.getElementById("app");

  // Состояния загрузки/добавления
  let statusHtml = "";
  if (state.isLoading) {
    statusHtml = `<div class="loading">Загрузка комментариев...</div>`;
  }
  if (state.isAdding) {
    statusHtml = `<div class="adding">Комментарий добавляется...</div>`;
  }

  // Блок комментариев
  let commentsHtml = `
    <ul class="comments">
      ${state.comments
        .map((comment) => {
          const date = new Date(comment.date).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return `
              <li class="comment" data-id="${comment.id}">
                <div class="comment-header">
                  <div>${sanitize(comment.name || "Аноним")}</div>
                  <div>${date}</div>
                </div>
                <div class="comment-body">
                  <div class="comment-text">${sanitize(comment.text).replace(/\n/g, "<br>")}</div>
                </div>
                <div class="comment-footer">
                  <div class="likes">
                    <span class="likes-counter">${comment.likes}</span>
                    <button class="like-button ${comment.isLiked ? "-active-like" : ""} ${comment.isLikeLoading ? "-loading-like" : ""}"></button>
                  </div>
                </div>
              </li>
            `;
        })
        .join("")}
    </ul>
  `;

  // Блок формы или ссылки на авторизацию
  let formHtml = "";

  if (state.token) {
    // Если авторизован — показываем форму добавления комментария и кнопку выхода
    formHtml = `
    <form class="add-form">
      <input
        type="text"
        class="add-form-name"
        value="${state.userName || ""}"
        readonly
      />
      <textarea
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш комментарий"
      ></textarea>
      <div class="add-form-row">
        <button class="add-form-button">Отправить</button>
        <button type="button" class="logout-button add-form-button">Выйти</button>
      </div>
    </form>
  `;
  } else {
    // Если не авторизован — показываем кнопки "Вход" и "Регистрация"
    formHtml = `
    <div class="auth-block">
      <button class="login-button add-form-button">Вход</button>
      <button class="register-button add-form-button">Регистрация</button>
    </div>
  `;
  }

  app.innerHTML = `
    <div class="container">
      ${statusHtml}
      ${commentsHtml}
      ${formHtml}
    </div>
  `;

  // Инициализация обработчиков только если не идёт загрузка/добавление
  if (!state.isLoading && !state.isAdding) {
    initHandlers();
  }
};
