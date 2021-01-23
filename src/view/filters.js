import {FilterType} from "../utils/const.js";
import {remove} from "../utils/render.js";
import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, count, text} = filter;
  const activeFilter = currentFilterType !== FilterType.STATS
    ? currentFilterType
    : null;

  if (type !== FilterType.STATS) {
    return (
      `<a
        href="#${type}"
        class="main-navigation__item ${type === activeFilter
        ? `main-navigation__item--active`
        : ``}"
        value="${type}" data-filter-type="${type}"
      >
      ${text}

      ${type !== `all`
        ? `<span class="main-navigation__item-count">
            ${count}
          </span>`
        : ``
      }
      </a>`
    );
  }
  return (``);
};

const createNavMenuTemplate = (filters, currentFilterType, currentMenuItem) => {
  const filterItemsTemplate = filters
  .map((filter) => createFilterItemTemplate(filter, currentFilterType, currentMenuItem)).join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional
      ${currentFilterType === FilterType.STATS
      ? `main-navigation__additional--active`
      : ``}
      " value="stats" data-filter-type="stats">Stats</a>
    </nav>`);
};


export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createNavMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeClickHandler(evt) {
    if (evt.target.closest(`.main-navigation__item`)) {
      evt.preventDefault();
      const clickedFilter = evt.target.closest(`.main-navigation__item `).dataset.filterType;
      this._callback.filterTypeChange(clickedFilter);
      if (clickedFilter !== `stats`) {
        remove(document.querySelector(`.statistics`));
      }
    }
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
  }

  setInnerHandlers() {
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._filterTypeClickHandler);
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statsClickHandler);
  }
}
