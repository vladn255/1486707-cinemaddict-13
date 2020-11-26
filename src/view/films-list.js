
const createFilmsListTemplate = (listType, additionalClass = ``) => {
  return (
    `<section class="films-list ${additionalClass}">
      <h2 class="films-list__title">${listType}</h2>

       <div class="films-list__container">

       </div>
    </section>`
  );
};


export {createFilmsListTemplate};
