// рандомизатор
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// обрезание текстового фрагмента до 140 символов
const getShortText = (text) => {
  const MAX_TEXT_LENGTH = 140;
  return text.length > MAX_TEXT_LENGTH
    ? `${text.slice(0, MAX_TEXT_LENGTH - 2)}...`
    : text;
};

// сортировка по рейтингу
const sortByRate = (movieA, movieB) => movieB.rate - movieA.rate;

// сортировка по количеству комментариев
const sortByCommentsCount = (movieA, movieB) => movieB.commentsCount - movieA.commentsCount;

export {
  getRandomInteger,
  getShortText,
  sortByRate,
  sortByCommentsCount
};

