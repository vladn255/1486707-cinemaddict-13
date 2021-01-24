import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {FilterType, UpdateType} from "../utils/const.js";
import {filter} from "../utils/filter.js";

import FiltersView from "../view/filters.js";

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeClick);
    this._filterComponent.setStatsClickHandler(this._handleStatsClick);
    this._filterComponent.setInnerHandlers();

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
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
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL_MOVIES,
        count: filter[FilterType.ALL_MOVIES](movies).length,
        text: `All movies`
      },
      {
        type: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](movies).length,
        text: `Watchlist`
      },
      {
        type: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](movies).length,
        text: `History`
      },
      {
        type: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](movies).length,
        text: `Favorites`
      }
    ];
  }

}
