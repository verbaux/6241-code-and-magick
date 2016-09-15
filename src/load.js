'use strict';

module.exports = function(url, params, callback) {
  var urlRequest = url;
  var xhr = new XMLHttpRequest();

  /**
   * получаем параметры для запроса
   * @param parameters
   * @returns {string}
   * @private
   */
  var _putRequestParams = function(parameters) {
    var paramsArray = [];

    for (var key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        paramsArray.push(key + '=' + parameters[key]);
      }
    }

    return '?' + paramsArray.join('&');
  };

  urlRequest += _putRequestParams(params);

  xhr.open('GET', urlRequest, true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status !== 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      callback(JSON.parse(xhr.response));
    }
  };
};
