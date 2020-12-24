import AbstractView from "./abstract.js";
import {SortType} from "../utils/const.js";

const createSortMenuTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type=${SortType.DEFAULT}>Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type=${SortType.BY_DATE}>Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type=${SortType.BY_RATE}>Sort by rating</a></li>
    </ul>`
  );
};

export default class SortMenu extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate();
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
