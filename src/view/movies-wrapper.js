import AbstractView from "./abstract.js";

const createFilmsSectionTemplate = () => {
  return (
    `<section class="films">

     </section>`
  );
};

export default class MoviesWrapper extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
