import {UpdateType, NetworkValues} from "./utils/const.js";
import {getRandomInteger} from "./utils/common.js";
import {RenderPosition, render} from "./utils/render.js";
import Api from "./api.js";

import UserRankView from "./view/user-rank.js";
import FooterStatsView from "./view/footer-stats.js";

import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import CommentsModel from "./model/comments.js";

import MoviesListPresenter from "./presenter/movies-list.js";
import FilterPresenter from "./presenter/filter";

const api = new Api(NetworkValues.END_POINT, NetworkValues.AUTHORIZATION);

const filmsNumber = getRandomInteger(0, 100000);

const moviesModel = new MoviesModel();

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

// рендер списков фильмов
const moviesList = new MoviesListPresenter(siteMainElement, moviesModel, filterModel, commentsModel, api);
moviesList.init();

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatsView(filmsNumber), RenderPosition.BEFORE_END);

// получение фильмов с сервера и установка их в модель
api.getMovies().then((movies) => {
  moviesModel.setMovies(UpdateType.INIT, movies);
})
.catch(() => {
  moviesModel.setMovies(UpdateType.INIT, []);
});
