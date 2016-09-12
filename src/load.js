'use strict';

module.exports = function(url, callback) {
  var
    callbackName = 'cb' + String(Math.random()).slice(-6),
    urlData = url + callbackName; // url до данных

  window[callbackName] = function(data) {
    delete window[callbackName]; // очищаем реестр
    callback(data); // возвращаем данные
    document.body.removeChild(scriptBox);
  };

  var scriptBox = document.createElement('script');
  scriptBox.src = urlData;
  document.body.appendChild(scriptBox);
};
