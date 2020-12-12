import {createElement} from "../utils.js";

const createEmptyList = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`);
};

export default class EmptyList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyList();
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
