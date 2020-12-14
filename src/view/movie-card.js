import {getYDate} from "../utils/date-time.js";
import {getShortText} from "../utils/common.js";
import AbstractView from "./abstract.js";

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

export default class MovieCard extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmArticle(this._filmCard);
  }

  _filmCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setFilmCardClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._filmCardClickHandler);
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._filmCardClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._filmCardClickHandler);
  }
}
