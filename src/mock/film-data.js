import {getRandomInteger} from "../utils/common.js";
import {turnMinutesToHours} from "../utils/date-time.js";

const FilmData = {
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
  return FilmData.POSTERS[getRandomInteger(0, FilmData.POSTERS.length - 1)];
};

// генерация названия фильма
const generateTitle = () => {
  return FilmData.TITLES[getRandomInteger(0, FilmData.TITLES.length - 1)];
};

// генерация рейтинга
const generateRate = () => {
  return (getRandomInteger(0, 100) / 10);
};

// генерация полного описания фильма
const generateDescription = () => {
  const SENTENCES_COUNT_MAX = 5;
  const sentencesCount = getRandomInteger(1, SENTENCES_COUNT_MAX);
  const randomDesc = [];

  for (let i = 0; i < sentencesCount; i++) {
    randomDesc.push(FilmData.RANDOM_SENTENCES[getRandomInteger(0, FilmData.RANDOM_SENTENCES.length - 1)]);
  }

  return randomDesc.join(` `);
};

// генерация списка жанров
const generateGenres = () => {
  const maxCount = getRandomInteger(1, FilmData.GENRES.length - 1);

  const genresList = [];
  for (let i = 0; i < maxCount; i++) {
    genresList.push(FilmData.GENRES[getRandomInteger(0, FilmData.GENRES.length - 1)]);
  }

  return genresList;
};

// генерация даты релиза
const generateReleaseDate = () => {
  return new Date(getRandomInteger(1930, 2020), getRandomInteger(1, 12), getRandomInteger(1, 31));
};

// генерация длительности
const generateDuration = () => {
  return turnMinutesToHours(getRandomInteger(1, 210));
};

// генерация имени директора
const generateDirector = () => {
  return FilmData.DIRECTORS[getRandomInteger(0, FilmData.DIRECTORS.length - 1)];
};

// генерация списка сценаристов
const generateScreenwriters = () => {
  return FilmData.SCREENWRITERS.join(`, `);
};

// генерация списка актеров
const generateCast = () => {
  return FilmData.CAST.join(`, `);
};

// генерация возрастного ограничения
const generateAgeRestriction = () => {
  return FilmData.MPAA_RATING[getRandomInteger(0, FilmData.MPAA_RATING.length - 1)];
};

// генерация страны
const generateCountry = () => {
  return FilmData.COUNTRIES[getRandomInteger(0, FilmData.COUNTRIES.length - 1)];
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
    description: generateDescription(),
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
