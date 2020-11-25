import {createProfileTemplate} from "./view/user-rank.js";
import {createNavMenuTemplate, createSortMenuTemplate} from "./view/menu.js";
import {createShowMoreButton} from "./view/show-more.js";
import {createFilmArticle} from "./view/movie-card.js";
import {createFilmsSectionTemplate, createFilmsListTemplate} from "./view/films-list";
import {createPopUpTemplate} from "./view/popup.js";
import {createUserStatsTemplate, createFilmsStatistics} from "./view/stats.js";

const CARDS_MAIN_QUANTITY = 5;
const CARDS_EXTRA_QUANTITY = 2;
const RenderPosition = {BEFORE_END: `beforeend`, AFTER_END: `afterend`};
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// рендер header'a (меню навигации)
render(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFORE_END);
render(siteMainElement, createNavMenuTemplate(), RenderPosition.BEFORE_END);

// рендер header'a (меню фильтров)
render(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFORE_END);
render(siteMainElement, createSortMenuTemplate(), RenderPosition.BEFORE_END);

// рендер контейнера для списков фильмов
render(siteMainElement, createFilmsSectionTemplate(), RenderPosition.BEFORE_END);
const filmsElement = siteMainElement.querySelector(`.films`);

// рендер основого списка фильмов (CARDS_MAIN_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(`All movies. Upcoming`), RenderPosition.BEFORE_END);
const filmsListSection = siteMainElement.querySelector(`.films-list`);
const filmsListContainer = filmsListSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_MAIN_QUANTITY; i++) {
  render(filmsListContainer, createFilmArticle(), RenderPosition.BEFORE_END);
}

// рендер списка фильмов с высоким рейтингом (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(`Top rated`, `films-list--extra`), RenderPosition.BEFORE_END);
const filmsExtraSection = siteMainElement.querySelector(`.films-list--extra`);
const filmsExtraContainer = filmsExtraSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsExtraContainer, createFilmArticle(), RenderPosition.BEFORE_END);
}

// рендер списка самых комментируемых фильмов (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, createFilmsListTemplate(`Most commented`, `films-list--extra`), RenderPosition.BEFORE_END);
const filmsMostCommentedSection = siteMainElement.querySelectorAll(`.films-list--extra`)[1];
const filmsMostCommentedContainer = filmsMostCommentedSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsMostCommentedContainer, createFilmArticle(), RenderPosition.BEFORE_END);
}

// рендер кнопки show more
const filmsListElement = filmsElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreButton(), RenderPosition.BEFORE_END);

// рендер статистики пользователя в main
render(siteMainElement, createUserStatsTemplate(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsStatistics(), RenderPosition.BEFORE_END);

// рендер попапа с подробной информацией о фильме
render(siteFooterElement, createPopUpTemplate(), RenderPosition.AFTER_END);
