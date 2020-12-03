import {getRandomInteger} from "./utils.js";

import {createProfileTemplate} from "./view/user-rank.js";
import {createNavMenuTemplate} from "./view/filters.js";
import {createSortMenuTemplate} from "./view/sort-menu.js";
import {createShowMoreButton} from "./view/show-more.js";
import {createFilmArticle} from "./view/movie-card.js";
import {createFilmsListTemplate} from "./view/films-list";
import {createFilmsSectionTemplate} from "./view/films-wrapper.js";
import {createFilmsStatistics} from "./view/footer-stats.js";
// import {createPopUpTemplate} from "./view/popup.js";
// import {createUserStatsTemplate} from "./view/stats.js";
// import {createCommentTemplate} from "./view/comments.js";

import {generateFilmCard} from "./mock/film-data.js";
// import {generateComment} from "./mock/comment.js";
import {generateFilters} from "./mock/filters.js";

const CARDS_MAIN_QUANTITY = 5;
const CARDS_EXTRA_QUANTITY = 2;
const FILMS_MOCK_COUNT = 20;
// const COMMENTS_QUANTITY = 3;

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
render(filmsElement, createFilmsListTemplate(`All movies. Upcoming`), RenderPosition.BEFORE_END);
const filmsListSection = siteMainElement.querySelector(`.films-list`);
const filmsListContainer = filmsListSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_MAIN_QUANTITY; i++) {
  render(filmsListContainer, createFilmArticle(films[i]), RenderPosition.BEFORE_END);
}

// рендер списка фильмов с высоким рейтингом (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(`Top rated`, `films-list--extra`), RenderPosition.BEFORE_END);
const filmsExtraSection = siteMainElement.querySelector(`.films-list--extra`);
const filmsExtraContainer = filmsExtraSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsExtraContainer, createFilmArticle(films[i]), RenderPosition.BEFORE_END);
}

// рендер списка самых комментируемых фильмов (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(`Most commented`, `films-list--extra`), RenderPosition.BEFORE_END);
const filmsMostCommentedSection = siteMainElement.querySelectorAll(`.films-list--extra`)[1];
const filmsMostCommentedContainer = filmsMostCommentedSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsMostCommentedContainer, createFilmArticle(films[i]), RenderPosition.BEFORE_END);
}

// рендер кнопки show more
const filmsListElement = filmsElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreButton(), RenderPosition.BEFORE_END);

// // рендер статистики пользователя в main
// render(siteMainElement, createUserStatsTemplate(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsStatistics(getRandomInteger(1, 100000)), RenderPosition.BEFORE_END);

// // рендер попапа с подробной информацией о фильме c комментариями (COMMENTS_QUANTITY штук)
// render(siteFooterElement, createPopUpTemplate(films[0]), RenderPosition.AFTER_END);
// const commentsListContainer = document.querySelector(`.film-details__comments-list`);
// for (let i = 0; i < COMMENTS_QUANTITY; i++) {
//   render(commentsListContainer, createCommentTemplate(generateComment()), RenderPosition.BEFORE_END);
// }

