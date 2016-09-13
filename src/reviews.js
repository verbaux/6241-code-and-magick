'use strict';

module.exports = function() {
  var Review = require('./review');
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
      reviewsList = document.querySelector('.reviews-list'), // контейнер отзывов
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
      reviewElement.draw();
      fragmentReviews.appendChild(reviewElement.element);
    });

    reviewsList.appendChild(fragmentReviews);
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
