import {getRandomInteger} from "./utils/common.js";
import {RenderPosition, render} from "./utils/render.js";

import UserRank from "./view/user-rank.js";
import Filters from "./view/filters.js";
import SortMenu from "./view/sort-menu.js";

import FooterStats from "./view/footer-stats.js";
// import Stats from "./view/stats.js";

import {generateFilmCard} from "./mock/film-data.js";

import {generateFilters} from "./mock/filters.js";

import MoviesList from "./presenter/movies-list.js";

const FILMS_MOCK_COUNT = 17;


const films = new Array(FILMS_MOCK_COUNT).fill().map(generateFilmCard);
const filters = generateFilters(films);
const filmsNumber = getRandomInteger(0, 100000);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// рендер header'a (меню навигации)
render(siteHeaderElement, new UserRank(), RenderPosition.BEFORE_END);

// рендер меню навигации
render(siteMainElement, new Filters(filters), RenderPosition.BEFORE_END);

// рендер меню фильтров
if (filmsNumber !== 0) {
  render(siteMainElement, new SortMenu(), RenderPosition.BEFORE_END);
}

const moviesList = new MoviesList(filmsNumber);
moviesList.init(films);

// // рендер статистики пользователя в main
// render(siteMainElement, new Stats(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStats(filmsNumber), RenderPosition.BEFORE_END);

