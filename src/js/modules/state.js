import { getComments } from "./api.js";

export let comments = [];
export let isLoading = true;
let _replyToId = null;

export const getReplyToId = () => _replyToId;
export const setReplyToId = (id) => {
  _replyToId = id;
};

export async function fetchComments() {
  try {
    comments = await getComments();
    isLoading = false;
  } catch (error) {
    isLoading = false;
    throw error;
  }
}
