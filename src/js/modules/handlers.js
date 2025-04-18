import { postComment } from "./api.js";
import { comments, setReplyToId, fetchComments } from "./state.js";
import { renderComments } from "./render.js";

let handlersInitialized = false;

const initEventListeners = () => {
  if (handlersInitialized) return;
  handlersInitialized = true;

  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");
  const commentsList = document.querySelector(".comments");

  addButton.disabled = true;

  const validateForm = () => {
    addButton.disabled = !(nameInput.value.trim() && textInput.value.trim());
  };

  validateForm();

  nameInput.addEventListener("input", validateForm);
  textInput.addEventListener("input", validateForm);

  // Обработчик лайков
  commentsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-button")) {
      const commentId = Number(e.target.closest(".comment").dataset.id);
      const comment = comments.find((c) => c.id === commentId);
      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
      e.target.classList.toggle("-active-like");
      e.target.previousElementSibling.textContent = comment.likes;
    }
  });

  // Обработчик ответа (оставлен как задел на будущее)
  commentsList.addEventListener("click", (e) => {
    const commentElement = e.target.closest(".comment");
    if (!commentElement || e.target.classList.contains("like-button")) return;

    const commentId = Number(commentElement.dataset.id);
    const comment = comments.find((c) => c.id === commentId);
    textInput.value = `@${comment.name}: ${comment.text}\n\n`;
    setReplyToId(commentId); // Оставили только установку ID
    textInput.focus();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) return;

    try {
      await postComment({
        name,
        text,
        // parentId: getReplyToId() - удалено
      });

      await fetchComments();
      renderComments();

      nameInput.value = "";
      textInput.value = "";
      setReplyToId(null);
      addButton.disabled = true;
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  addButton.addEventListener("click", handleSubmit);
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !addButton.disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  });
};

export const initHandlers = () => {
  initEventListeners();
};
