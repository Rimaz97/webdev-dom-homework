export const comments = [
  {
    id: 1,
    name: "Глеб Фокин",
    text: "Это будет первый комментарий на этой странице",
    date: new Date().toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    likes: 3,
    isLiked: false,
  },
  {
    id: 2,
    name: "Варвара Н.",
    text: "Мне нравится как оформлена эта страница! ❤",
    date: new Date().toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    likes: 75,
    isLiked: true,
  },
];

let _replyToId = null;

export const getReplyToId = () => _replyToId;
export const setReplyToId = (id) => {
  _replyToId = id;
};
