import AbstractView from "./abstract.js";

const createProfileTemplate = () => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">Sci-Fighter</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRank extends AbstractView {
  getTemplate() {
    return createProfileTemplate();
  }
}
