var getMessage = function(a, b) {
  var typeOfA = typeof(a),
    typeOfB = typeof(b),
    message = '';

  var countDistanceSteps = function(a) {
    var stepCounter = 0;
    for (var i = 0; i < a.length; i++) {
      stepCounter += a[i];
    }
    return stepCounter;
  };

  var countDistanceMeters = function(a, b) {
    var metersCounter = 0;
    for (var i = 0; i < a.length; i++) {
      metersCounter += a[i] * b[i];
    }
    return metersCounter;
  };

  if (typeOfA == 'boolean') {
      if (a === true) {
          message = 'Я попал в ' + b;
      } else {
          message = 'Я никуда не попал';
      }
  }

  if (typeOfA == 'number') {
      message = 'Я прыгнул на ' + a * 100 + ' сантиметров';
  }

  if (typeOfA == 'object') {
      if (typeOfB == 'object') {
          message = 'Я прошел ' + countDistanceMeters(a, b) + ' метров';
      } else {
          message = 'Я прошел ' + countDistanceSteps(a) + ' шагов';
      }
  }

  return message;
};
