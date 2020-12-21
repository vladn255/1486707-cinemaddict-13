import {RenderPosition, render, remove} from "../utils/render.js";
import {updateItem} from "../utils/common.js";

import ShowMoreButton from "../view/show-more.js";
import FilmsList from "../view/films-list";
import FilmsWrapper from "../view/films-wrapper.js";
import Movie from "./movie.js";
import {generateComment} from "../mock/comment.js";

const CARDS_MAIN_QUANTITY = 5;
const CARDS_EXTRA_QUANTITY = 2;

const CARDS_EMPTY_QUANTITY = 0;

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

const siteMainElement = document.querySelector(`.main`);


export default class MoviesList {
  constructor(filmsNumber) {
    this._filmsWrapper = new FilmsWrapper();
    this._showMoreButtonItem = new ShowMoreButton();
    this._filmsElement = null;
    this._generateComment = generateComment;
    this._newPopupItem = null;
    this._filmsNumber = filmsNumber;
    this._renderedFilmsCount = CARDS_MAIN_QUANTITY;
    this._ShowMoreButtonClickHandler = this._ShowMoreButtonClickHandler.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._moviePresenter = {};
  }

  init(films) {
    this._films = films;

    this._renderContainer();
    this._renderMoviesLists();
    this._renderShowMoreButton();
  }

  // рендер контейнера для списков фильмов
  _renderContainer() {
    render(siteMainElement, this._filmsWrapper, RenderPosition.BEFORE_END);
    this._filmsElement = siteMainElement.querySelector(`.films`);
  }

  // рендер списка карточек фильма
  _renderMovieCards(container, filmsList, cardsCount) {
    for (let i = 0; i < Math.min(filmsList.length, cardsCount); i++) {
      const moviePresenter = new Movie(container, generateComment, this._handleMovieChange);
      moviePresenter.init(filmsList[i]);
      this._moviePresenter[filmsList[i].id] = moviePresenter;
    }
  }

  // рендер произвольного списка фильмов
  _renderFilmsList(type, filmsList, cardsCount, place) {
    render(this._filmsElement, new FilmsList(type), RenderPosition.BEFORE_END);
    const filmsListContainer = siteMainElement.querySelector(`.films-list:nth-child(${place}) .films-list__container`);

    this._renderMovieCards(filmsListContainer, filmsList, cardsCount);
  }

  // отрисовка списков фильмов
  _renderMoviesLists() {
    if (this._filmsNumber === 0) {
      this._renderFilmsList(ListTypes.EMPTY_LIST, this._films, CARDS_EMPTY_QUANTITY, 1);
    } else {
      this._renderFilmsList(ListTypes.ALL_MOVIES, this._films, CARDS_MAIN_QUANTITY, 1);
      this._renderFilmsList(ListTypes.TOP_RATED, this._films, CARDS_EXTRA_QUANTITY, 2);
      this._renderFilmsList(ListTypes.MOST_COMMENTED, this._films, CARDS_EXTRA_QUANTITY, 3);
    }
  }

  // очистка списка фильмов
  _clearMoviesList() {
    Object
    .values(this._moviePresenter)
    .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderedFilmsCount = CARDS_MAIN_QUANTITY;
    remove(this._showMoreButtonItem);
  }

  // обработчик изменения фильма
  _handleMovieChange(updatedMovie) {
    this._films = updateItem(this._films, updatedMovie);

    this._moviePresenter[updatedMovie.id].init(updatedMovie);
  }

  // рендер кнопки show more
  _renderShowMoreButton() {
    if (this._films.length > CARDS_MAIN_QUANTITY & this._filmsNumber !== 0) {

      const filmsListElement = this._filmsElement.querySelector(`.films-list`);
      render(filmsListElement, this._showMoreButtonItem, RenderPosition.BEFORE_END);

      this._showMoreButtonItem.setShowMoreButtonClickHandler(this._ShowMoreButtonClickHandler);
    }
  }

  // обработчик события нажатия на кнопку show more
  _ShowMoreButtonClickHandler() {
    this._renderMovieCards(
        siteMainElement.querySelector(`.films-list:nth-child(1) .films-list__container`),
        this._films
      .slice(this._renderedFilmsCount, this._renderedFilmsCount + CARDS_MAIN_QUANTITY),
        CARDS_MAIN_QUANTITY);

    this._renderedFilmsCount += CARDS_MAIN_QUANTITY;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonItem);
    }
  }
}
