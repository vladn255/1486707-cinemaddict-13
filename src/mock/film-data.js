import {getRandomInteger, turnMinutesToHours} from "../utils.js";
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
  POSTERS: [
    `./images/posters/made-for-each-other.png`,
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/the-dance-of-life.jpg`
  ],
  TITLES: [
    `Black Mass`,
    `Guard`,
    `In Bruges`,
    `Big Lebowski`
  ],
  GENRES: [
    `comedy`,
    `drama`,
    `thriller`,
    `action`,
    `biopic`
  ],
  DIRECTORS: [
    `Scott Cooper`,
    `Martin Scorsese`,
    `Martin McDonagh`,
    `Coen`
  ],
  SCREENWRITERS: [`Dick Lerr`, `Patrick o'Neil`],
  CAST: [`J.Depp`, `D.Johnson`, `J.Edgerton`, `B.Camberbetch`],
  MPAA_RATING: [`G`, `PG`, `PG-13`, `R`, `NC-17`],
  COUNTRIES: [
    `Russia`,
    `USA`,
    `Ireland`,
    `S.Korea`
  ]
};


// генерация адреса обложки фильма
const generateCoverImage = () => {
  return CONSTANTS.POSTERS[getRandomInteger(0, CONSTANTS.POSTERS.length - 1)];
};

// генерация названия фильма
const generateTitle = () => {
  return CONSTANTS.TITLES[getRandomInteger(0, CONSTANTS.TITLES.length - 1)];
};

// генерация рейтинга
const generateRate = () => {
  return (getRandomInteger(0, 100) / 10);
};

// генерация полного описания фильма
const generateFullDescription = () => {
  const SENTENCES_COUNT_MAX = 5;
  const sentencesCount = getRandomInteger(1, SENTENCES_COUNT_MAX);
  const randomDesc = [];

  for (let i = 0; i < sentencesCount; i++) {
    randomDesc.push(CONSTANTS.RANDOM_SENTENCES[getRandomInteger(0, CONSTANTS.RANDOM_SENTENCES.length - 1)]);
  }

  return randomDesc.join(` `);
};

// генерация сокращенного описания фильма
const generateShortDescription = (text) => {
  const MAX_TEXT_LENGTH = 140;
  if (text.length >= MAX_TEXT_LENGTH) {
    return (`${text.slice(MAX_TEXT_LENGTH - 2)}...`);
  }
  return text;
};

// генерация списка жанров
const generateGenres = () => {
  const maxCount = getRandomInteger(1, CONSTANTS.GENRES.length - 1);

  const genresList = [];
  for (let i = 0; i < maxCount; i++) {
    genresList.push(CONSTANTS.GENRES[getRandomInteger(0, CONSTANTS.GENRES.length - 1)]);
  }

  return genresList;
};

// генерация даты релиза
const generateReleaseDate = () => {
  return dayjs(getRandomInteger(1930, 2020)).format(`YYYY`);
};

// генерация длительности
const generateDuration = () => {
  return turnMinutesToHours(getRandomInteger(1, 210));
};

// генерация имени директора
const generateDirector = () => {
  return CONSTANTS.DIRECTORS[getRandomInteger(0, CONSTANTS.DIRECTORS.length - 1)];
};

// генерация списка сценаристов
const generateScreenwriters = () => {
  return CONSTANTS.SCREENWRITERS.join(`, `);
};

// генерация списка актеров
const generateCast = () => {
  return CONSTANTS.CAST.join(`, `);
};

// генерация возрастного ограничения
const generateAgeRestriction = () => {
  return CONSTANTS.MPAA_RATING[getRandomInteger(0, CONSTANTS.MPAA_RATING.length - 1)];
};

// генерация страны
const generateCountry = () => {
  return CONSTANTS.COUNTRIES[getRandomInteger(0, CONSTANTS.COUNTRIES.length - 1)];
};

const generateFilmCard = () => {

  const COMMENT_COUNT_MAX = 5;

  return {
    cover: generateCoverImage(),
    title: generateTitle(),
    rate: generateRate(),
    releaseDate: generateReleaseDate(),
    duration: generateDuration(),
    genres: generateGenres(),
    fullDescription: generateFullDescription(),
    shortDescription: generateShortDescription(generateFullDescription()),
    commentsCount: getRandomInteger(0, COMMENT_COUNT_MAX),
    originalTitle: generateTitle(),
    director: generateDirector(),
    screenwriters: generateScreenwriters(),
    cast: generateCast(),
    country: generateCountry(),
    ageRestriction: generateAgeRestriction(),
    isToWatch: Boolean(getRandomInteger(0, 1)),
    isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
    isInFavorites: Boolean(getRandomInteger(0, 1))
  };
};

export {generateFilmCard};
