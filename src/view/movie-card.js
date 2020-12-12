import {getShortText, getYDate, createElement} from "../utils.js";

const createFilmArticle = (filmCard) => {
  let {cover, title, rate, releaseDate, duration, genres, description, commentsCount, isToWatch, isAlreadyWatched, isInFavorites} = filmCard;

  const controls = [
    {
      name: `Add to watchlist`,
      modifier: `add-to-watchlist`,
      isActive: isToWatch
    },
    {
      name: `Mark as watched`,
      modifier: `mark-as-watched`,
      isActive: isAlreadyWatched
    },
    {
      name: `Mark as favorite`,
      modifier: `favorite`,
      isActive: isInFavorites
    }
  ];

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
           ${controls.map(({name, modifier, isActive}) => {
      return (
        `<button class="film-card__controls-item button film-card__controls-item--${modifier}
        ${isActive
          ? ` film-card__controls-item--active`
          : ``}"
         type="button">${name}</button>`
      );
    }).join(``)}

        </div>
     </article>`
  );
};

export default class MovieCard {
  constructor(filmCard) {
    this._element = null;
    this._filmCard = filmCard;
  }

  getTemplate() {
    return createFilmArticle(this._filmCard);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
