const BASE_URL = "https://wedev-api.sky.pro/api/v1/Rimaz-khusnutdinov/comments";

export async function getComments() {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ошибка загрузки комментариев");
    }

    const data = await response.json();
    return data.comments.map((comment) => ({
      id: comment.id,
      name: comment.author.name,
      text: comment.text,
      date: comment.date,
      likes: comment.likes,
      isLiked: comment.isLiked,
    }));
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function postComment({ name, text }) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        text: text.trim(),
        name: name.trim(),
        forceError: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ошибка сервера");
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
