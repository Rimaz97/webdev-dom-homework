import { getComments } from "./api.js";

export const state = {
  comments: [],
  isLoading: true,
  isAdding: false,
};
let _replyToId = null;

export const getReplyToId = () => _replyToId;
export const setReplyToId = (id) => {
  _replyToId = id;
};

export async function fetchComments() {
  state.isLoading = true;
  try {
    state.comments = await getComments();
    state.isLoading = false;
  } catch (error) {
    state.isLoading = false;
    throw error;
  }
}

// Функция задержки для имитации API
export function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}
