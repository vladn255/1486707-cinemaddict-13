import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  // обновление фильма
  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          cover: movie.film_info.poster,
          title: movie.film_info.title,
          rate: movie.film_info.total_rating,
          releaseDate: movie.film_info.release.date,
          duration: movie.film_info.runtime,
          genres: movie.film_info.genre,
          description: movie.film_info.description,
          originalTitle: movie.film_info.alternative_title,
          director: movie.film_info.director,
          screenwriters: movie.film_info.writers,
          cast: movie.film_info.actors,
          country: movie.film_info.release.release_country,
          ageRestriction: movie.film_info.age_rating,
          isToWatch: movie.user_details.watchlist,
          isAlreadyWatched: movie.user_details.already_watched,
          isInFavorites: movie.user_details.favorite,
          watchDate: movie.user_details.watching_date
        }
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {"film_info": {
          "poster": movie.cover,
          "title": movie.title,
          "total_rating": movie.rate,
          "release": {
            "date": movie.releaseDate,
            "release_country": movie.country
          },
          "runtime": movie.duration,
          "genre": movie.genres,
          "description": movie.description,
          "alternative_title": movie.originalTitle,
          "director": movie.director,
          "writers": movie.screenwriters,
          "actors": movie.cast,
          "age_rating": movie.ageRestriction
        },
        "user_details": {
          "watchlist": movie.isToWatch,
          "already_watched": movie.isAlreadyWatched,
          "favorite": movie.isInFavorites,
          "watching_date": movie.watchDate
        }
        }
    );

    delete adaptedMovie.cover;
    delete adaptedMovie.title;
    delete adaptedMovie.rate;
    delete adaptedMovie.releaseDate;
    delete adaptedMovie.duration;
    delete adaptedMovie.genres;
    delete adaptedMovie.description;
    delete adaptedMovie.originalTitle;
    delete adaptedMovie.director;
    delete adaptedMovie.screenwriters;
    delete adaptedMovie.cast;
    delete adaptedMovie.country;
    delete adaptedMovie.ageRestriction;
    delete adaptedMovie.isToWatch;
    delete adaptedMovie.isAlreadyWatched;
    delete adaptedMovie.isInFavorites;
    delete adaptedMovie.watchDate;

    return adaptedMovie;
  }
}
