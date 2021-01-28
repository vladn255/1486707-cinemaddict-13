import {RenderPosition, render, remove} from "../utils/render.js";
import {sortByRate, sortByCommentsCount} from "../utils/common.js";
import {MoviesListData, SortType, UpdateType, UserAction, ListTypes} from "../utils/const.js";
import {sortByDate} from "../utils/date-time.js";
import {filter} from "../utils/filter.js";

import ShowMoreButtonView from "../view/show-more.js";
import MoviesListView from "../view/movies-list";
import MoviesWrapperView from "../view/movies-wrapper.js";
import SortMenuView from "../view/sort-menu.js";
import StatsView from "../view/stats.js";

import MoviePresenter from "./movie.js";

export default class MoviesList {
  constructor(container, moviesModel, filterModel, commentsModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._api = api;
    this._renderedMoviesCount = MoviesListData.CARDS_MAIN_QUANTITY;
    this._currentSortButton = SortType.DEFAULT;
    this._isLoading = true;

    this._moviesWrapperComponent = null;
    this._sortMenuComponent = null;
    this._showMoreButtonComponent = null;
    this._statsComponent = null;
    this._moviesElement = null;
    this._newPopupItem = null;
    this._allMoviesContainer = null;
    this._topRatedContainer = null;
    this._mostCommentedContainer = null;
    this._allMoviesListComponent = null;
    this._topRatedListComponent = null;
    this._topCommentedListComponent = null;
    this._loadingComponent = null;
    this._moviePresenter = {};
    this._moviesList = [];

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderContainer();
    this._renderMoviesLists();
  }

  // получение списка фильмов
  _getMovies(sortButton = this._currentSortButton) {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[filterType](movies);

    switch (sortButton) {
      case SortType.BY_DATE:
        return filtredMovies.slice().sort(sortByDate);
      case SortType.BY_RATE:
        return filtredMovies.slice().sort(sortByRate);
      case SortType.BY_COMMENTS:
        return filtredMovies.slice().sort(sortByCommentsCount);
    }

    return filtredMovies;
  }

  // рендер контейнера для списков фильмов
  _renderContainer() {
    if (this._moviesWrapperComponent !== null) {
      this._moviesWrapperComponent = null;
    }
    this._moviesWrapperComponent = new MoviesWrapperView();
    render(this._container, this._moviesWrapperComponent, RenderPosition.BEFORE_END);
    this._moviesElement = this._container.querySelector(`.films`);
  }

  // рендер карточки фильма
  _renderMovieCard(container, movie) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._commentsModel, this._api);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  // рендер списка карточек фильма
  _renderMovieCards(container, moviesList) {
    moviesList.forEach((movie) => this._renderMovieCard(container, movie));
    this._moviesList.push(this._moviePresenter);
    this._moviePresenter = {};
  }

  // рендер экрана загрузки
  _renderLoadingList() {
    this._loadingComponent = new MoviesListView(ListTypes.LOADING);
    render(this._moviesElement, this._loadingComponent, RenderPosition.BEFORE_END);
  }

  // рендер пустого списка - заглушки
  _renderEmptyList() {
    const moviesListComponent = new MoviesListView(ListTypes.EMPTY_LIST);

    render(this._moviesElement, moviesListComponent, RenderPosition.BEFORE_END);
  }

  // рендер основного списка фильмов "All Movies"
  _renderAllMoviesList() {
    this._allMoviesListComponent = new MoviesListView(ListTypes.ALL_MOVIES);
    this._allMoviesContainer = this._allMoviesListComponent.getElement().querySelector(`.films-list__container`);

    this._renderMovieCards(this._allMoviesContainer, this._getMovies().slice(0, this._renderedMoviesCount));

    render(this._moviesElement, this._allMoviesListComponent, RenderPosition.BEFORE_END);

    if (this._getMovies().length > MoviesListData.CARDS_MAIN_QUANTITY) {
      this._renderShowMoreButton();
    }
  }

  // рендер дополнительного списка фильмов "Top Rated"
  _renderTopRated() {
    this._topRatedListComponent = new MoviesListView(ListTypes.TOP_RATED);
    this._topRatedContainer = this._topRatedListComponent.getElement();
    const topRatedMoviesCount = Math.min(this._getMovies().length, MoviesListData.CARDS_EXTRA_QUANTITY);

    this._renderMovieCards(this._topRatedContainer.querySelector(`.films-list__container`), this._getMovies(SortType.BY_RATE).slice(0, topRatedMoviesCount));

    render(this._moviesElement, this._topRatedListComponent, RenderPosition.BEFORE_END);
  }

  // рендер дополнительного списка фильмов "Most Commented"
  _renderMostCommented() {
    this._topCommentedListComponent = new MoviesListView(ListTypes.MOST_COMMENTED);
    this._mostCommentedContainer = this._topCommentedListComponent.getElement();

    const mostCommentedCount = Math.min(this._getMovies().length, MoviesListData.CARDS_EXTRA_QUANTITY);

    this._renderMovieCards(this._mostCommentedContainer.querySelector(`.films-list__container`), this._getMovies(SortType.BY_COMMENTS).slice(0, mostCommentedCount));

    render(this._moviesElement, this._topCommentedListComponent, RenderPosition.BEFORE_END);
  }

  // рендер основного и дополнительных списков фильмов
  _renderMainMoviesLists() {
    this._renderSortMenu();

    this._renderAllMoviesList();
    this._renderTopRated();
    this._renderMostCommented();
  }

  // рендер загруженных фильмов
  _renderLoadedMovies() {
    return (this._getMovies().length === 0 || !this._getMovies())
      ? this._renderEmptyList()
      : this._renderMainMoviesLists();
  }

  // отрисовка списков фильмов
  _renderMoviesLists() {
    if (this._isLoading) {
      this._renderLoadingList();
      return;
    }
    this._renderLoadedMovies();
  }

  // очистка списка фильмов
  _clearMoviesList() {
    this._moviesList.forEach((presenter) => {
      Object
       .values(presenter)
       .forEach((presenterItem) => presenterItem.destroy());
      presenter = {};
    });
    this._moviesList = [];

    remove(this._allMoviesListComponent);
    remove(this._topRatedListComponent);
    remove(this._topCommentedListComponent);

    this._allMoviesListComponent = null;
    this._topRatedListComponent = null;
    this._topCommentedListComponent = null;
  }

  // обработчик изменения представления
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._api.updateMovie(update).then((response) => {
          this._moviesModel.updateMovie(updateType, response);
        });
        break;
    }
  }

  // обработчик изменения модели
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviesList.forEach((presenter) => {
          if (presenter[data.id]) {
            presenter[data.id].init(data);
          }
        });
        break;

      case UpdateType.MINOR:
        this._clearMoviesContainer();
        this._renderLoadedMovies();
        break;

      case UpdateType.MAJOR:
        this._clearMoviesContainer({resetRenderedMoviesCount: true, resetSortType: true});
        this._renderLoadedMovies();
        break;

      case UpdateType.STATS:
        this._clearMoviesContainer({resetSortType: true});
        this._statsComponent = new StatsView(this._moviesModel.getMovies());
        render(this._container, this._statsComponent, RenderPosition.BEFORE_END);
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderLoadedMovies();
    }
  }

  // рендер кнопки show more
  _renderShowMoreButton() {
    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();

    render(this._allMoviesListComponent, this._showMoreButtonComponent, RenderPosition.BEFORE_END);

    this._showMoreButtonComponent.setShowMoreButtonClickHandler(this._handleShowMoreButtonClick);

  }

  // обработчик события нажатия на кнопку show more
  _handleShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(moviesCount, this._renderedMoviesCount + MoviesListData.CARDS_MAIN_QUANTITY);
    const movies = this._getMovies().slice(this._renderedMoviesCount, this._renderedMoviesCount + MoviesListData.CARDS_MAIN_QUANTITY);

    this._renderMovieCards(
        this._allMoviesContainer,
        movies,
        MoviesListData.CARDS_MAIN_QUANTITY);

    this._renderedMoviesCount = newRenderedMoviesCount;

    if (this._renderedMoviesCount >= moviesCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  // обработчик нажатия на кнопку сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortButton === sortType) {
      return;
    }

    this._currentSortButton = sortType;
    this._clearMoviesContainer({resetRenderedMoviesCount: true});
    this._renderMoviesLists();
  }

  // рендер меню фильтров
  _renderSortMenu() {
    if (this._sortMenuComponent) {
      remove(this._sortMenuComponent);
    }
    this._sortMenuComponent = new SortMenuView(this._currentSortButton);

    render(this._moviesElement, this._sortMenuComponent, RenderPosition.BEFORE_END);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // стирание контейнера фильмов и сортировки
  _clearMoviesContainer({resetRenderedMoviesCount = false, resetSortType = false} = {}) {

    remove(this._sortMenuComponent);
    this._clearMoviesList();

    if (resetRenderedMoviesCount) {
      this._renderedMoviesCount = MoviesListData.CARDS_MAIN_QUANTITY;
    }

    if (resetSortType) {
      this._currentSortButton = SortType.DEFAULT;
    }

    if (this._statsComponent) {
      remove(this._statsComponent);
      this._statsComponent = null;
    }

    if (this._loadingComponent) {
      remove(this._loadingComponent);
      this._loadingComponent = null;
    }
  }


}
