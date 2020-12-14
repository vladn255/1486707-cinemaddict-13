import AbstractView from "./abstract.js";

const createFilmsStatistics = (number) => {
  return `<p>${number} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  constructor(number) {
    super();
    this._number = number;
  }

  getTemplate() {
    return createFilmsStatistics(this._number);
  }
}
