import {RenderPosition, render, remove} from "../utils/render.js";
import {sortByRate, sortByCommentsCount} from "../utils/common.js";
import {MoviesListData, SortType, UpdateType, UserAction, ListTypes} from "../utils/const.js";
import {sortByDate} from "../utils/date-time.js";
import {filter} from "../utils/filter.js";

import ShowMoreButtonView from "../view/show-more.js";
import MoviesListView from "../view/movies-list";
import MoviesWrapperView from "../view/movies-wrapper.js";
import SortMenuView from "../view/sort-menu.js";

import MoviePresenter from "./movie.js";

export default class MoviesList {
  constructor(container, moviesModel, filterModel, commentsModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._renderedMoviesCount = MoviesListData.CARDS_MAIN_QUANTITY;
    this._currentSortButton = SortType.DEFAULT;

    this._moviesWrapperComponent = null;
    this._sortMenuComponent = null;
    this._showMoreButtonComponent = null;
    this._moviesElement = null;
    this._newPopupItem = null;
    this._allMoviesContainer = null;
    this._topRatedContainer = null;
    this._mostCommentedContainer = null;
    this._moviePresenter = {};
    this._moviesList = [];
    this._moviesContainerList = [];

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderContainer();
    this._renderMoviesLists();
  }

  // получение списка фильмов
  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortButton) {
      case SortType.BY_DATE:
        return filtredMovies.slice().sort(sortByDate);
      case SortType.BY_RATE:
        return filtredMovies.slice().sort(sortByRate);
    }

    return filtredMovies;
  }

  // рендер контейнера для списков фильмов
  _renderContainer() {
    if (this._moviesWrapperComponent) {
      remove(this._moviesWrapperComponent);
    }
    this._moviesWrapperComponent = new MoviesWrapperView();
    render(this._container, this._moviesWrapperComponent, RenderPosition.BEFORE_END);
    this._moviesElement = this._container.querySelector(`.films`);

  }

  // рендер карточки фильма
  _renderMovieCard(container, movie) {

    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._commentsModel);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  // рендер списка карточек фильма
  _renderMovieCards(container, moviesList, cardsCount) {
    moviesList.slice(0, cardsCount).forEach((movie) => this._renderMovieCard(container, movie));
    this._moviesList.push(this._moviePresenter);
    this._moviePresenter = {};
  }

  // рендер пустого списка - заглушки
  _renderEmptyList() {
    const moviesListComponent = new MoviesListView(ListTypes.EMPTY_LIST);
    this._moviesContainerList.push(moviesListComponent);

    render(this._moviesElement, moviesListComponent, RenderPosition.BEFORE_END);
  }

  // рендер основного списка фильмов "All Movies"
  _renderAllMoviesList() {
    const moviesListComponent = new MoviesListView(ListTypes.ALL_MOVIES);
    this._allMoviesContainer = moviesListComponent.getElement();
    this._moviesContainerList.push(moviesListComponent);

    this._renderMovieCards(this._allMoviesContainer.querySelector(`.films-list__container`), this._getMovies(), this._renderedMoviesCount);

    render(this._moviesElement, moviesListComponent, RenderPosition.BEFORE_END);

    if (this._getMovies().length > MoviesListData.CARDS_MAIN_QUANTITY) {
      this._renderShowMoreButton();
    }
  }

  // рендер дополнительного списка фильмов "Top Rated"
  _renderTopRated() {
    const moviesListComponent = new MoviesListView(ListTypes.TOP_RATED);
    this._topRatedContainer = moviesListComponent.getElement();
    this._moviesContainerList.push(moviesListComponent);
    const topRatedMoviesCount = Math.min(this._getMovies().length, MoviesListData.CARDS_EXTRA_QUANTITY);

    this._renderMovieCards(this._topRatedContainer.querySelector(`.films-list__container`), this._getMovies().slice().sort(sortByRate), topRatedMoviesCount);

    render(this._moviesElement, moviesListComponent, RenderPosition.BEFORE_END);
  }

  // рендер дополнительного списка фильмов "Most Commented"
  _renderMostCommented() {
    const moviesListComponent = new MoviesListView(ListTypes.MOST_COMMENTED);
    this._mostCommentedContainer = moviesListComponent.getElement();
    this._moviesContainerList.push(moviesListComponent);
    const mostCommentedCount = Math.min(this._getMovies().length, MoviesListData.CARDS_EXTRA_QUANTITY);

    this._renderMovieCards(this._mostCommentedContainer.querySelector(`.films-list__container`), this._getMovies().slice().sort(sortByCommentsCount), mostCommentedCount);

    render(this._moviesElement, moviesListComponent, RenderPosition.BEFORE_END);
  }

  // рендер основного и дополнительных списков фильмов
  _renderMainMoviesLists() {
    this._renderSortMenu();

    this._renderAllMoviesList();
    this._renderTopRated();
    this._renderMostCommented();
  }

  // отрисовка списков фильмов
  _renderMoviesLists() {
    return !this._getMovies().length
      ? this._renderEmptyList()
      : this._renderMainMoviesLists();
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

    this._moviesContainerList.forEach((movieContainer) => {
      remove(movieContainer);
    });
    this._moviesContainerList = [];
  }

  // обработчик изменения представления
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
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
        this._renderMainMoviesLists();
        break;

      case UpdateType.MAJOR:
        this._clearMoviesContainer(true, true);
        this._renderMainMoviesLists();
        break;
    }
  }

  // рендер кнопки show more
  _renderShowMoreButton() {
    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();

    render(this._allMoviesContainer, this._showMoreButtonComponent, RenderPosition.BEFORE_END);

    this._showMoreButtonComponent.setShowMoreButtonClickHandler(this._handleShowMoreButtonClick);

  }

  // обработчик события нажатия на кнопку show more
  _handleShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(moviesCount, this._renderedMoviesCount + MoviesListData.CARDS_MAIN_QUANTITY);
    const movies = this._getMovies().slice(this._renderedMoviesCount, this._renderedMoviesCount + MoviesListData.CARDS_MAIN_QUANTITY);

    this._renderMovieCards(
        this._allMoviesContainer.querySelector(`.films-list__container`),
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

    this._renderedMoviesCount = MoviesListData.CARDS_MAIN_QUANTITY;
    this._currentSortButton = sortType;
    this._clearMoviesList();
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
    const moviesCount = this._getMovies().length;

    remove(this._sortMenuComponent);
    this._clearMoviesList();

    if (resetRenderedMoviesCount) {
      this._renderedMoviesCount = MoviesListData.CARDS_MAIN_QUANTITY;
    } else {
      this._renderedMoviesCount = Math.min(moviesCount, this._renderedMoviesCount);
    }

    if (resetSortType) {
      this._currentSortButton = SortType.DEFAULT;
    }
  }


}
