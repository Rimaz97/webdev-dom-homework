import { postComment } from "./api.js";
import { state, setReplyToId, fetchComments, delay } from "./state.js";
import { renderComments } from "./render.js";
import { renderLogin } from "./login.js";
import { renderRegister } from "./register.js";

// initEventListeners: Инициализирует обработчики событий.
const initEventListeners = () => {
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");
  const commentsList = document.querySelector(".comments");
  const loginButton = document.querySelector(".login-button");
  const registerButton = document.querySelector(".register-button");
  const logoutButton = document.querySelector(".logout-button");

  // --- Обработчики формы добавления комментария ---
  if (addButton && textInput) {
    addButton.disabled = true;

    const validateForm = () => {
      addButton.disabled = !(textInput.value.trim().length >= 3);
    };

    if (nameInput) {
      nameInput.value = state.userName || "";
      nameInput.readOnly = true;
    }

    textInput.addEventListener("input", validateForm);
    validateForm();

    // handleSubmit: Отправляет форму.
    const handleSubmit = async (e) => {
      e.preventDefault();

      const text = textInput.value.trim();
      if (!text) return;

      state.isAdding = true;
      renderComments();

      try {
        await postComment({
          text,
          token: state.token,
        });

        await fetchComments();
        renderComments();

        textInput.value = "";
        setReplyToId(null);
        addButton.disabled = true;
      } catch (error) {
        if (error.message === "400") {
          alert("Комментарий должен быть не короче 3 символов");
        } else if (error.message === "500") {
          alert("Сервер сломался, попробуй позже");
        } else if (error.message === "network") {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        } else if (
          error.message === "Вы не авторизованы" ||
          error.message === "Вы не авторизованы или срок действия токена истёк"
        ) {
          alert("Авторизуйтесь, чтобы добавить комментарий");
        } else {
          alert(`Ошибка: ${error.message}`);
        }
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
  }

  // --- Единый обработчик для лайков и цитирования ---
  if (commentsList) {
    commentsList.addEventListener("click", async (e) => {
      const commentElement = e.target.closest(".comment");
      if (!commentElement) return;

      const commentId = commentElement.dataset.id; // Теперь строка, а не число
      const comment = state.comments.find((c) => c.id == commentId); // Используем == вместо ===
      if (!comment) return;

      // Лайк
      if (e.target.closest(".like-button")) {
        if (comment.isLikeLoading) return;
        comment.isLikeLoading = true;
        renderComments();

        try {
          await delay(1000);
          comment.likes = comment.isLiked
            ? comment.likes - 1
            : comment.likes + 1;
          comment.isLiked = !comment.isLiked;
        } catch (error) {
          alert("Ошибка при обработке лайка");
        } finally {
          comment.isLikeLoading = false;
          renderComments();
        }
        return;
      }

      // Цитирование (если клик не по лайку)
      const textInput = document.querySelector(".add-form-text");
      if (!textInput) return;
      textInput.value = `@${comment.name}: ${comment.text}\n\n`;
      setReplyToId(commentId);
      textInput.focus();
    });
  }

  // --- Обработчик перехода на логин ---
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      renderLogin({
        onLoginSuccess: ({ token, name }) => {
          state.token = token;
          state.userName = name;
          // Сохраняем в LocalStorage
          localStorage.setItem(
            "user",
            JSON.stringify({ token, userName: name }),
          );
          fetchComments().then(renderComments);
        },
      });
    });
  }

  // --- Обработчик перехода на регистрацию ---
  if (registerButton) {
    registerButton.addEventListener("click", (e) => {
      e.preventDefault();
      renderRegister({
        onRegisterSuccess: ({ token, name }) => {
          state.token = token;
          state.userName = name;
          // Сохраняем в LocalStorage
          localStorage.setItem(
            "user",
            JSON.stringify({ token, userName: name }),
          );
          fetchComments().then(renderComments);
        },
      });
    });
  }

  // --- Обработчик выхода ---
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      state.token = null;
      state.userName = null;
      localStorage.removeItem("user");
      renderComments();
    });
  }
};

// initHandlers: Запускает обработчики.
export const initHandlers = () => {
  initEventListeners();
};
