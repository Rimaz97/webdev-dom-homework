import { comments } from "./comments-data.js";
import { sanitize } from "./sanitize.js";

export const renderComments = () => {
  const commentsList = document.querySelector(".comments");
  commentsList.innerHTML = "";

  commentsList.innerHTML = comments
    .map(
      (comment) => `
      <li class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div>${sanitize(comment.name)}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${sanitize(comment.text).replace(/\n/g, "<br>")}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
          </div>
        </div>
      </li>
    `,
    )
    .join("");
};
