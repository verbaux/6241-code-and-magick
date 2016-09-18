'use strict';

(function() {
  var initReviews = require('./reviews'),
    ReviewForm = require('./form'),
    initGame = require('./game'),
    PhotoGallery = require('./gallery');

  var init = function() {
    var formOpenButton = document.querySelector('.reviews-controls-new');
    var gameContainer = document.querySelector('.demo');

    window.Game = initGame();
    window.game = new window.Game(gameContainer);

    window.form = new ReviewForm();

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

  var initGallery = function() {
    var galleryContainer = document.querySelector('.photogallery'),
      galleryPicturesArray = galleryContainer.querySelectorAll('.photogallery-image img'),
      urlPicturesArray = [],
      currentPictureNumber = 0;

    galleryPicturesArray.forEach(function(urlPicture) {
      urlPicturesArray.push(urlPicture.src);
    });

    galleryContainer.addEventListener('click', function(evt) {
      evt.preventDefault();

      var clickTarget = evt.target;
      if (!clickTarget.src) {
        return;
      }

      currentPictureNumber = urlPicturesArray.indexOf(clickTarget.src);
      gallery.show(currentPictureNumber);
    });

    var gallery = new PhotoGallery(urlPicturesArray);
  };

  init();
  initReviews();
  initGallery();
})();
