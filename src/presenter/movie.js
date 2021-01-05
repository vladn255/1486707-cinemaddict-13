import {RenderPosition, render, replace, remove} from "../utils/render.js";

import MovieCardView from "../view/movie-card.js";
import PopupView from "../view/popup.js";

export default class Movie {
  constructor(container, changeData) {
    this._container = container;

    this._changeData = changeData;

    this._movieCardView = null;
    this._newPopupView = null;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._commentsList = movie.comments;
    const prevMovieView = this._movieCardView;
    const prevPopupView = this._newPopupView;

    this._movieCardView = new MovieCardView(movie);
    this._newPopupView = new PopupView(movie, this._commentsComponent);

    this._movieCardView.setFilmCardClickHandler(this._filmCardClickHandler);

    this._movieCardView.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieCardView.setHistoryClickHandler(this._handleHistoryClick);
    this._movieCardView.setFavoriteClickHandler(this._handleFavoriteClick);

    this._newPopupView.setClickClosePopupHandler(this._closePopupHandler);
    this._newPopupView.setEscPressClosePopupHandler(this._closePopupHandler);

    this._newPopupView.setWatchlistClickHandler(this._handleWatchlistClick);
    this._newPopupView.setHistoryClickHandler(this._handleHistoryClick);
    this._newPopupView.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevMovieView === null) {
      this._renderMovieCard();
      return;
    }

    while (this._container.contains(prevMovieView.getElement())) {
      replace(this._movieCardView, prevMovieView);
    }

    if (prevPopupView !== null && document.body.contains(prevPopupView.getElement())) {
      replace(this._newPopupView, prevPopupView);
      remove(prevPopupView);
      this._closePopup();
      this._showPopup();
    }

    remove(prevMovieView);

  }

  // удаление карточки
  destroy() {
    remove(this._movieCardView);
    remove(this._newPopupView);
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
    document.body.appendChild(this._newPopupView.getElement());
  }

  // скрытие попапа
  _closePopup() {
    document.body.classList.remove(`hide-overflow`);
    this._newPopupView.reset(this._movie);
    this._newPopupView.getElement().remove();
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
