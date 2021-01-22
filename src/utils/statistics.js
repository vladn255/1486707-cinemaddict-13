const getGenresCountsInMovies = (movies) => {

  const watchedMovies = movies.filter((movie) => movie.isAlreadyWatched);

  const watchedGenres = watchedMovies.map((movie) => movie.genres).flat();

  const uniqGenres = [...new Set(watchedGenres)];

  return Array.from(uniqGenres).map((uniqGenre) => {
    return Object.assign(
        {},
        {
          genreName: uniqGenre,
          genreCount: watchedGenres.filter((genre) => genre === uniqGenre).length
        });
  });
};

const sortByGenresCount = (genreA, genreB) => genreB.genreCount - genreA.genreCount;


export {
  getGenresCountsInMovies,
  sortByGenresCount
};
