import {
  createProfileTemplate
} from "./view/user_rank.js";
import {
  createMenuTemplate,
  createFilmsStatistics,
} from "./view/menu.js";
import {
  createShowMoreButton
} from "./view/show_more.js";
import {
  createFilmsTemplate,
  createFilmArticle
} from "./view/movie_card.js";
import {
  createTopRatedTemplate,
  createMostCommentedTemplate
} from "./view/films_extra";
import {createPopUpTemplate} from "./view/popup.js";


const CARDS_MAIN_QUANTITY = 5;
const CARDS_EXTRA_QUANTITY = 2;
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// рендер header'a (меню и фильтры)
render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createMenuTemplate(), `beforeend`);

// рендер основого списка фильмов (CARDS_MAIN_QUANTITY штук)
render(siteMainElement, createFilmsTemplate(), `beforeend`);
const filmsListSection = siteMainElement.querySelector(`.films-list`);
const filmsListContainer = filmsListSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_MAIN_QUANTITY; i++) {
  render(filmsListContainer, createFilmArticle(), `beforeend`);
}

// рендер списка фильмов с высоким рейтингом (CARDS_EXTRA_QUANTITY штук)
const filmsElement = siteMainElement.querySelector(`.films`);
render(filmsElement, createTopRatedTemplate(), `beforeend`);
const filmsExtraSection = siteMainElement.querySelector(`.films-list--extra`);
const filmsExtraContainer = filmsExtraSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsExtraContainer, createFilmArticle(), `beforeend`);
}

// рендер списка самых комментируемых фильмов (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, createMostCommentedTemplate(), `beforeend`);
const filmsMostCommentedSection = siteMainElement.querySelectorAll(`.films-list--extra`)[1];
const filmsMostCommentedContainer = filmsMostCommentedSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsMostCommentedContainer, createFilmArticle(), `beforeend`);
}

// рендер кнопки show more
render(siteMainElement, createShowMoreButton(), `beforeend`);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsStatistics(), `beforeend`);

// рендер попапа с подробной информацией о фильме
render(siteFooterElement, createPopUpTemplate(), `afterend`);
