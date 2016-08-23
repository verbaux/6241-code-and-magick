'use strict';

var
  SOURCE_DATA_LINK = '/api/reviews?callback=',
  reviews = [];

window.JSONPCallback = {};

/**
 * сохраняем полученные от сервера данные в переменную review
 * @param data
 */
function requestReviewsSuccess(data) {
  reviews = data;
  console.log(reviews); // иначе ругался eslint на неиспользуемую переменную
}

/**
 * запрашиваем данные у сервера через jsonp
 * @param url
 * @param callback
 */
function getDataReviews(url, callback) {
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
}

getDataReviews(SOURCE_DATA_LINK, requestReviewsSuccess);
