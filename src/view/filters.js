import {createElement} from "../utils.js";

const FilterNames = {
  all: `All movies`,
  watchlist: `Watchlist`,
  history: `History`,
  favorites: `Favorites`
};

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;

  return (
    `<a
      href="#${name}"
      class="main-navigation__item ${isActive
      ? `main-navigation__item--active`
      : ``}"
    >
      ${FilterNames[name]}

      ${name !== `all`
      ? `<span class="main-navigation__item-count">
            ${count}
          </span>`
      : ``
    }
    </a>`
  );
};

const createNavMenuTemplate = (filters) => {
  const filterItemsTemplate = filters
  .map((filter, isActive) => createFilterItemTemplate(filter, isActive === false)).join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};


export default class Filters {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }
  getTemplate() {
    return createNavMenuTemplate(this._filters);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
