import AbstractView from "./abstract.js";
import {FilterType} from "../utils/const.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count, text} = filter;

  return (
    `<a
      href="#${name}"
      class="main-navigation__item ${type === currentFilterType
      ? `main-navigation__item--active`
      : ``}"
      value="${type}"
    >
      ${text}

      ${name !== `all`
      ? `<span class="main-navigation__item-count">
            ${count}
          </span>`
      : ``
    }
    </a>`
  );
};

const createNavMenuTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
  .map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};


export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createNavMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.getAttribute(`value`));
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;

    this.getElement().querySelector(`a[href="#${FilterType[`ALL_MOVIES`]}"]`).addEventListener(`click`, this._filterTypeChangeHandler);
    this.getElement().querySelector(`a[href="#${FilterType[`WATCHLIST`]}"]`).addEventListener(`click`, this._filterTypeChangeHandler);
    this.getElement().querySelector(`a[href="#${FilterType[`HISTORY`]}"]`).addEventListener(`click`, this._filterTypeChangeHandler);
    this.getElement().querySelector(`a[href="#${FilterType[`FAVORITES`]}"]`).addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
