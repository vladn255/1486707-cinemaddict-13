import {getDMYDate} from "../utils/date-time.js";
import {KeyBindings} from "../utils/render.js";
import {FilmDetails} from "../utils/const.js";
import SmartView from "./smart.js";


// создание шаблона сведения о фильме
const createFilmDetailItemTemplate = (detail, detailName) => {

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${FilmDetails[detailName]}</td>
      <td class="film-details__cell">${detail}</td>
    </tr>`);
};

// создание шаблона информации о фильме
const createPopUpTemplate = (data) => {

  const {cover, title, rate, description, originalTitle, ageRestriction, releaseDate, duration, genres, director, screenwriters, cast, country, isToWatch, isAlreadyWatched, isInFavorites, commentEmojiSrc, commentEmojiAltText, comment} = data;

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
              <div class="film-details__add-emoji-label">
              ${commentEmojiSrc
      ? `<img src="${commentEmojiSrc}" width="55" height="55" alt="${commentEmojiAltText}">`
      : ``}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment
      ? `${comment}</textarea>`
      : `</textarea>`}

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

export default class Popup extends SmartView {
  constructor(filmCard) {
    super();
    this._data = Popup.parseFilmToData(filmCard);
    this._scrollPosition = 0;

    this._clickClosePopupHandler = this._clickClosePopupHandler.bind(this);
    this._escPressClosePopupHandler = this._escPressClosePopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._addSmileEmojiHandler = this._addSmileEmojiHandler.bind(this);
    this._addSleepingEmojiHandler = this._addSleepingEmojiHandler.bind(this);
    this._addPukeEmojiHandler = this._addPukeEmojiHandler.bind(this);
    this._addAngryEmojiHandler = this._addAngryEmojiHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._scrollHandler = this._scrollHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopUpTemplate(this._data);
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

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this.callback.formSubmit(Popup.parseDataToFilm(this._data));
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

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        {
          commentEmojiSrc: null,
          commentEmojiAltText: null
        }
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    if (!data.commentEmojiSrc) {
      data.commentEmojiSrc = null;
    }

    if (!data.commentEmojiAltText) {
      data.commentEmojiAltText = null;
    }

    delete data.commentEmojiSrc;
    delete data.commentEmojiAltText;

    return data;
  }

  _addSmileEmojiHandler(evt) {
    evt.preventDefault();

    this.updateData({
      commentEmojiSrc: `./images/emoji/smile.png`,
      commentEmojiAltText: `emoji-smile`
    });
  }

  _addSleepingEmojiHandler(evt) {
    evt.preventDefault();

    this.updateData({
      commentEmojiSrc: `./images/emoji/sleeping.png`,
      commentEmojiAltText: `emoji-sleeping`
    });
  }

  _addPukeEmojiHandler(evt) {
    evt.preventDefault();

    this.updateData({
      commentEmojiSrc: `./images/emoji/puke.png`,
      commentEmojiAltText: `emoji-puke`
    });
  }

  _addAngryEmojiHandler(evt) {
    evt.preventDefault();

    this.updateData({
      commentEmojiSrc: `./images/emoji/angry.png`,
      commentEmojiAltText: `emoji-angry`
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({comment: evt.target.value}, true);
  }

  _scrollHandler(evt) {
    evt.preventDefault();
    this._scrollPosition = this.getElement().scrollTop;
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickClosePopupHandler);
    document.addEventListener(`keydown`, this._escPressClosePopupHandler);
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._historyClickHandler);
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);

    this.getElement().querySelector(`label[for="emoji-smile"]`).addEventListener(`click`, this._addSmileEmojiHandler);
    this.getElement().querySelector(`label[for="emoji-sleeping"]`).addEventListener(`click`, this._addSleepingEmojiHandler);
    this.getElement().querySelector(`label[for="emoji-puke"]`).addEventListener(`click`, this._addPukeEmojiHandler);
    this.getElement().querySelector(`label[for="emoji-angry"]`).addEventListener(`click`, this._addAngryEmojiHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);

    this.getElement().addEventListener(`scroll`, this._scrollHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.getElement().scrollTop = this._scrollPosition;
  }

}
