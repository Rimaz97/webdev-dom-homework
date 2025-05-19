import { state } from "./state.js";
import { sanitize } from "./sanitize.js";

// renderComments: Отрисовывает комментарии.
export const renderComments = () => {
  const commentsList = document.querySelector(".comments");
  const form = document.querySelector(".add-form");

  if (state.isLoading) {
    commentsList.innerHTML = `<div class="loading">Загрузка комментариев...</div>`;
    if (form) form.classList.remove("hidden");
    return;
  }

  if (state.isAdding) {
    if (form) form.classList.add("hidden");
    commentsList.innerHTML = `<div class="adding">Комментарий добавляется...</div>`;
    return;
  } else {
    if (form) form.classList.remove("hidden");
  }

  commentsList.innerHTML = state.comments
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
    .join("");
};
