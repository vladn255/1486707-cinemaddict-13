const FilterNames = {
  all: `All movies`,
  watchlist: `Watchlist`,
  history: `History`,
  favorites: `Favorites`
};

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;

  return (
    name === `all`
      ? `<a href="#${name}" class="main-navigation__item
    ${isActive ? `main-navigation__item--active` : ``}">${FilterNames[name]}</a>`
      : `<a href="#${name}" class="main-navigation__item
    ${isActive ? `main-navigation__item--active` : ``}">${FilterNames[name]} <span class="main-navigation__item-count">${count}</span></a>`);
};

const createNavMenuTemplate = (filters) => {
  const filterItemsTemplate = filters
  .map((filter, isActive) => createFilterItemTemplate(filter, isActive === false)).join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};


export {createNavMenuTemplate};
