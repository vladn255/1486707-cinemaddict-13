import AbstractView from "./abstract.js";
import {SortType} from "../utils/const.js";

const createSortMenuTemplate = (currentSortType) => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button ${currentSortType === SortType.DEFAULT
      ? `sort__button--active`
      : ``}" data-sort-type=${SortType.DEFAULT}>Sort by default</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.BY_DATE
      ? `sort__button--active`
      : ``}" data-sort-type=${SortType.BY_DATE}>Sort by date</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.BY_RATE
      ? `sort__button--active`
      : ``}" data-sort-type=${SortType.BY_RATE}>Sort by rating</a></li>
    </ul>`
  );
};

export default class SortMenu extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.closest(`.sort__button`)) {
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
