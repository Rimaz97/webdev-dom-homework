import { comments, getReplyToId, setReplyToId } from "./comments-data.js";
import { renderComments } from "./render.js";

let handlersInitialized = false;

const initEventListeners = () => {
  if (handlersInitialized) return;
  handlersInitialized = true;

  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");
  const commentsList = document.querySelector(".comments");

  // Блокировка кнопки при инициализации
  addButton.disabled = true;

  const validateForm = () => {
    addButton.disabled = !(nameInput.value.trim() && textInput.value.trim());
  };

  validateForm();

  nameInput.addEventListener("input", validateForm);
  textInput.addEventListener("input", validateForm);

  commentsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-button")) {
      const commentId = Number(e.target.closest(".comment").dataset.id);
      const comment = comments.find((c) => c.id === commentId);
      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
      renderComments();
    }
  });

  commentsList.addEventListener("click", (e) => {
    const commentElement = e.target.closest(".comment");
    if (!commentElement || e.target.classList.contains("like-button")) return;

    const commentId = Number(commentElement.dataset.id);
    const comment = comments.find((c) => c.id === commentId);
    textInput.value = `@${comment.name}: ${comment.text}\n\n`;
    setReplyToId(commentId);
    textInput.focus();
  });

  const handleSubmit = () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
      alert("Поля имени и комментария обязательны для заполнения!");
      return;
    }

    comments.push({
      id: Date.now(),
      name,
      text,
      date: new Date().toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      likes: 0,
      isLiked: false,
      parentId: getReplyToId(),
    });

    nameInput.value = "";
    textInput.value = "";
    setReplyToId(null);
    addButton.disabled = true;
    renderComments();
  };

  addButton.addEventListener("click", handleSubmit);

  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !addButton.disabled) {
      e.preventDefault();
      handleSubmit();
    }
  });
};

export const initHandlers = () => {
  initEventListeners();
};
