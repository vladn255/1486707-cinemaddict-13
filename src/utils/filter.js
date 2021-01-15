import {FilterType} from "./const";

export const filter = {
  [FilterType.ALL_MOVIES]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isToWatch),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isAlreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isInFavorites)
};
