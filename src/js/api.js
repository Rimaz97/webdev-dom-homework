// Ключ для API (используй свой никнейм или другой идентификатор)
const API_KEY = "Rimaz-khusnutdinov";
const BASE_URL = `https://wedev-api.sky.pro/api/v2/${API_KEY}/comments`;
const LOGIN_URL = "https://wedev-api.sky.pro/api/user/login";
const REGISTER_URL = "https://wedev-api.sky.pro/api/user";

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
export async function postComment({ text, token }) {
  try {
    // проверяем длину текста
    if (text.length < 3) {
      throw new Error("400");
    }

    // проверяем наличие токена
    if (!token) {
      throw new Error("Вы не авторизованы");
    }

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: text.trim(),
        forceError: false, // можно поставить true чтобы сервер вернул ошибку
      }),
    });

    const data = await response.json();

    // проверяем статус ответа
    if (response.status === 500) {
      throw new Error("500");
    }

    if (response.status === 401) {
      throw new Error("Вы не авторизованы или срок действия токена истёк");
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

// loginUser: Авторизует пользователя.
export async function loginUser({ login, password }) {
  try {
    // проверяем заполненность полей
    if (!login || !password) {
      throw new Error("Заполните логин и пароль");
    }

    const response = await fetch(LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
      }),
    });

    const data = await response.json();

    // проверяем статус ответа
    if (response.status === 400) {
      throw new Error(data.error || "Неверный логин или пароль");
    }

    if (response.status === 500) {
      throw new Error("Сервер сломался, попробуйте позже");
    }

    // если всё ок, возвращаем токен и имя пользователя
    return {
      token: data.user.token,
      name: data.user.name,
    };
  } catch (error) {
    // если нет интернета
    if (error.message === "Failed to fetch") {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
    throw error;
  }
}

// registerUser: Регистрирует пользователя.
export async function registerUser({ login, name, password }) {
  try {
    // проверяем заполненность полей
    if (!login || !name || !password) {
      throw new Error("Заполните все поля");
    }

    const response = await fetch(REGISTER_URL, {
      method: "POST",
      body: JSON.stringify({
        login,
        name,
        password,
      }),
    });

    const data = await response.json();

    // проверяем статус ответа
    if (response.status === 400) {
      throw new Error(
        data.error || "Пользователь с таким логином уже существует",
      );
    }

    if (response.status === 500) {
      throw new Error("Сервер сломался, попробуйте позже");
    }

    // если всё ок, возвращаем токен и имя пользователя
    return {
      token: data.user.token,
      name: data.user.name,
    };
  } catch (error) {
    // если нет интернета
    if (error.message === "Failed to fetch") {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
    throw error;
  }
}
