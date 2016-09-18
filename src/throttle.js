'use strict';

/**
* throttle
* @param {function} func
* @param {Number} timeout
*/
var throttle = function(func, timeout) {
  var lastCall = 0;

  return function() {
    var now = Date.now();
    if (now >= lastCall + timeout) {
      lastCall = now;
      func.apply(this, Array.prototype.slice.call(arguments));
    }
  };
};

module.exports = throttle;
