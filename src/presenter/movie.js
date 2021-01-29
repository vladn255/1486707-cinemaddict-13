import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType, State} from "../utils/const.js";

import MovieCardView from "../view/movie-card.js";
import PopupView from "../view/popup.js";

export default class Movie {
  constructor(container, changeData, commentsModel, api) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._api = api;

    this._changeData = changeData;

    this._movieCardView = null;
    this._popupView = null;
    this._isLoading = true;
    this._isDisabled = false;

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
    const prevMovieView = this._movieCardView;

    this._movieCardView = new MovieCardView(this._movie);

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

    remove(prevMovieView);
  }

  // удаление карточки
  destroy() {
    remove(this._movieCardView);
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
    const prevPopupView = this._popupView;

    if (prevPopupView !== null && document.body.contains(prevPopupView.getElement())) {
      remove(prevPopupView);
    }

    if (document.body.contains(document.querySelector(`.film-details`))) {
      document.querySelector(`.film-details`).remove();
    }

    document.body.classList.add(`hide-overflow`);

    this._comments = [];
    this._popupView = new PopupView(this._movie, this._comments, this._isLoading, this._isDisabled);

    this._popupView.setClickClosePopupHandler(this._closePopupHandler);
    this._popupView.setEscPressClosePopupHandler(this._closePopupHandler);

    render(document.body, this._popupView.getElement(), RenderPosition.BEFORE_END);

    this._commentsModel.addObserver(this._handleCommentsModelEvent);

    this._api.getComments(this._movie.id).then((commentsList) => {
      this._commentsModel.setComments(UpdateType.INIT, commentsList);
    })
    .catch(() => {
      this._commentsModel.setComments(UpdateType.INIT, []);
    });

    this._popupView.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupView.setHistoryClickHandler(this._handleHistoryClick);
    this._popupView.setFavoriteClickHandler(this._handleFavoriteClick);

    this._popupView.setDeleteClickHandler(this._handleDeleteClick);
    this._popupView.setFormSubmitHandler(this._handleAddComment);
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
    this._handleCommentsViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.INIT,
        deletedCommentId
    );
  }

  // обработчик добавления комментария
  _handleAddComment(newComment) {
    if (newComment.emoji && newComment.text) {
      this._handleCommentsViewAction(
          UserAction.ADD_COMMENT,
          UpdateType.INIT,
          Object.assign({}, newComment)
      );

    }
  }

  // обработчик изменения представления
  _handleCommentsViewAction(actionType, updateType, update) {
    switch (actionType) {

      case UserAction.DELETE_COMMENT:
        this._setViewState(State.DELETING, update);

        this._api.deleteComment(update.toString(10))
        .then(() => {
          this._commentsModel.deleteComment(updateType, update.toString(10));
        }).catch(() => {
          this._setViewState(State.ABORTING_DELETING, update);
        });
        break;

      case UserAction.ADD_COMMENT:
        this._setViewState(State.SAVING);
        this._api.addComment(this._movie, update)
        .then(() => {
          this._api.getComments(this._movie.id)
          .then((commentsList) => {
            this._movie.comments = commentsList;
            this._commentsModel.addComment(updateType, this._movie.comments);
            this._popupView.updateData({
              commentEmoji: null,
              newComment: null
            });
          });
        }).catch(() => {
          this._setViewState(State.ABORTING_SAVING);
        });
        break;
    }
  }

  // обработчик изменения модели комментариев
  _handleCommentsModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._movie.comments = this._commentsModel.getComments();
        this.init(this._movie);
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        this._movie.comments = this._commentsModel.getComments();
        this.init(this._movie);
        this._popupView.updateData({
          comments: this._movie.comments,
          isLoading: this._isLoading,
          isDisabled: false
        });
        break;
    }
  }

  // установка состояний deleting... и блокировки формы
  _setViewState(state, updateId) {
    const abortSaving = () => {
      this._popupView.updateData({
        isDisabled: false
      });
    };

    const abortDeleting = () => {
      this._commentsModel.switchDeletingStatus(UpdateType.PATCH, updateId, false);
      this._movie.comments = this._commentsModel.getComments();
      this._popupView.updateData({
        comments: this._movie.comments,
      });
    };

    switch (state) {
      case State.SAVING:
        this._popupView.updateData({
          isDisabled: true
        });
        break;

      case State.DELETING:
        this._commentsModel.switchDeletingStatus(UpdateType.PATCH, updateId, true);
        this._movie.comments = this._commentsModel.getComments();
        this._popupView.updateData({
          comments: this._movie.comments,
        });
        break;

      case State.ABORTING_SAVING:
        this._popupView.shake(abortSaving);
        break;

      case State.ABORTING_DELETING:
        this._popupView.shake(abortDeleting);
        break;
    }
  }
}
