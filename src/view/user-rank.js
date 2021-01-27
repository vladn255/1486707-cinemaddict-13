import AbstractView from "./abstract.js";
import {RatesLevels} from "../utils/const.js";

export const getProfileRating = (count) => {
  let title;

  if (count <= RatesLevels.NOVICE.score) {
    title = RatesLevels.NOVICE.title;
  } else if ((count > RatesLevels.NOVICE.score) && (count <= RatesLevels.FAN.score)) {
    title = RatesLevels.FAN.title;
  } else if ((count > RatesLevels.FAN.score) && (count <= RatesLevels.MOVIE_BUFF.score)) {
    title = RatesLevels.MOVIE_BUFF.title;
  }

  return title;
};

const createProfileTemplate = (count) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getProfileRating(count)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};

export default class UserRank extends AbstractView {
  constructor(moviesWatchedCount) {
    super();
    this._moviesWatchedCount = moviesWatchedCount;
  }

  getTemplate() {
    return createProfileTemplate(this._moviesWatchedCount);
  }
}
