import { renderComments } from "./modules/render.js";
import { initHandlers } from "./modules/handlers.js";

document.addEventListener("DOMContentLoaded", () => {
  renderComments();
  initHandlers();
});
