import {FilterType} from "../utils/const.js";
import {remove} from "../utils/render.js";
import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType, currentMenuItem) => {
  const {type, count, text} = filter;
  const activeFilter = currentMenuItem !== FilterType.STATS
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

const createStatsTemplate = (filter, currentFilterType) => {
  const {type, text} = filter;

  if (type === FilterType.STATS) {
    return (
      `<a href="#${type}" class="main-navigation__additional
      ${currentFilterType === FilterType.STATS
        ? `main-navigation__additional--active`
        : ``}
      " value="${type}" data-filter-type="${type}">${text}</a>`
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
      ${createStatsTemplate(filters.find((filter) => filter.type === FilterType.STATS), currentFilterType, currentMenuItem)}
    </nav>`);
};


export default class Filters extends AbstractView {
  constructor(filters, currentFilterType, currentMenuItem) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._currentMenuItem = currentMenuItem;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createNavMenuTemplate(this._filters, this._currentFilterType, this._currentMenuItem);
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
    this.getElement().addEventListener(`click`, this._filterTypeClickHandler);
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statsClickHandler);
  }
}
