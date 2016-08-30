'use strict';

window.JSONPCallback = {};

var
  SOURCE_DATA_LINK = '/api/reviews?callback=',
  IMAGE_LOAD_TIMEOUT = '1000',
  reviewFilter = document.querySelector('.reviews-filter'), // блок фильтрации отзывов
  classInvisible = 'invisible',
  classImgLoadError = 'review-load-failure',
  templateReview = document.getElementById('review-template'), // шаблон отзывa
  elemToClone,
  reviewsList = document.querySelector('.reviews-list'), // контейнер отзывов
  ratingEntity = {
    '1': '',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five'
  }; // модификатор класса рейтинга

if ('content' in templateReview) {
  elemToClone = templateReview.content.querySelector('.review');
} else {
  elemToClone = templateReview.querySelector('.review');
}

/**
 * передаем данные, полученные от сервера в функцию отрисовки template
 * @param data
 * @private
 */
var _requestReviewSucces = function(data) {
  _addReviewContent(data);
};

/**
 * запрашиваем данные у сервера через jsonp
 * @param url
 * @param callback
 * @private
 */
var _getDataReview = function(url, callback) {
  var
    callbackName = 'cb' + String(Math.random()).slice(-6),
    urlData = url + 'JSONPCallback.' + callbackName; // url до данных

  window.JSONPCallback[callbackName] = function(data) {
    delete window.JSONPCallback[callbackName]; // очищаем реестр
    callback(data); // возвращаем данные
    document.body.removeChild(scriptBox);
  };

  var scriptBox = document.createElement('script');
  scriptBox.src = urlData;
  document.body.appendChild(scriptBox);
};

/**
 * переключаем видимость объекта target
 * @param target
 * @private
 */
var _toggleVisibility = function(target) {
  target.classList.toggle(classInvisible);
};

/**
 * Формируем и вставляем один отзыв
 * @param data
 * @param container
 * @returns {Node}
 * @private
 */
var _getReviewElement = function(data, container) {
  var elem = elemToClone.cloneNode(true);

  elem.querySelector('.review-rating').classList.add('review-rating-' + ratingEntity[data.rating]);
  elem.querySelector('.review-text').textContent = data.description;

  var
    avatarElem = elem.querySelector('.review-author'),
    avatar = new Image(),
    avatarLoadTimeout;

  avatar.alt = avatar.title = data.author.name;

  container.appendChild(elem);

  avatar.addEventListener('load', function(evt) {
    clearTimeout(avatarLoadTimeout);
    avatarElem.width = avatarElem.height = 124;
    avatarElem.src = evt.target.src;
  });

  avatar.addEventListener('error', function() {
    elem.classList.add(classImgLoadError);
  });

  avatar.src = data.author.picture;

  avatarLoadTimeout = setTimeout(function() {
    avatar.src = '';
    elem.classList.add(classImgLoadError);
  }, IMAGE_LOAD_TIMEOUT);

  return elem;
};

/**
 * пробегаемся по массиву данных
 * @param arrayReview
 * @private
 */
var _addReviewContent = function(arrayReview) {
  _toggleVisibility(reviewFilter);

  arrayReview.forEach(function(item) {
    _getReviewElement(item, reviewsList);
  });

  _toggleVisibility(reviewFilter);
};

_getDataReview(SOURCE_DATA_LINK, _requestReviewSucces);
