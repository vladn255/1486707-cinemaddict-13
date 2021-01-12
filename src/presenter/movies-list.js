import {RenderPosition, render, remove} from "../utils/render.js";
import {sortByRate} from "../utils/common.js";
import {MoviesListData, SortType, UpdateType, UserAction} from "../utils/const.js";
import {sortByDate} from "../utils/date-time.js";
import {filter} from "../utils/filter.js";

import ShowMoreButtonView from "../view/show-more.js";
import FilmsListView from "../view/films-list";
import FilmsWrapperView from "../view/films-wrapper.js";
import MoviePresenter from "./movie.js";
import SortMenuView from "../view/sort-menu.js";

import {generateComment} from "../mock/comment.js";


const ListTypes = {
  ALL_MOVIES: {
    title: `All movies. Upcoming`,
    isHidden: true,
    isExtra: false
  },
  TOP_RATED: {
    title: `Top rated`,
    isHidden: false,
    isExtra: true
  },
  MOST_COMMENTED: {
    title: `Most commented`,
    isHidden: false,
    isExtra: true
  },
  EMPTY_LIST: {
    title: `There are no movies in our database`,
    isHidden: false,
    isExtra: false
  }
};

const COMMENTS_QUANTITY = 3;

export default class MoviesList {
  constructor(container, moviesModel, filterModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._filmsWrapperComponent = new FilmsWrapperView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._sortMenuComponent = new SortMenuView();
    this._generateComment = generateComment;
    this._renderedMoviesCount = MoviesListData.CARDS_MAIN_QUANTITY;
    this._currentSortButton = SortType.DEFAULT;
    this._commentsCount = COMMENTS_QUANTITY;

    this._filmsElement = null;
    this._newPopupItem = null;
    this._allMoviesContainer = null;
    this._topRatedContainer = null;
    this._mostCommentedContainer = null;
    this._moviePresenter = {};
    this._moviesList = [];
    this._filmsContainerList = [];
    this._comments = [];

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    if (this._moviesModel.getMovies().length) {
      this._renderSortMenu();
    }

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
        return filtredMovies.sort(sortByDate);
      case SortType.BY_RATE:
        return filtredMovies.sort(sortByRate);
    }
    return filtredMovies;
  }

  // рендер контейнера для списков фильмов
  _renderContainer() {
    render(this._container, this._filmsWrapperComponent, RenderPosition.BEFORE_END);
    this._filmsElement = this._container.querySelector(`.films`);
  }

  // рендер карточки фильма
  _renderMovieCard(container, film) {
    const comments = [];
    for (let j = 0; j < this._commentsCount; j++) {
      comments.push(this._generateComment());
    }
    film.comments = comments;
    const moviePresenter = new MoviePresenter(container, this._handleViewAction);
    moviePresenter.init(film);
    this._moviePresenter[film.id] = moviePresenter;
  }

  // рендер списка карточек фильма
  _renderMovieCards(container, filmsList, cardsCount) {
    for (let i = 0; i < Math.min(filmsList.length, cardsCount); i++) {
      this._renderMovieCard(container, filmsList[i]);
    }
    this._moviesList.push(this._moviePresenter);
    this._moviePresenter = {};
  }

  // рендер пустого списка - заглушки
  _renderEmptyList() {
    const flimsListComponent = new FilmsListView(ListTypes.EMPTY_LIST);
    this._filmsContainerList.push(flimsListComponent);

    render(this._filmsElement, flimsListComponent, RenderPosition.BEFORE_END);
  }

  // рендер основного списка фильмов "All Movies"
  _renderAllMoviesList() {
    const flimsListComponent = new FilmsListView(ListTypes.ALL_MOVIES);
    this._allMoviesContainer = flimsListComponent.getElement();
    this._filmsContainerList.push(flimsListComponent);

    this._renderMovieCards(this._allMoviesContainer.querySelector(`.films-list__container`), this._getMovies(), this._renderedMoviesCount);

    render(this._filmsElement, flimsListComponent, RenderPosition.BEFORE_END);

    if (this._getMovies().length > MoviesListData.CARDS_MAIN_QUANTITY) {
      this._renderShowMoreButton();
    }
  }

  // рендер дополнительного списка фильмов "Top Rated"
  _renderTopRated() {
    const flimsListComponent = new FilmsListView(ListTypes.TOP_RATED);
    this._topRatedContainer = flimsListComponent.getElement();
    this._filmsContainerList.push(flimsListComponent);

    this._renderMovieCards(this._topRatedContainer.querySelector(`.films-list__container`), this._getMovies(), MoviesListData.CARDS_EXTRA_QUANTITY);

    render(this._filmsElement, flimsListComponent, RenderPosition.BEFORE_END);
  }

  // рендер дополнительного списка фильмов "Most Commented"
  _renderMostCommented() {
    const flimsListComponent = new FilmsListView(ListTypes.MOST_COMMENTED);
    this._mostCommentedContainer = flimsListComponent.getElement();
    this._filmsContainerList.push(flimsListComponent);

    this._renderMovieCards(this._mostCommentedContainer.querySelector(`.films-list__container`), this._getMovies(), MoviesListData.CARDS_EXTRA_QUANTITY);

    render(this._filmsElement, flimsListComponent, RenderPosition.BEFORE_END);
  }

  // рендер основного и дополнительных списков фильмов
  _renderMainMoviesLists() {
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

    this._filmsContainerList.forEach((filmContainer) => {
      remove(filmContainer);
    });
    this._filmsContainerList = [];
  }

  // обработчик изменения представления
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
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
  _handleSortTypeChange(sortButton) {
    if (this._currentSortButton === sortButton) {
      return;
    }

    this._sortMenuComponent.getElement().querySelector(`[data-sort-type=${this._currentSortButton}]`).classList.remove(`sort__button--active`);
    this._sortMenuComponent.getElement().querySelector(`[data-sort-type=${sortButton}]`).classList.add(`sort__button--active`);

    this._currentSortButton = sortButton;
    this._clearMoviesList();
    this._renderMoviesLists();
  }

  // рендер меню фильтров
  _renderSortMenu() {
    render(this._container, this._sortMenuComponent, RenderPosition.BEFORE_END);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // стирание контейнера фильмов
  _clearMoviesContainer(resetRenderedMoviesCount = false, resetSortType = false) {
    const moviesCount = this._getMovies().length;

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
