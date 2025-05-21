import { fetchComments, state } from "./state.js";
import { renderComments } from "./render.js";

// Восстанавливаем пользователя из LocalStorage
const savedUser = localStorage.getItem("user");
if (savedUser) {
  try {
    const { token, userName } = JSON.parse(savedUser);
    state.token = token;
    state.userName = userName;
  } catch (e) {
    // Если localStorage битый — очищаем
    localStorage.removeItem("user");
  }
}

// При загрузке страницы — получаем комментарии и рендерим
fetchComments().then(renderComments);
