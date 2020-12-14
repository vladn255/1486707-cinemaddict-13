import dayjs from "dayjs";

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


export {
  turnMinutesToHours,
  getYDate,
  getDMYDate,
  getYMDHMDate,
};
