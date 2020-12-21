import {RenderPosition, render, replace, remove} from "../utils/render.js";

import MovieCard from "../view/movie-card.js";
import Popup from "../view/popup.js";
import Comment from "../view/comments.js";

const siteFooterElement = document.querySelector(`.footer`);
const COMMENTS_QUANTITY = 3;

export default class Movie {
  constructor(container, generateComment, changeData) {
    this._container = container;
    this._generateComment = generateComment;
    this._changeData = changeData;
    this._commentsCount = COMMENTS_QUANTITY;
    this._movieCard = null;
    this._newPopupItem = null;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._movieCard = new MovieCard(movie);
    this._newPopupItem = new Popup(movie);

    const prevMovieCard = this._movieCard;
    const prevPopupItem = this._newPopupItem;

    if (
      prevMovieCard === null ||
      prevPopupItem === null
    ) {
      this._renderMovieCard();

    } else {
      replace(this._movieCard, prevMovieCard);
      replace(this._newPopupItem, prevPopupItem);

      this._renderMovieCard();
    }
  }

  // удаление карточки
  destroy() {
    remove(this._movieCard);
    remove(this._newPopupItem);
  }

  // обработчик клика на карточку фильма
  _filmCardClickHandler() {
    this._showPopup();
  }

  // рендер одной карточки фильма
  _renderMovieCard() {
    render(this._container, this._movieCard, RenderPosition.BEFORE_END);

    this._movieCard.setFilmCardClickHandler(this._filmCardClickHandler);

    this._movieCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieCard.setHistoryClickHandler(this._handleHistoryClick);
    this._movieCard.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  // показ попапа
  _showPopup() {
    document.querySelector(`body`).classList.add(`hide-overflow`);

    siteFooterElement.appendChild(this._newPopupItem.getElement());
    const commentsListContainer = this._newPopupItem.getElement().querySelector(`.film-details__comments-list`);
    for (let j = 0; j < this._commentsCount; j++) {
      render(commentsListContainer, new Comment(this._generateComment()), RenderPosition.BEFORE_END);
    }

    this._newPopupItem.setClickClosePopupHandler(this._closePopupHandler);
    this._newPopupItem.setEscPressClosePopupHandler(this._closePopupHandler);
  }

  // скрытие попапа
  _closePopup() {
    document.querySelector(`body`).classList.remove(`hide-overflow`);
    siteFooterElement.removeChild(this._newPopupItem.getElement());
  }

  // обработчик закрытия попапа
  _closePopupHandler() {
    this._closePopup();
  }

  // обработчик нажатия на кнопку "Add to watchlist"
  _handleWatchlistClick() {
    this._changeData(Object.assign({}, this._movie, {isToWatch: !this._movie.isToWatch}));
  }

  // обработчик нажатия на кнопку "Mark as watched"
  _handleHistoryClick() {
    this._changeData(Object.assign({}, this._movie, {isAlreadyWatched: !this._movie.isAlreadyWatched}));
  }

  // обработчик нажатия на кнопку "Mark as favorite"
  _handleFavoriteClick() {
    this._changeData(Object.assign({}, this._movie, {isInFavorites: !this._movie.isInFavorites}));
  }
}
