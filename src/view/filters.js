import AbstractView from "./abstract.js";
import {FilterNames} from "../utils/const.js";

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


export default class Filters extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createNavMenuTemplate(this._filters);
  }
}
