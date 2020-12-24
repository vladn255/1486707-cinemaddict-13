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
  constructor(filmsNumber) {
    this._filmsWrapper = new FilmsWrapperView();
    this._showMoreButtonItem = new ShowMoreButtonView();
    this._sortMenu = new SortMenuView();
    this._filmsElement = null;
    this._generateComment = generateComment;
    this._newPopupItem = null;
    this._filmsNumber = filmsNumber;
    this._renderedFilmsCount = MoviesListData.CARDS_MAIN_QUANTITY;
    this._ShowMoreButtonClickHandler = this._ShowMoreButtonClickHandler.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._moviePresenter = {};
    this._moviesList = [];
    this._filmsContainerList = [];
    this._currentSortButton = SortType.DEFAULT;
  }

  init(container, films) {
    this._container = container;
    this._films = films.slice();
    this._sourceFilms = films.slice();

    this._renderSortMenu();
    this._renderContainer();
    this._renderMoviesLists();
    this._renderShowMoreButton();
  }

  // рендер контейнера для списков фильмов
  _renderContainer() {
    render(this._container, this._filmsWrapper, RenderPosition.BEFORE_END);
    this._filmsElement = this._container.querySelector(`.films`);
  }

  // рендер списка карточек фильма
  _renderMovieCards(container, filmsList, cardsCount) {
    for (let i = 0; i < Math.min(filmsList.length, cardsCount); i++) {
      const moviePresenter = new MoviePresenter(container, generateComment, this._handleMovieChange);
      moviePresenter.init(filmsList[i]);
      this._moviePresenter[filmsList[i].id] = moviePresenter;
    }
    this._moviesList.push(this._moviePresenter);
    this._moviePresenter = {};
  }

  // рендер произвольного списка фильмов
  _renderFilmsList(type, filmsList, cardsCount, place) {
    const flimsListItem = new FilmsListView(type);
    render(this._filmsElement, new FilmsListView(type), RenderPosition.BEFORE_END);
    const filmsListContainer = this._container.querySelector(`.films-list:nth-child(${place}) .films-list__container`);

    this._renderMovieCards(filmsListContainer, filmsList, cardsCount);
    this._filmsContainerList.push(flimsListItem);
  }

  // отрисовка списков фильмов
  _renderMoviesLists() {
    if (this._filmsNumber === 0) {
      this._renderFilmsList(ListTypes.EMPTY_LIST, this._films, MoviesListData.CARDS_EMPTY_QUANTITY, 1);
    } else {
      this._renderFilmsList(ListTypes.ALL_MOVIES, this._films, MoviesListData.CARDS_MAIN_QUANTITY, 1);
      this._renderFilmsList(ListTypes.TOP_RATED, this._films, MoviesListData.CARDS_EXTRA_QUANTITY, 2);
      this._renderFilmsList(ListTypes.MOST_COMMENTED, this._films, MoviesListData.CARDS_EXTRA_QUANTITY, 3);
    }
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
      presenter[updatedMovie.id].init(updatedMovie);
    });
  }

  // рендер кнопки show more
  _renderShowMoreButton() {
    if (this._films.length > MoviesListData.CARDS_MAIN_QUANTITY & this._filmsNumber !== 0) {

      const filmsListElement = this._filmsElement.querySelector(`.films-list`);
      render(filmsListElement, this._showMoreButtonItem, RenderPosition.BEFORE_END);

      this._showMoreButtonItem.setShowMoreButtonClickHandler(this._ShowMoreButtonClickHandler);
    }
  }

  // обработчик события нажатия на кнопку show more
  _ShowMoreButtonClickHandler() {
    this._renderMovieCards(
        this._container.querySelector(`.films-list:nth-child(1) .films-list__container`),
        this._films
      .slice(this._renderedFilmsCount, this._renderedFilmsCount + MoviesListData.CARDS_MAIN_QUANTITY),
        MoviesListData.CARDS_MAIN_QUANTITY);

    this._renderedFilmsCount += MoviesListData.CARDS_MAIN_QUANTITY;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonItem);
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

    this._sortMovies(sortButton);
    this._clearMoviesList();
    this._renderMoviesLists();
  }

  // рендер меню фильтров
  _renderSortMenu() {
    if (this._filmsNumber !== 0) {
      render(this._container, this._sortMenu, RenderPosition.BEFORE_END);
      this._sortMenu.setSortTypeChangeHandler(this._handleSortTypeChange);
    }
  }

}
