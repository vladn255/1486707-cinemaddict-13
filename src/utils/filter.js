import {FilterType} from "./const";

export const filter = {
  [FilterType.ALL_MOVIES]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((film) => film.isToWatch),
  [FilterType.HISTORY]: (movies) => movies.filter((film) => film.isAlreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((film) => film.isInFavorites)
};
