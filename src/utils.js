import dayjs from "dayjs";

// рандомизатор
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// перевод минут в часы
const turnMinutesToHours = (number) => {
  const MINUTES_IN_HOUR = 60;
  const hours = Math.floor(number / MINUTES_IN_HOUR);
  const minutes = number % MINUTES_IN_HOUR;

  return hours < 1
    ? `${minutes}m`
    : `${hours}h ${minutes}m`;
};

// формирование даты в формате (год)
const getYDate = (date) => {
  return dayjs(date).format(`YYYY`);
};

// формирование даты в формате (день месяц год)
const getDMYDate = (date) => {
  return dayjs(date).format(`DD MMMM YYYY`);
};

// формирование даты в формате (год / месяц / день часы : минуты)
const getYMDHMDate = (date) => {
  return dayjs(date).format(`YYYY/MM/DD HH:mm`);
};


// обрезание текстового фрагмента до 140 символов
const getShortText = (text) => {
  const MAX_TEXT_LENGTH = 140;
  return text.length > MAX_TEXT_LENGTH
    ? `${text.slice(0, MAX_TEXT_LENGTH - 2)}...`
    : text;
};

export {
  getRandomInteger,
  turnMinutesToHours,
  getShortText,
  getYDate,
  getDMYDate,
  getYMDHMDate
};
