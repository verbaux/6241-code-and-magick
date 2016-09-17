'use strict';

module.exports = function() {
  var Review = require('./review');
  var loadData = require('./load');

  var
    SOURCE_DATA_LINK = '/api/reviews',
    reviewFilter = document.querySelector('.reviews-filter'), // блок фильтрации отзывов
    buttonShowMore = document.querySelector('.reviews-controls-more'), // кнопка показать еще
    templateReview = document.getElementById('review-template'), // шаблон отзывa
    reviewsList = document.querySelector('.reviews-list'), // контейнер отзывов
    classInvisible = 'invisible',
    reviewsObjects = [],
    reviewsData,
    currentPage = 0,
    REVIEW_PAGE_SIZE = 3,
    currentFilter = 'reviews-all';

  /**
   * переключаем видимость объекта target
   * @param target
   * @private
   */
  var _toggleVisibility = function(target) {
    target.classList.toggle(classInvisible);
  };

  /**
   * получаем шаблон и рисуем отзывы
   * @private
   */
  var _getReviews = function() {
    if (!reviewsData.length) {
      _disabledButtonShowMore();
      return;
    }

    var
      elemToClone,
      reviewElement,
      fragmentReviews = document.createDocumentFragment();

    if ('content' in templateReview) {
      elemToClone = templateReview.content.querySelector('.review');
    } else {
      elemToClone = templateReview.querySelector('.review');
    }

    reviewsData.forEach(function(review) {
      reviewElement = new Review(review, elemToClone);
      reviewsObjects.push(reviewElement);
      reviewElement.draw();
      fragmentReviews.appendChild(reviewElement.element);
    });

    reviewsList.appendChild(fragmentReviews);
  };

  /**
   * переключаем фильтры
   * @param evt
   * @private
   */
  var _filterApply = function(evt) {
    if (!evt.target.classList.contains('reviews-filter-item')) {
      return;
    }

    currentPage = 0;
    currentFilter = evt.target.htmlFor;

    if (buttonShowMore.classList.contains(classInvisible)) {
      _initButtonShowMore();
    }
    reviewsObjects.forEach(function(review) {
      review.destroyReview();
    });
    reviewsObjects = [];

    _loadDataCurrentPage();
  };

  var _initFilters = function() {
    reviewFilter.addEventListener('click', _filterApply);
  };

  /**
   * получаем данные для текущей страницы
   */
  var _loadDataCurrentPage = function() {
    var params = {
      from: currentPage * REVIEW_PAGE_SIZE,
      to: currentPage * REVIEW_PAGE_SIZE + REVIEW_PAGE_SIZE,
      filter: currentFilter
    };
    loadData(SOURCE_DATA_LINK, params, _onLoaded);
  };

  /**
   * загружаем и отрисовываем дополнительные данные
   * @private
   */
  var _showMoreReview = function() {
    currentPage++;
    _loadDataCurrentPage();
  };

  /**
   * показываем кнопку "Показать еще"
   * @private
   */
  var _initButtonShowMore = function() {
    buttonShowMore.addEventListener('click', _showMoreReview);
    _toggleVisibility(buttonShowMore);
  };

  /**
   * убираем кнопку "Показать еще"
   * @private
   */
  var _disabledButtonShowMore = function() {
    buttonShowMore.removeEventListener('click', _showMoreReview);
    _toggleVisibility(buttonShowMore);
  };

  /**
   * @param data
   * @private
   */
  var _onLoadedSuccess = function(data) {
    reviewsData = data;
    _getReviews();
  };

  /**
   * @private
   */
  var _onLoadedError = function() {
    reviewsData = null;
    console.error('Can\'t load reviews');
  };

  /**
   * @param data
   * @private
   */
  var _onLoaded = function(data) {
    _toggleVisibility(reviewFilter);

    if (data instanceof Array) {
      _onLoadedSuccess(data);
    } else {
      _onLoadedError();
    }

    _toggleVisibility(reviewFilter);
  };

  _loadDataCurrentPage();
  _initButtonShowMore();
  _initFilters();
};
