import {getYMDHMDate} from "../utils/date-time.js";
import SmartView from "./smart.js";

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
    </li>
    `
  );
};

// создание шаблона комментариев
const createCommentsTemplate = (comments, currentComment) => {
  const emojis = [
    `smile`,
    `sleeping`,
    `puke`,
    `angry`
  ];

  const {newComment, currentEmoji} = currentComment;

  return (
    `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

    <ul class="film-details__comments-list">
      ${comments.map((comment) => {
      return createCommentItem(comment);
    })
    .join(``)}
    </ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
      ${currentEmoji
      ? `<img src="./images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-${currentEmoji}">`
      : ``}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment
      ? `${newComment}</textarea>`
      : `</textarea>`}

      </label>

      <div class="film-details__emoji-list">
          ${emojis
            .map((emoji) => {
              return createEmojiItem(emoji);
            })
            .join(``)}
      </div>
    </div>
  </section>`
  );
};

export default class Comments extends SmartView {
  constructor(comments) {
    super();
    this._comments = comments;
    this._currentComment = {};

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    // this._setInnerHandlers();
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._currentComment);
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
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  // _setInnerHandlers() {
  //   this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);

  //   this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
  //   this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
  //   this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteClickHandler);

  // }

  restoreHandlers() {
    document.removeEventListener(`keydown`, this._escPressClosePopupHandler);
    this._setInnerHandlers();
    this.getElement().scrollTop = this._scrollPosition;
  }

}
