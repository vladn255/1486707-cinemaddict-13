import {getRandomInteger} from "./utils/common.js";
import {RenderPosition, render} from "./utils/render.js";

import UserRankView from "./view/user-rank.js";
import FiltersView from "./view/filters.js";
import SortMenuView from "./view/sort-menu.js";

import FooterStatsView from "./view/footer-stats.js";
// import StatsView from "./view/stats.js";

import {generateFilmCard} from "./mock/film-data.js";

import {generateFilters} from "./mock/filters.js";

import MoviesListPresenter from "./presenter/movies-list.js";

const FILMS_MOCK_COUNT = 17;


const films = new Array(FILMS_MOCK_COUNT).fill().map(generateFilmCard);
const filters = generateFilters(films);
const filmsNumber = getRandomInteger(0, 100000);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// рендер header'a (меню навигации)
render(siteHeaderElement, new UserRankView(), RenderPosition.BEFORE_END);

// рендер меню навигации
render(siteMainElement, new FiltersView(filters), RenderPosition.BEFORE_END);

// рендер меню фильтров
if (filmsNumber !== 0) {
  render(siteMainElement, new SortMenuView(), RenderPosition.BEFORE_END);
}

const moviesList = new MoviesListPresenter(filmsNumber);
moviesList.init(siteMainElement, films);

// // рендер статистики пользователя в main
// render(siteMainElement, new StatsView(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatsView(filmsNumber), RenderPosition.BEFORE_END);

