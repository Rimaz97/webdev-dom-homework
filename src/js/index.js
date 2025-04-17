import { renderComments } from "./modules/render.js";
import { initHandlers } from "./modules/handlers.js";
import { fetchComments } from "./modules/state.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchComments();
    renderComments();
    initHandlers();
  } catch (error) {
    alert("Ошибка при загрузке комментариев: " + error.message);
  }
});
