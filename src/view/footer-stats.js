import {createElement} from "../utils.js";

const createFilmsStatistics = (number) => {
  return `<p>${number} movies inside</p>`;
};

export default class FooterStats {
  constructor(number) {
    this._element = null;
    this._number = number;
  }
  getTemplate() {
    return createFilmsStatistics(this._number);
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
