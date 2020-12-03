const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const turnMinutesToHours = (number) => {
  const MINUTES_IN_HOUR = 60;
  const hours = Math.floor(number / MINUTES_IN_HOUR);
  const minutes = number - hours * MINUTES_IN_HOUR;

  if (hours < 1) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
};

export {
  getRandomInteger,
  turnMinutesToHours
};
