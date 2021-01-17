import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";

import {generateComment} from "../mock/comment.js";

import MovieCardView from "../view/movie-card.js";
import PopupView from "../view/popup.js";

const COMMENTS_QUANTITY = 3;

const comments = [];
for (let j = 0; j < COMMENTS_QUANTITY; j++) {
  comments.push(generateComment());
}

export default class Movie {
  constructor(container, changeData, commentsModel) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._commentsModel.setComments(comments);

    this._changeData = changeData;

    this._movieCardView = null;
    this._popupView = null;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleCommentsViewAction = this._handleCommentsViewAction.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._comments = this._commentsModel.getComments();
    const prevMovieView = this._movieCardView;
    const prevPopupView = this._popupView;

    this._movieCardView = new MovieCardView(this._movie, this._comments);

    this._movieCardView.setFilmCardClickHandler(this._filmCardClickHandler);

    this._movieCardView.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieCardView.setHistoryClickHandler(this._handleHistoryClick);
    this._movieCardView.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevMovieView === null) {
      this._renderMovieCard();
      return;
    }

    while (this._container.contains(prevMovieView.getElement())) {
      replace(this._movieCardView, prevMovieView);
    }

    if (prevPopupView !== null && document.body.contains(prevPopupView.getElement())) {
      replace(this._popupView, prevPopupView);
      remove(prevPopupView);
      this._closePopup();
      this._showPopup();
    }

    remove(prevMovieView);
  }

  // получение списка комментариев
  _getComments() {
    return this._commentsModel.getComments();
  }

  // удаление карточки
  destroy() {
    remove(this._movieCardView);
    remove(this._popupView);
  }

  // обработчик клика на карточку фильма
  _filmCardClickHandler() {
    this._showPopup();
  }

  // рендер одной карточки фильма
  _renderMovieCard() {
    render(this._container, this._movieCardView, RenderPosition.BEFORE_END);
  }

  // показ попапа
  _showPopup() {
    document.body.classList.add(`hide-overflow`);

    this._popupView = new PopupView(this._movie, this._comments);

    this._popupView.setClickClosePopupHandler(this._closePopupHandler);
    this._popupView.setEscPressClosePopupHandler(this._closePopupHandler);

    this._popupView.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupView.setHistoryClickHandler(this._handleHistoryClick);
    this._popupView.setFavoriteClickHandler(this._handleFavoriteClick);

    this._popupView.setDeleteClickHandler(this._handleDeleteClick);
    this._popupView.setFormSubmitHandler(this._handleAddComment);

    render(document.body, this._popupView.getElement(), RenderPosition.BEFORE_END);

    this._commentsModel.addObserver(this._handleCommentsModelEvent);
  }

  // скрытие попапа
  _closePopup() {
    document.body.classList.remove(`hide-overflow`);
    this._popupView.reset(this._movie, this._comments);
    this._commentsModel.removeObserver(this._handleCommentsModelEvent);
    remove(this._popupView);
  }

  // обработчик закрытия попапа
  _closePopupHandler() {
    this._closePopup();
  }

  // изменения состояния "add to watchlist"
  _changeWatchlistStatus() {
    this._changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        Object.assign({}, this._movie, {isToWatch: !this._movie.isToWatch}));
  }

  // изменения состояния "Mark as watched"
  _changeHistoryStatus() {
    this._changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        Object.assign({}, this._movie, {isAlreadyWatched: !this._movie.isAlreadyWatched}));
  }

  // изменение состояния "Mark as favorite"
  _changeFavoriteStatus() {
    this._changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        Object.assign({}, this._movie, {isInFavorites: !this._movie.isInFavorites}));
  }

  // обработчик нажатия на кнопку "Add to watchlist"
  _handleWatchlistClick() {
    this._changeWatchlistStatus();
  }

  // обработчик нажатия на кнопку "Mark as watched"
  _handleHistoryClick() {
    this._changeHistoryStatus();
  }

  // обработчик нажатия на кнопку "Mark as favorite"
  _handleFavoriteClick() {
    this._changeFavoriteStatus();
  }


  // обработчик удаления комментария
  _handleDeleteClick(deletedCommentId) {
    const deletedComment = this._comments.find((comment) => comment.id === parseInt(deletedCommentId, 10));
    this._handleCommentsViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, deletedComment)
    );
  }

  // обработчик добавления комментария
  _handleAddComment(newComment) {
    this._handleCommentsViewAction(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, newComment)
    );
  }

  // обработчик изменения представления
  _handleCommentsViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
    }
  }

  // обработчик изменения модели комментариев
  _handleCommentsModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._closePopup();
        this.init(this._movie);
        this._showPopup();
        break;
    }
  }
}
