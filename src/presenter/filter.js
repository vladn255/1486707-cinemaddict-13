import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {FilterType, UpdateType} from "../utils/const.js";
import {filter} from "../utils/filter.js";

import FiltersView from "../view/filters.js";
import UserRankView from "../view/user-rank.js";

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel, userRankContainer) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._userRankContainer = userRankContainer;
    this._currentFilter = null;

    this._filterComponent = null;
    this._userRankComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    this._movies = this._moviesModel.getMovies();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    const prevUserRankComponent = this._userRankComponent;

    this._filterComponent = new FiltersView(filters, this._currentFilter);
    this._userRankComponent = new UserRankView(filter[FilterType.WATCHLIST](this._movies).length);
    this._filterComponent.setFilterTypeClickHandler(this._handleFilterTypeClick);
    this._filterComponent.setStatsClickHandler(this._handleStatsClick);
    this._filterComponent.setInnerHandlers();

    if (prevFilterComponent === null && prevUserRankComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFORE_END);
      render(this._userRankContainer, this._userRankComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    replace(this._userRankComponent, prevUserRankComponent);
    remove(prevFilterComponent);
    remove(prevUserRankComponent);

  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeClick(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleStatsClick(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.STATS, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.ALL_MOVIES,
        count: filter[FilterType.ALL_MOVIES](this._movies).length,
        text: `All movies`
      },
      {
        type: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](this._movies).length,
        text: `Watchlist`
      },
      {
        type: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](this._movies).length,
        text: `History`
      },
      {
        type: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](this._movies).length,
        text: `Favorites`
      }
    ];
  }

}
