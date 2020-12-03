import {getRandomInteger} from "../utils.js";
import dayjs from "dayjs";

const CONSTANTS = {
  RANDOM_SENTENCES: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ],
  EMOJIS: [
    `./images/emoji/angry.png`,
    `./images/emoji/puke.png`,
    `./images/emoji/sleeping.png`,
    `./images/emoji/smile.png`,
  ],
  RANDOM_NAMES: [
    `Vasiliy`,
    `Petr`,
    `Anna`,
    `Maxim`
  ]
};

// генерация адреса эмодзи
const generateEmoji = () => {
  return CONSTANTS.EMOJIS[getRandomInteger(0, CONSTANTS.EMOJIS.length - 1)];
};

// генерация текста комментария
const generateText = () => {
  return CONSTANTS.RANDOM_SENTENCES[getRandomInteger(0, CONSTANTS.RANDOM_SENTENCES.length - 1)];
};

// генерация автора комментария
const generateName = () => {
  return CONSTANTS.RANDOM_NAMES[getRandomInteger(0, CONSTANTS.RANDOM_NAMES.length - 1)];
};

// генерация даты комментария
const generateDate = () => {
  const postDate = dayjs(new Date(getRandomInteger(1930, 2020), getRandomInteger(1, 12), getRandomInteger(1, 31), getRandomInteger(0, 23), getRandomInteger(0, 59)));

  return dayjs(postDate).format(`YYYY/MM/DD HH:mm`);
};

// генерация случайного комментария
const generateComment = () => {

  return {
    emoji: generateEmoji(),
    text: generateText(),
    author: generateName(),
    date: generateDate()
  };
};

export {generateComment};
