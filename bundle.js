/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_user_rank_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/user-rank.js */ "./src/view/user-rank.js");
/* harmony import */ var _view_nav_menu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view/nav-menu.js */ "./src/view/nav-menu.js");
/* harmony import */ var _view_sort_menu_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view/sort-menu.js */ "./src/view/sort-menu.js");
/* harmony import */ var _view_show_more_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view/show-more.js */ "./src/view/show-more.js");
/* harmony import */ var _view_movie_card_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view/movie-card.js */ "./src/view/movie-card.js");
/* harmony import */ var _view_films_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./view/films-list */ "./src/view/films-list.js");
/* harmony import */ var _view_films_wrapper_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./view/films-wrapper.js */ "./src/view/films-wrapper.js");
/* harmony import */ var _view_footer_stats_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./view/footer-stats.js */ "./src/view/footer-stats.js");







// import {createPopUpTemplate} from "./view/popup.js";
// import {createUserStatsTemplate} from "./view/stats.js";


const CARDS_MAIN_QUANTITY = 5;
const CARDS_EXTRA_QUANTITY = 2;
const RenderPosition = {
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// рендер header'a (меню навигации)
render(siteHeaderElement, Object(_view_user_rank_js__WEBPACK_IMPORTED_MODULE_0__["createProfileTemplate"])(), RenderPosition.BEFORE_END);
render(siteMainElement, Object(_view_nav_menu_js__WEBPACK_IMPORTED_MODULE_1__["createNavMenuTemplate"])(), RenderPosition.BEFORE_END);

// рендер header'a (меню фильтров)
render(siteHeaderElement, Object(_view_user_rank_js__WEBPACK_IMPORTED_MODULE_0__["createProfileTemplate"])(), RenderPosition.BEFORE_END);
render(siteMainElement, Object(_view_sort_menu_js__WEBPACK_IMPORTED_MODULE_2__["createSortMenuTemplate"])(), RenderPosition.BEFORE_END);

// рендер контейнера для списков фильмов
render(siteMainElement, Object(_view_films_wrapper_js__WEBPACK_IMPORTED_MODULE_6__["createFilmsSectionTemplate"])(), RenderPosition.BEFORE_END);
const filmsElement = siteMainElement.querySelector(`.films`);

// рендер основого списка фильмов (CARDS_MAIN_QUANTITY штук)
render(filmsElement, Object(_view_films_list__WEBPACK_IMPORTED_MODULE_5__["createFilmsListTemplate"])(`All movies. Upcoming`), RenderPosition.BEFORE_END);
const filmsListSection = siteMainElement.querySelector(`.films-list`);
const filmsListContainer = filmsListSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_MAIN_QUANTITY; i++) {
  render(filmsListContainer, Object(_view_movie_card_js__WEBPACK_IMPORTED_MODULE_4__["createFilmArticle"])(), RenderPosition.BEFORE_END);
}

// рендер списка фильмов с высоким рейтингом (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, Object(_view_films_list__WEBPACK_IMPORTED_MODULE_5__["createFilmsListTemplate"])(`Top rated`, `films-list--extra`), RenderPosition.BEFORE_END);
const filmsExtraSection = siteMainElement.querySelector(`.films-list--extra`);
const filmsExtraContainer = filmsExtraSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsExtraContainer, Object(_view_movie_card_js__WEBPACK_IMPORTED_MODULE_4__["createFilmArticle"])(), RenderPosition.BEFORE_END);
}

// рендер списка самых комментируемых фильмов (CARDS_EXTRA_QUANTITY штук)
render(filmsElement, Object(_view_films_list__WEBPACK_IMPORTED_MODULE_5__["createFilmsListTemplate"])(`Most commented`, `films-list--extra`), RenderPosition.BEFORE_END);
const filmsMostCommentedSection = siteMainElement.querySelectorAll(`.films-list--extra`)[1];
const filmsMostCommentedContainer = filmsMostCommentedSection.querySelector(`.films-list__container`);
for (let i = 0; i < CARDS_EXTRA_QUANTITY; i++) {
  render(filmsMostCommentedContainer, Object(_view_movie_card_js__WEBPACK_IMPORTED_MODULE_4__["createFilmArticle"])(), RenderPosition.BEFORE_END);
}

// рендер кнопки show more
const filmsListElement = filmsElement.querySelector(`.films-list`);
render(filmsListElement, Object(_view_show_more_js__WEBPACK_IMPORTED_MODULE_3__["createShowMoreButton"])(), RenderPosition.BEFORE_END);

// // рендер статистики пользователя в main
// render(siteMainElement, createUserStatsTemplate(), RenderPosition.BEFORE_END);

// рендер блока статистики в  footer'е
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, Object(_view_footer_stats_js__WEBPACK_IMPORTED_MODULE_7__["createFilmsStatistics"])(), RenderPosition.BEFORE_END);

// // рендер попапа с подробной информацией о фильме
// render(siteFooterElement, createPopUpTemplate(), RenderPosition.AFTER_END);


/***/ }),

/***/ "./src/view/films-list.js":
/*!********************************!*\
  !*** ./src/view/films-list.js ***!
  \********************************/
/*! exports provided: createFilmsListTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFilmsListTemplate", function() { return createFilmsListTemplate; });

const createFilmsListTemplate = (listType, additionalClass = ``) => {
  return (
    `<section class="films-list ${additionalClass}">
      <h2 class="films-list__title">${listType}</h2>

       <div class="films-list__container">

       </div>
    </section>`
  );
};





/***/ }),

/***/ "./src/view/films-wrapper.js":
/*!***********************************!*\
  !*** ./src/view/films-wrapper.js ***!
  \***********************************/
/*! exports provided: createFilmsSectionTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFilmsSectionTemplate", function() { return createFilmsSectionTemplate; });
const createFilmsSectionTemplate = () => {
  return (
    `<section class="films">

     </section>`
  );
};




/***/ }),

/***/ "./src/view/footer-stats.js":
/*!**********************************!*\
  !*** ./src/view/footer-stats.js ***!
  \**********************************/
/*! exports provided: createFilmsStatistics */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFilmsStatistics", function() { return createFilmsStatistics; });
const createFilmsStatistics = () => {
  return `<p>130 291 movies inside</p>`;
};




/***/ }),

/***/ "./src/view/movie-card.js":
/*!********************************!*\
  !*** ./src/view/movie-card.js ***!
  \********************************/
/*! exports provided: createFilmArticle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFilmArticle", function() { return createFilmArticle; });
const createFilmArticle = () => {
  return (
    `<article class="film-card">
        <h3 class="film-card__title">Popeye the Sailor Meets Sindbad the Sailor</h3>
        <p class="film-card__rating">6.3</p>
        <p class="film-card__info">
          <span class="film-card__year">1936</span>
          <span class="film-card__duration">16m</span>
          <span class="film-card__genre">Cartoon</span>
        </p>
        <img src="./images/posters/popeye-meets-sinbad.png" alt="" class="film-card__poster">
        <p class="film-card__description">In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…</p>
        <a class="film-card__comments">0 comments</a>
        <div class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
        </div>
     </article>`
  );
};




/***/ }),

/***/ "./src/view/nav-menu.js":
/*!******************************!*\
  !*** ./src/view/nav-menu.js ***!
  \******************************/
/*! exports provided: createNavMenuTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNavMenuTemplate", function() { return createNavMenuTemplate; });
const createNavMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
        <a href="#history" class="main-navigation__item main-navigation__item--active">History <span class="main-navigation__item-count">4</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
      </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};





/***/ }),

/***/ "./src/view/show-more.js":
/*!*******************************!*\
  !*** ./src/view/show-more.js ***!
  \*******************************/
/*! exports provided: createShowMoreButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createShowMoreButton", function() { return createShowMoreButton; });
const createShowMoreButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};




/***/ }),

/***/ "./src/view/sort-menu.js":
/*!*******************************!*\
  !*** ./src/view/sort-menu.js ***!
  \*******************************/
/*! exports provided: createSortMenuTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSortMenuTemplate", function() { return createSortMenuTemplate; });

const createSortMenuTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};




/***/ }),

/***/ "./src/view/user-rank.js":
/*!*******************************!*\
  !*** ./src/view/user-rank.js ***!
  \*******************************/
/*! exports provided: createProfileTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createProfileTemplate", function() { return createProfileTemplate; });
const createProfileTemplate = () => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">Sci-Fighter</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};




/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map