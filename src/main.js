import {UpdateType, NetworkValues} from "./utils/const.js";
import {RenderPosition, render} from "./utils/render.js";
import Api from "./api.js";


import FooterStatsView from "./view/footer-stats.js";

import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import CommentsModel from "./model/comments.js";

import MoviesListPresenter from "./presenter/movies-list.js";
import FilterPresenter from "./presenter/filter";

const api = new Api(NetworkValues.END_POINT, NetworkValues.AUTHORIZATION);

const moviesModel = new MoviesModel();

const filterModel = new FilterModel();

const commentsModel = new CommentsModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// рендер меню навигации
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, siteHeaderElement);
filterPresenter.init();

// рендер списков фильмов
const moviesList = new MoviesListPresenter(siteMainElement, moviesModel, filterModel, commentsModel, api);
moviesList.init();

// получение фильмов с сервера и установка их в модель
api.getMovies().then((movies) => {
  moviesModel.setMovies(UpdateType.INIT, movies);

  // рендер блока статистики в  footer'е
  const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
  render(footerStatisticsElement, new FooterStatsView(moviesModel.getMovies().length), RenderPosition.BEFORE_END);
})
.catch(() => {
  moviesModel.setMovies(UpdateType.INIT, []);
});
