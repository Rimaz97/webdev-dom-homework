const BASE_URL = "https://wedev-api.sky.pro/api/v1/Rimaz-khusnutdinov/comments";

// getComments: Получает комментарии с сервера.
export async function getComments() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    // если сервер вернул ошибку
    if (response.status === 500) {
      throw new Error("500");
    }

    // если всё ок, преобразуем данные в нужный формат
    return data.comments.map((comment) => ({
      id: comment.id,
      name: comment.author.name,
      text: comment.text,
      date: comment.date,
      likes: comment.likes,
      isLiked: comment.isLiked,
    }));
  } catch (error) {
    // если нет интернета
    if (error.message === "Failed to fetch") {
      throw new Error("network");
    }
    throw error;
  }
}

// postComment: Отправляет комментарий на сервер.
export async function postComment({ name, text }) {
  try {
    // проверяем длину имени и текста
    if (name.length < 3 || text.length < 3) {
      throw new Error("400");
    }

    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        text: text.trim(),
        name: name.trim(),
        forceError: true, // можно поставить true чтобы сервер вернул ошибку
      }),
    });

    const data = await response.json();

    // проверяем статус ответа
    if (response.status === 500) {
      throw new Error("500");
    }

    // если всё ок, возвращаем данные
    return data;
  } catch (error) {
    // если нет интернета
    if (error.message === "Failed to fetch") {
      throw new Error("network");
    }
    throw error;
  }
}
