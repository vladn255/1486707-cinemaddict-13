import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, count, text} = filter;

  return (
    `<a
      href="#${type}"
      class="main-navigation__item ${type === currentFilterType
      ? `main-navigation__item--active`
      : ``}"
      value=""${type}" data-filter-type="${type}"
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

    this._callback.filterTypeChange(evt.target.closest(`.main-navigation__item`).dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;

    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
