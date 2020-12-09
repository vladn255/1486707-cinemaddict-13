import {getRandomInteger} from "./utils.js";

import {createProfileTemplate} from "./view/user-rank.js";
import {createNavMenuTemplate} from "./view/filters.js";
import {createSortMenuTemplate} from "./view/sort-menu.js";
import {createShowMoreButton} from "./view/show-more.js";
import {createFilmArticle} from "./view/movie-card.js";
import {createFilmsListTemplate} from "./view/films-list";
import {createFilmsSectionTemplate} from "./view/films-wrapper.js";
import {createFilmsStatistics} from "./view/footer-stats.js";
import {createPopUpTemplate} from "./view/popup.js";
// import {createUserStatsTemplate} from "./view/stats.js";
import {createCommentTemplate} from "./view/comments.js";

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
const RenderPosition = {
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

const films = new Array(FILMS_MOCK_COUNT).fill().map(generateFilmCard);
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


// рендер header'a (меню навигации)
render(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFORE_END);

// рендер меню навигации
render(siteMainElement, createNavMenuTemplate(filters), RenderPosition.BEFORE_END);

// рендер меню фильтров
render(siteMainElement, createSortMenuTemplate(), RenderPosition.BEFORE_END);

// рендер контейнера для списков фильмов
render(siteMainElement, createFilmsSectionTemplate(), RenderPosition.BEFORE_END);
const filmsElement = siteMainElement.querySelector(`.films`);

// рендер основого списка фильмов (CARDS_MAIN_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(ListTypes.ALL_MOVIES), RenderPosition.BEFORE_END);
const filmsListSection = siteMainElement.querySelector(`.films-list`);
const filmsListContainer = filmsListSection.querySelector(`.films-list__container`);
for (let i = 0; i < Math.min(films.length, CARDS_MAIN_QUANTITY); i++) {
  render(filmsListContainer, createFilmArticle(films[i]), RenderPosition.BEFORE_END);
}

// рендер списка фильмов с высоким рейтингом (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(ListTypes.TOP_RATED), RenderPosition.BEFORE_END);
const filmsTopRatedContainer = siteMainElement.querySelector(`.films-list:nth-child(2) .films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsTopRatedContainer, createFilmArticle(films[i]), RenderPosition.BEFORE_END);
}

// рендер списка самых комментируемых фильмов (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(ListTypes.MOST_COMMENTED), RenderPosition.BEFORE_END);
const filmsMostCommentedContainer = siteMainElement.querySelector(`.films-list:nth-child(3) .films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsMostCommentedContainer, createFilmArticle(films[i]), RenderPosition.BEFORE_END);
}

// рендер кнопки show more
if (films.length > CARDS_MAIN_QUANTITY) {
  let renderedFilmsCount = CARDS_MAIN_QUANTITY;

  const filmsListElement = filmsElement.querySelector(`.films-list`);
  render(filmsListElement, createShowMoreButton(), RenderPosition.BEFORE_END);
  const showMoreButton = filmsElement.querySelector(`.films-list__show-more`);

  const onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    films
    .slice(renderedFilmsCount, renderedFilmsCount + CARDS_MAIN_QUANTITY)
    .forEach((film) => {
      render(filmsListContainer, createFilmArticle(film), RenderPosition.BEFORE_END);
    });

    renderedFilmsCount += CARDS_MAIN_QUANTITY;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener(`click`, onShowMoreButtonClick);
}

// // рендер статистики пользователя в main
// render(siteMainElement, createUserStatsTemplate(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsStatistics(getRandomInteger(1, 100000)), RenderPosition.BEFORE_END);

// рендер попапа с подробной информацией о фильме c комментариями (COMMENTS_QUANTITY штук)
render(siteFooterElement, createPopUpTemplate(films[0]), RenderPosition.AFTER_END);
const commentsListContainer = document.querySelector(`.film-details__comments-list`);
for (let i = 0; i < COMMENTS_QUANTITY; i++) {
  render(commentsListContainer, createCommentTemplate(generateComment()), RenderPosition.BEFORE_END);
}

