
const filmsToFilterMap = {
  all: (films) => {
    return films.length;
  },
  watchlist: (films) => {
    return films.filter((film) => {
      return film.isToWatch;
    }).length;
  },
  history: (films) => {
    return films.filter((film) => {
      return film.isAlreadyWatched;
    }).length;
  },
  favorites: (films) => {
    return films.filter((film) => {
      return film.isInFavorites;
    }).length;
  }
};

// генерация фильтров
const generateFilters = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films)
    };
  });
};

export {generateFilters};
