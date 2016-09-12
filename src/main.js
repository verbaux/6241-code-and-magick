'use strict';

(function() {
  var initReviews = require('./reviews'),
    initForm = require('./form'),
    initGame = require('./game');

  var init = function() {
    var formOpenButton = document.querySelector('.reviews-controls-new');
    var gameContainer = document.querySelector('.demo');

    window.Game = initGame();
    window.game = new window.Game(gameContainer);

    window.form = initForm();

    formOpenButton.onclick = function(evt) {
      evt.preventDefault();

      window.form.open(function() {
        window.game.setGameStatus(window.Game.Verdict.PAUSE);
        window.game.setDeactivated(true);
      });
    };

    window.form.onClose = function() {
      window.game.setDeactivated(false);
    };

    window.game.initializeLevelAndStart();
    window.game.setGameStatus(window.Game.Verdict.INTRO);
  };

  init();
  initReviews();
})();
