import AbstractView from "./abstract.js";

const createShowMoreButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButton();
  }

  _showMoreButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setShowMoreButtonClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._showMoreButtonClickHandler);
  }
}
