import {getDMYDate, getYMDHMDate, turnMinutesToHours} from "../utils/date-time.js";
import {FilmDetails, KeyBindings} from "../utils/const.js";
import SmartView from "./smart.js";

import he from "he";

const SHAKE_ANIMATION_TIMEOUT = 600;

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
  const {emoji, text, author, date, id, isDeleting} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getYMDHMDate(date)}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}" ${isDeleting ? `disabled` : ``}>${isDeleting ? `Deleting...` : `Delete`}</button>
        </p>
      </div>
     </li>`
  );
};

// создание списка комментариев
const createCommentsList = (isLoading, comments) => {
  return isLoading
    ? `<li>Loading...</li>`
    : `${comments.map(createCommentItem).join(``)}`;

};

// создание шаблона информации о фильме
const createPopUpTemplate = (data) => {

  const {
    cover,
    title,
    rate,
    description,
    originalTitle,
    ageRestriction,
    releaseDate,
    duration,
    genres,
    director,
    screenwriters,
    cast,
    country,
    isToWatch,
    isAlreadyWatched,
    isInFavorites,
    commentEmoji,
    newComment,
    comments,
    isLoading,
    isDisabled
  } = data;

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
      <form class="film-details__inner" action="" method="get" >
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
                ${createFilmDetailItemTemplate(turnMinutesToHours(duration), `duration`)}
                ${createFilmDetailItemTemplate(country, `country`)}
                ${createFilmDetailItemTemplate(genresTemplate, `${genres.length === 1 ? `genre` : `genres`}`)}
              </table>

              <p class="film-details__film-description">
                    ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${controls.map(({name, modifier, isActive}) => {
      return (`
            <input type="checkbox" class="film-details__control-input visually-hidden" id="${modifier}" name="${modifier}" ${isActive ? `checked` : ``}>
            <label for="${modifier}" class="film-details__control-label film-details__control-label--${modifier}">${name}</label>`);
    }).join(``)}
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsList(isLoading, comments)}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
              ${commentEmoji ? `<img src="./images/emoji/${commentEmoji}.png" width="55" height="55" alt="emoji-${commentEmoji}">` : ``}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? `disabled` : ``}>${newComment ? `${he.encode(newComment)}</textarea>` : `</textarea>`}
              </label>

              <div class="film-details__emoji-list">${emojis.map((emoji) => {
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
  constructor(filmCard, comments, isLoading, isDisabled) {
    super();
    this._data = Popup.parseFilmToData(filmCard, comments, isLoading, isDisabled);
    this._isDisabled = isDisabled;
    this._scrollPosition = 0;

    this._clickClosePopupHandler = this._clickClosePopupHandler.bind(this);
    this._escPressClosePopupHandler = this._escPressClosePopupHandler.bind(this);
    this._controlsChangeHandler = this._controlsChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopUpTemplate(this._data);
  }

  _clickClosePopupHandler(evt) {
    evt.preventDefault();
    this._callback.click();

    document.removeEventListener(`keydown`, this._escPressClosePopupHandler);
    document.removeEventListener(`keydown`, this._formSubmitHandler);
  }

  _escPressClosePopupHandler(evt) {
    if (evt.key === KeyBindings.ESCAPE) {
      evt.preventDefault();
      this._callback.escKeydown();

      document.removeEventListener(`keydown`, this._escPressClosePopupHandler);
      document.removeEventListener(`keydown`, this._formSubmitHandler);
    }
  }

  _controlsChangeHandler(evt) {
    evt.preventDefault();
    this._scrollPosition = this.getElement().scrollTop;
    switch (evt.target.id) {
      case `watchlist`:
        this._callback.watchlistClick();
        break;
      case `watched`:
        this._callback.historyClick();
        break;
      case `favorite`:
        this._callback.favoriteClick();
    }
  }

  _formSubmitHandler(evt) {
    if (evt.ctrlKey && evt.key === KeyBindings.ENTER && !this._data.isDisabled) {
      evt.preventDefault();
      const newComment = Popup.parseDataToLocalComment(this._data);

      if (newComment) {
        this._callback.formSubmit(newComment);

      }
    }
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.closest(`.film-details__comment-delete`)) {

      const deletedCommentId = evt.target.dataset.commentId.toString(10);
      this._callback.deleteClick(deletedCommentId);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
  }

  setClickClosePopupHandler(callback) {
    this._callback.click = callback;
  }

  setEscPressClosePopupHandler(callback) {
    this._callback.escKeydown = callback;
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
  }

  static parseFilmToData(film, comments, isLoading, isDisabled) {
    return Object.assign(
        {},
        film,
        {
          comments,
          isLoading,
          commentEmoji: null,
          newComment: null,
          isDisabled,
        }
    );
  }

  static parseDataToLocalComment(data) {
    const localComment = Object.assign({});

    if (data.commentEmoji) {
      localComment.emoji = data.commentEmoji;
    }

    if (data.newComment) {
      localComment.text = data.newComment;
    }

    return localComment;
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();

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
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, this._controlsChangeHandler);

    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteClickHandler);
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickClosePopupHandler);

    document.addEventListener(`keydown`, this._escPressClosePopupHandler);
    document.addEventListener(`keydown`, this._formSubmitHandler);
  }

  restoreHandlers() {
    document.removeEventListener(`keydown`, this._escPressClosePopupHandler);
    document.removeEventListener(`keydown`, this._formSubmitHandler);

    this._setInnerHandlers();
  }

  reset(movie, comments) {
    this.updateData(
        Popup.parseFilmToData(movie, comments)
    );
  }

  shake(callback) {
    this.getElement().querySelector(`form`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}
