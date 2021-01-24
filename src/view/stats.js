import SmartView from "./smart.js";

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from "dayjs";

import {filter} from "../utils/filter.js";
import {FilterType, StatsFilters} from "../utils/const.js";
import {sortByGenresCount, getGenresCountsInMovies} from "../utils/statistics.js";

const MINUTES_IN_HOUR = 60;
const BAR_HEIGHT = 50;

const getMoviesWatchedCount = (movies) => filter[FilterType.HISTORY](movies).length;

const getMoviesWatchedDuration = (movies) => {
  return movies.reduce((totalDuration, currentMovie) => {
    return currentMovie.isAlreadyWatched
      ? totalDuration + currentMovie.duration
      : totalDuration;
  }, 0);
};

const getSortedGenreList = (movies) => {
  const unsortedGenresList = getGenresCountsInMovies(movies);
  return unsortedGenresList.sort(sortByGenresCount);
};

const getMostWatchedGenre = (genresList) => {
  if (genresList.length !== 0) {
    return genresList[0].genreName;
  }
  return 0;
};

const getChartHeight = (list) => {
  return list.length * BAR_HEIGHT;
};

const renderStatsChart = (movies, statisticCtx) => {
  const genres = getSortedGenreList(movies);

  const genresLabels = (genresList) => genresList.map((genre) => genre.genreName);
  const genresCounts = (genresList) => genresList.map((genre) => genre.genreCount);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresLabels(genres),
      datasets: [{
        data: genresCounts(genres),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createUserStatsTemplate = (data) => {
  const {movies, currentStatsFilter} = data;

  let totalDurationHours;
  let totalDurationMinutes;
  let genresList;
  let mostWatchedGenre;

  if (movies.length === 0) {
    totalDurationHours = 0;
    totalDurationMinutes = 0;
    genresList = 0;
    mostWatchedGenre = 0;
  } else {
    totalDurationHours = Math.floor(getMoviesWatchedDuration(movies) / MINUTES_IN_HOUR);
    totalDurationMinutes = getMoviesWatchedDuration(movies) % MINUTES_IN_HOUR;
    genresList = getSortedGenreList(movies);
    mostWatchedGenre = getMostWatchedGenre(genresList);
  }

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentStatsFilter === StatsFilters.ALL_TIME
      ? `checked`
      : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentStatsFilter === StatsFilters.TODAY
      ? `checked`
      : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentStatsFilter === StatsFilters.WEEK
      ? `checked`
      : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentStatsFilter === StatsFilters.MONTH
      ? `checked`
      : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentStatsFilter === StatsFilters.YEAR
      ? `checked`
      : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${getMoviesWatchedCount(movies)} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text"> ${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${mostWatchedGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000" height="${getChartHeight(genresList)}"></canvas>
      </div>

    </section>`
  );
};

export default class Stats extends SmartView {
  constructor(movies) {
    super();
    this._movies = movies;
    this._data = {
      movies,
      currentStatsFilter: StatsFilters.ALL_TIME
    };

    this._chart = null;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setChart();
  }

  removeElement() {
    super.removeElement();

    if (this._chart !== null) {
      this._chart = null;
    }
  }

  getTemplate() {
    return createUserStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setChart(this._data);
  }

  _dateChangeHandler(evt) {
    if (evt.target.value === this._data.currentStatsFilter) {
      return;
    }

    const filteredMovies = evt.target.value !== StatsFilters.ALL_TIME
      ? this._movies.slice().filter((movie) => movie.watchDate >= dayjs().subtract(1, evt.target.value).toDate())
      : this._movies;

    this.updateData({
      movies: filteredMovies,
      currentStatsFilter: evt.target.value
    });
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._dateChangeHandler);

    this._chart = renderStatsChart(this._data.movies, statisticCtx);
  }

}
