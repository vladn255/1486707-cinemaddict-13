import {getRandomInteger, RenderPosition, render, KeyBindings} from "./utils.js";

import UserRank from "./view/user-rank.js";
import Filters from "./view/filters.js";
import SortMenu from "./view/sort-menu.js";
import ShowMoreButton from "./view/show-more.js";
import MovieCard from "./view/movie-card.js";
import FilmsList from "./view/films-list";
import FilmsWrapper from "./view/films-wrapper.js";
import FooterStats from "./view/footer-stats.js";
import Popup from "./view/popup.js";
// import Stats from "./view/stats.js";
import Comment from "./view/comments.js";
import EmptyList from "./view/empty-list.js";

import {generateFilmCard} from "./mock/film-data.js";
import {generateComment} from "./mock/comment.js";
import {generateFilters} from "./mock/filters.js";

const CARDS_MAIN_QUANTITY = 5;
const CARDS_EXTRA_QUANTITY = 2;
const FILMS_MOCK_COUNT = 17;
const COMMENTS_QUANTITY = 3;

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
  }
};

const films = new Array(FILMS_MOCK_COUNT).fill().map(generateFilmCard);
const filters = generateFilters(films);
const filmsNumber = getRandomInteger(0, 100000);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// показ попапа
const showPopup = (film, count) => {
  document.querySelector(`body`).classList.add(`hide-overflow`);

  const newPopupItem = new Popup(film).getElement();
  siteFooterElement.appendChild(newPopupItem);
  const commentsListContainer = newPopupItem.querySelector(`.film-details__comments-list`);

  for (let j = 0; j < count; j++) {
    render(commentsListContainer, new Comment(generateComment()).getElement(), RenderPosition.BEFORE_END);
  }

  // обработчик клика на иконку "закрыть" в попапе
  const onClosePopupClick = () => {
    return closePopup(newPopupItem);
  };

  // обработчик нажатия на Esc в попапе
  const onClosePopupEscDown = (evt) => {
    evt.preventDefault();
    if (evt.key === KeyBindings.KEY_ESCAPE) {
      closePopup(newPopupItem);
      document.removeEventListener(`keydown`, onClosePopupEscDown);
    }
    return ``;
  };

  newPopupItem.querySelector(`.film-details__close-btn`).addEventListener(`click`, onClosePopupClick);
  document.addEventListener(`keydown`, onClosePopupEscDown);
};

// скрытие попапа
const closePopup = (item) => {
  document.querySelector(`body`).classList.remove(`hide-overflow`);
  siteFooterElement.removeChild(item);
};

// рендер карточки фильма
const renderMovieCards = (container, filmsList, cardsCount, commentsCount) => {
  for (let i = 0; i < Math.min(filmsList.length, cardsCount); i++) {
    const newMovieItem = new MovieCard(filmsList[i]).getElement();
    render(container, newMovieItem, RenderPosition.BEFORE_END);

    // обработчик клика на карточку фильма
    const onFilmCardClick = () => {
      return showPopup(filmsList[i], commentsCount);
    };

    newMovieItem.querySelector(`.film-card__title`).addEventListener(`click`, onFilmCardClick);
    newMovieItem.querySelector(`.film-card__poster`).addEventListener(`click`, onFilmCardClick);
    newMovieItem.querySelector(`.film-card__comments`).addEventListener(`click`, onFilmCardClick);
  }
};

// рендер произвольного списка фильмов
const renderFilmsList = (type, filmsList, cardsCount, place) => {
  render(filmsElement, new FilmsList(type).getElement(), RenderPosition.BEFORE_END);
  const filmsListContainer = siteMainElement.querySelector(`.films-list:nth-child(${place}) .films-list__container`);

  renderMovieCards(filmsListContainer, filmsList, cardsCount, COMMENTS_QUANTITY);
};

// рендер header'a (меню навигации)
render(siteHeaderElement, new UserRank().getElement(), RenderPosition.BEFORE_END);

// рендер меню навигации
render(siteMainElement, new Filters(filters).getElement(), RenderPosition.BEFORE_END);

// рендер меню фильтров
if (filmsNumber !== 0) {
  render(siteMainElement, new SortMenu().getElement(), RenderPosition.BEFORE_END);
}

// рендер контейнера для списков фильмов
render(siteMainElement, new FilmsWrapper().getElement(), RenderPosition.BEFORE_END);
const filmsElement = siteMainElement.querySelector(`.films`);

// отрисовка списков фильмов
if (filmsNumber === 0) {
  render(filmsElement, new EmptyList().getElement(), RenderPosition.BEFORE_END);
} else {
  renderFilmsList(ListTypes.ALL_MOVIES, films, CARDS_MAIN_QUANTITY, 1);
  renderFilmsList(ListTypes.TOP_RATED, films, CARDS_EXTRA_QUANTITY, 2);
  renderFilmsList(ListTypes.MOST_COMMENTED, films, CARDS_EXTRA_QUANTITY, 3);
}

// рендер кнопки show more
if (films.length > CARDS_MAIN_QUANTITY & filmsNumber !== 0) {
  let renderedFilmsCount = CARDS_MAIN_QUANTITY;

  const filmsListElement = filmsElement.querySelector(`.films-list`);
  render(filmsListElement, new ShowMoreButton().getElement(), RenderPosition.BEFORE_END);
  const showMoreButton = filmsElement.querySelector(`.films-list__show-more`);

  // обработчик события нажатия на кнопку show more
  const onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    films
    .slice(renderedFilmsCount, renderedFilmsCount + CARDS_MAIN_QUANTITY)
    .forEach((film) => {
      render(filmsListElement.querySelector(`.films-list__container`), new MovieCard(film).getElement(), RenderPosition.BEFORE_END);
    });

    renderedFilmsCount += CARDS_MAIN_QUANTITY;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener(`click`, onShowMoreButtonClick);
}


// // рендер статистики пользователя в main
// render(siteMainElement, new Stats().getElement(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStats(filmsNumber).getElement(), RenderPosition.BEFORE_END);

