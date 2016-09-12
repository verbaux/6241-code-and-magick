'use strict';

module.exports = function() {
  var drawReview = require('./review');
  var loadData = require('./load');

  var
    SOURCE_DATA_LINK = '/api/reviews?callback=',
    reviewFilter = document.querySelector('.reviews-filter'), // блок фильтрации отзывов
    classInvisible = 'invisible',
    reviewsData = null;

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
    var
      templateReview = document.getElementById('review-template'), // шаблон отзывa
      elemToClone,
      reviewElement,
      reviewsList = document.querySelector('.reviews-list'); // контейнер отзывов

    if ('content' in templateReview) {
      elemToClone = templateReview.content.querySelector('.review');
    } else {
      elemToClone = templateReview.querySelector('.review');
    }

    reviewsData.forEach(function(review) {
      reviewElement = drawReview(elemToClone, review);
      reviewsList.appendChild(reviewElement);
    });
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

  loadData(SOURCE_DATA_LINK, _onLoaded);
};
