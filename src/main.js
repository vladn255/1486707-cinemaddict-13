import {getRandomInteger} from "./utils/common.js";
import {RenderPosition, render} from "./utils/render.js";

import UserRankView from "./view/user-rank.js";
import FooterStatsView from "./view/footer-stats.js";
// import StatsView from "./view/stats.js";

import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import CommentsModel from "./model/comments.js";

import {generateFilmCard} from "./mock/film-data.js";


import MoviesListPresenter from "./presenter/movies-list.js";
import FilterPresenter from "./presenter/filter";

const FILMS_MOCK_COUNT = 17;

const films = new Array(FILMS_MOCK_COUNT).fill().map(generateFilmCard);

const filmsNumber = getRandomInteger(0, 100000);

const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const filterModel = new FilterModel();

const commentsModel = new CommentsModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// рендер header'a (меню навигации)
render(siteHeaderElement, new UserRankView(), RenderPosition.BEFORE_END);

// рендер меню навигации
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

const moviesList = new MoviesListPresenter(siteMainElement, moviesModel, filterModel, commentsModel);
moviesList.init();

// // рендер статистики пользователя в main
// render(siteMainElement, new StatsView(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatsView(filmsNumber), RenderPosition.BEFORE_END);

