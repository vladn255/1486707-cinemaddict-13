import Abstract from "./abstract.js";

const createFilmsListTemplate = (listType) => {
  const {title, isHidden, isExtra} = listType;
  return (
    `<section class="films-list ${isExtra ? ` films-list--extra` : ``}">
      <h2 class="films-list__title ${isHidden ? ` visually-hidden` : ``}">${title}</h2>

      <div class="films-list__container">

      </div>
     </section>`
  );
};


export default class MoviesList extends Abstract {
  constructor(listType) {
    super();
    this._element = null;
    this._listType = listType;
  }

  getTemplate() {
    return createFilmsListTemplate(this._listType);
  }
}
