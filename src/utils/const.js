const SortType = {
  DEFAULT: `default`,
  BY_DATE: `by-date`,
  BY_RATE: `by-rate`
};

const FilmDetails = {
  director: `Director`,
  screenwriters: `Writers`,
  cast: `Actors`,
  releaseDate: `Release Date`,
  duration: `Runtime`,
  country: `Country`,
  genres: `Genres`,
  genre: `Genre`
};

const MoviesListData = {
  CARDS_MAIN_QUANTITY: 5,
  CARDS_EXTRA_QUANTITY: 2,
  CARDS_EMPTY_QUANTITY: 0
};

const UserAction = {
  UPDATE_MOVIE: `UPDATE_MOVIE`,

};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

const FilterType = {
  ALL_MOVIES: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export {
  SortType,
  FilmDetails,
  MoviesListData,
  UserAction,
  UpdateType,
  FilterType
};
