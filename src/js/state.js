import { getComments } from "./api.js";

export const state = {
  comments: [],
  isLoading: true,
  isAdding: false,
  token: null, // токен пользователя
  userName: null, // имя пользователя
};

let _replyToId = null;

// getReplyToId: Возвращает id ответа.
export const getReplyToId = () => _replyToId;

// setReplyToId: Устанавливает id ответа.
export const setReplyToId = (id) => {
  _replyToId = id;
};

// fetchComments: Загружает комментарии.
export async function fetchComments() {
  state.isLoading = true;
  try {
    const comments = await getComments();
    state.comments = comments;
    state.isLoading = false;
  } catch (error) {
    state.isLoading = false;
    // показываем ошибку
    if (error.message === "Failed to fetch") {
      alert("Кажется, у вас сломался интернет, попробуйте позже");
    } else if (error.message === "500") {
      alert("Сервер сломался, попробуй позже");
    } else {
      alert(error.message);
    }
    throw error;
  }
}

// delay: Создаёт задержку.
export function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}
