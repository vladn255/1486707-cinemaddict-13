import {getDMYDate} from "../utils/date-time.js";
import {KeyBindings} from "../utils/render.js";
import {FilmDetails} from "../utils/const.js";
import AbstractView from "./abstract.js";


// создание шаблона сведения о фильме
const createFilmDetailItemTemplate = (detail, detailName) => {

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${FilmDetails[detailName]}</td>
      <td class="film-details__cell">${detail}</td>
    </tr>`);
};

// создание шаблона информации о фильме
const createPopUpTemplate = (filmCard) => {

  const {cover, title, rate, description, originalTitle, ageRestriction, releaseDate, duration, genres, director, screenwriters, cast, country, isToWatch, isAlreadyWatched, isInFavorites} = filmCard;

  const controls = [
    {
      name: `Add to watchlist`,
      modifier: `watchlist`,
      isActive: isToWatch
    },
    {
      name: `Already watched`,
      modifier: `watched`,
      isActive: isAlreadyWatched
    },
    {
      name: `Add to favorites`,
      modifier: `favorite`,
      isActive: isInFavorites
    }
  ];

  const genresTemplate = genres.map((item) => `<span class="film-details__genre">${item}</span>`).join(``);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${cover}" alt="">

              <p class="film-details__age">${ageRestriction}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rate}</p>
                </div>
              </div>

              <table class="film-details__table">
                ${createFilmDetailItemTemplate(director, `director`)}
                ${createFilmDetailItemTemplate(screenwriters, `screenwriters`)}
                ${createFilmDetailItemTemplate(cast, `cast`)}
                ${createFilmDetailItemTemplate(getDMYDate(releaseDate), `releaseDate`)}
                ${createFilmDetailItemTemplate(duration, `duration`)}
                ${createFilmDetailItemTemplate(country, `country`)}
                ${createFilmDetailItemTemplate(genresTemplate, `${
      genres.length === 1
        ? `genre`
        : `genres`}`)}
                </tr>
              </table>

              <p class="film-details__film-description">
                    ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${controls.map(({name, modifier, isActive}) => {
      return (`
            <input type="checkbox" class="film-details__control-input visually-hidden" id="${modifier}" name="${modifier}" ${isActive
          ? `checked`
          : ``}>
            <label for="${modifier}" class="film-details__control-label film-details__control-label--${modifier}">${name}</label>
            `);
    }).join(``)}
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

            <ul class="film-details__comments-list">

            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class Popup extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._clickClosePopupHandler = this._clickClosePopupHandler.bind(this);
    this._escPressClosePopupHandler = this._escPressClosePopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPopUpTemplate(this._filmCard);
  }

  _clickClosePopupHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _escPressClosePopupHandler(evt) {
    if (evt.key === KeyBindings.ESCAPE) {
      evt.preventDefault();
      this._callback.keydown();
    }
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setClickClosePopupHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickClosePopupHandler);
  }

  setEscPressClosePopupHandler(callback) {
    this._callback.keydown = callback;
    document.addEventListener(`keydown`, this._escPressClosePopupHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._historyClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
