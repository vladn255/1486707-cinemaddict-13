import {getDMYDate, getYMDHMDate} from "../utils/date-time.js";
import {FilmDetails, KeyBindings} from "../utils/const.js";
import SmartView from "./smart.js";


// создание шаблона сведения о фильме
const createFilmDetailItemTemplate = (detail, detailName) => {
  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${FilmDetails[detailName]}</td>
      <td class="film-details__cell">${detail}</td>
    </tr>`
  );
};

// создание элемента эмоджи
const createEmojiItem = (emoji) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
     <label class="film-details__emoji-label" for="emoji-${emoji}">
       <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
     </label>`
  );
};

// создание комментария
const createCommentItem = (comment) => {
  const {emoji, text, author, date} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emoji}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getYMDHMDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

// создание шаблона информации о фильме
const createPopUpTemplate = (data) => {

  const {cover, title, rate, description, originalTitle, ageRestriction, releaseDate, duration, genres, director, screenwriters, cast, country, isToWatch, isAlreadyWatched, isInFavorites, commentEmoji, newComment, comments} = data;

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

  const emojis = [
    `smile`,
    `sleeping`,
    `puke`,
    `angry`
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
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${comments.map((comment) => {
      return createCommentItem(comment);
    }).join(``)}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
              ${commentEmoji
      ? `<img src="./images/emoji/${commentEmoji}.png" width="55" height="55" alt="emoji-${commentEmoji}">`
      : ``}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment
      ? `${newComment}</textarea>`
      : `</textarea>`}

              </label>

              <div class="film-details__emoji-list">
                  ${emojis.map((emoji) => {
      return createEmojiItem(emoji);
    }).join(``)}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class Popup extends SmartView {
  constructor(filmCard, comments) {
    super();
    this._data = Popup.parseFilmToData(filmCard, comments);
    this._scrollPosition = 0;

    this._clickClosePopupHandler = this._clickClosePopupHandler.bind(this);
    this._escPressClosePopupHandler = this._escPressClosePopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

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
    if (evt.key === KeyBindings.ESCAPE && document.body.contains(this.getElement())) {
      evt.preventDefault();
      this._callback.escKeydown();
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

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteClickHandler);
  }

  setClickClosePopupHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickClosePopupHandler);
  }

  setEscPressClosePopupHandler(callback) {
    this._callback.escKeydown = callback;
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

  static parseFilmToData(film, comments) {
    return Object.assign(
        {},
        film,
        {
          comments,
          commentEmoji: null,
          newComment: null
        }
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    if (!data.commentEmoji) {
      data.commentEmoji = null;
    }

    if (!data.newComment) {
      data.newComment = null;
    }

    if (!data.comments) {
      data.comments = null;
    }

    delete data.commentEmoji;
    delete data.newComment;
    delete data.comments;

    return data;
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this._scrollPosition = this.getElement().scrollTop;

    this.updateData({
      commentEmoji: evt.target.value,
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      newComment: evt.target.value,
    }, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickClosePopupHandler);
    document.addEventListener(`keydown`, this._escPressClosePopupHandler);

    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._historyClickHandler);
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);

    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteClickHandler);

  }

  restoreHandlers() {
    document.removeEventListener(`keydown`, this._escPressClosePopupHandler);
    this._setInnerHandlers();
    this.getElement().scrollTop = this._scrollPosition;
  }

  reset(film, comments) {
    this.updateData(
        Popup.parseFilmToData(film, comments)
    );
  }

}
