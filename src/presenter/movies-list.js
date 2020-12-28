import {RenderPosition, render, remove} from "../utils/render.js";
import {updateItem, sortByRate} from "../utils/common.js";
import {SortType} from "../utils/const.js";
import {sortByDate} from "../utils/date-time.js";
import {MoviesListData} from "../utils/const.js";

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

export default class MoviesList {
  constructor(container) {
    this._container = container;
    this._filmsWrapperComponent = new FilmsWrapperView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._sortMenuComponent = new SortMenuView();
    this._generateComment = generateComment;
    this._renderedFilmsCount = MoviesListData.CARDS_MAIN_QUANTITY;
    this._currentSortButton = SortType.DEFAULT;

    this._filmsElement = null;
    this._newPopupItem = null;
    this._allMoviesContainer = null;
    this._topRatedContainer = null;
    this._mostCommentedContainer = null;
    this._moviePresenter = {};
    this._moviesList = [];
    this._filmsContainerList = [];

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourceFilms = films.slice();

    if (this._films.length) {
      this._renderSortMenu();
    }
    this._renderContainer();
    this._renderMoviesLists();
  }

  // рендер контейнера для списков фильмов
  _renderContainer() {
    render(this._container, this._filmsWrapperComponent, RenderPosition.BEFORE_END);
    this._filmsElement = this._container.querySelector(`.films`);
  }

  // рендер карточки фильма
  _renderMovieCard(container, film) {
    const moviePresenter = new MoviePresenter(container, generateComment, this._handleMovieChange);
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

    this._renderMovieCards(this._allMoviesContainer.querySelector(`.films-list__container`), this._films, MoviesListData.CARDS_MAIN_QUANTITY);

    render(this._filmsElement, flimsListComponent, RenderPosition.BEFORE_END);

    if (this._films.length > MoviesListData.CARDS_MAIN_QUANTITY) {
      this._renderShowMoreButton();
    }
  }

  // рендер дополнительного списка фильмов "Top Rated"
  _renderTopRated() {
    const flimsListComponent = new FilmsListView(ListTypes.TOP_RATED);
    this._topRatedContainer = flimsListComponent.getElement();
    this._filmsContainerList.push(flimsListComponent);

    this._renderMovieCards(this._topRatedContainer.querySelector(`.films-list__container`), this._films, MoviesListData.CARDS_EXTRA_QUANTITY);

    render(this._filmsElement, flimsListComponent, RenderPosition.BEFORE_END);
  }

  // рендер дополнительного списка фильмов "Most Commented"
  _renderMostCommented() {
    const flimsListComponent = new FilmsListView(ListTypes.MOST_COMMENTED);
    this._mostCommentedContainer = flimsListComponent.getElement();
    this._filmsContainerList.push(flimsListComponent);

    this._renderMovieCards(this._mostCommentedContainer.querySelector(`.films-list__container`), this._films, MoviesListData.CARDS_EXTRA_QUANTITY);

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
    return !this._films.length
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

  // обработчик изменения фильма
  _handleMovieChange(updatedMovie) {
    this._films = updateItem(this._films, updatedMovie);

    this._moviesList.forEach((presenter) => {
      if (presenter[updatedMovie.id]) {
        presenter[updatedMovie.id].init(updatedMovie);
      }
    });
  }

  // рендер кнопки show more
  _renderShowMoreButton() {
    render(this._allMoviesContainer, this._showMoreButtonComponent, RenderPosition.BEFORE_END);

    this._showMoreButtonComponent.setShowMoreButtonClickHandler(this._handleShowMoreButtonClick);

  }

  // обработчик события нажатия на кнопку show more
  _handleShowMoreButtonClick() {
    this._renderMovieCards(
        this._allMoviesContainer.querySelector(`.films-list__container`),
        this._films
      .slice(this._renderedFilmsCount, this._renderedFilmsCount + MoviesListData.CARDS_MAIN_QUANTITY),
        MoviesListData.CARDS_MAIN_QUANTITY);

    this._renderedFilmsCount += MoviesListData.CARDS_MAIN_QUANTITY;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  // сортировка фильмов по дате и рейтингу
  _sortMovies(sortButton) {
    switch (sortButton) {
      case SortType.BY_DATE:
        this._films.sort(sortByDate);
        break;
      case SortType.BY_RATE:
        this._films.sort(sortByRate);
        break;
      default:
        this._films = this._sourceFilms.slice();
    }
    this._currentSortButton = sortButton;
  }

  // обработчик нажатия на кнопку сортировки
  _handleSortTypeChange(sortButton) {
    if (this._currentSortButton === sortButton) {
      return;
    }

    this._sortMenuComponent.getElement().querySelector(`[data-sort-type=${this._currentSortButton}]`).classList.remove(`sort__button--active`);
    this._sortMenuComponent.getElement().querySelector(`[data-sort-type=${sortButton}]`).classList.add(`sort__button--active`);

    this._sortMovies(sortButton);
    this._clearMoviesList();
    this._renderMoviesLists();
  }

  // рендер меню фильтров
  _renderSortMenu() {
    render(this._container, this._sortMenuComponent, RenderPosition.BEFORE_END);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

}
