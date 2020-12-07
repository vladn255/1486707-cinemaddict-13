import {getShortText, getYDate} from "../utils.js";

const ControlsList = {
  WATCHLIST: {
    name: `Add to watchlist`,
    modifier: `add-to-watchlist`
  },
  HISTORY: {
    name: `Mark as watched`,
    modifier: `mark-as-watched`
  },
  FAVORITES: {
    name: `Mark as favorite`,
    modifier: `favorite`
  }
};

const createControlButtonItem = (control, check) => {
  const {modifier, name} = control;
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${modifier}
    ${check
      ? ``
      : ` film-card__controls-item--active`}"
      type="button">${name}</button>`);
};

const createFilmArticle = (filmCard) => {
  let {cover, title, rate, releaseDate, duration, genres, description, commentsCount, isToWatch, isAlreadyWatched, isInFavorites} = filmCard;

  const shortDescription = getShortText(description);
  const genre = genres[0];

  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rate}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getYDate(releaseDate)}</span>
          <span class="film-card__duration">${duration}</span>
          <span class="film-card__genre">${genre}</span>
        </p>
        <img src="${cover}" alt="${title}" class="film-card__poster">
        <p class="film-card__description">${shortDescription}</p>
        <a class="film-card__comments">${commentsCount} comments</a>
        <div class="film-card__controls">
         ${createControlButtonItem(ControlsList.WATCHLIST, isToWatch)}
         ${createControlButtonItem(ControlsList.HISTORY, isAlreadyWatched)}
         ${createControlButtonItem(ControlsList.FAVORITES, isInFavorites)}
        </div>
     </article>`
  );
};

export {createFilmArticle};
