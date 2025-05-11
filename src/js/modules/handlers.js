import { postComment } from "./api.js";
import { state, setReplyToId, fetchComments, delay } from "./state.js";
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

  // Обработчик лайков с анимацией и задержкой
  commentsList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("like-button")) {
      const commentId = Number(e.target.closest(".comment").dataset.id);
      const comment = state.comments.find((c) => c.id === commentId);

      // Если лайк уже в процессе - игнорируем клик
      if (comment.isLikeLoading) return;

      comment.isLikeLoading = true;
      renderComments();

      try {
        await delay(1000); // имитация задержки

        comment.likes = comment.isLiked ? comment.likes - 1 : comment.likes + 1;
        comment.isLiked = !comment.isLiked;
      } catch (error) {
        alert("Ошибка при обработке лайка");
      } finally {
        comment.isLikeLoading = false;
        renderComments();
      }
    }
  });

  // Обработчик ответа
  commentsList.addEventListener("click", (e) => {
    const commentElement = e.target.closest(".comment");
    if (!commentElement || e.target.classList.contains("like-button")) return;

    const commentId = Number(commentElement.dataset.id);
    const comment = state.comments.find((c) => c.id === commentId);
    textInput.value = `@${comment.name}: ${comment.text}\n\n`;
    setReplyToId(commentId);
    textInput.focus();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) return;

    state.isAdding = true;
    renderComments();

    try {
      await postComment({
        name,
        text,
      });

      await fetchComments();
      renderComments();

      nameInput.value = "";
      textInput.value = "";
      setReplyToId(null);
      addButton.disabled = true;
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      state.isAdding = false;
      renderComments();
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
