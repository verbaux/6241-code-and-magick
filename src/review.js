'use strict';

var Review = function(data, reviewElement) {
  this.data = data;
  this.element = reviewElement;

  this.loadTimeout = '1000';
  this.classImgLoadError = 'review-load-failure';
  this.ratingEntity = {
    '1': '',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five'
  };

  /**
   * @param evt
   * @private
   */
  this._onToggleCurrentReview = function(evt) {
    var
      reviewClassQuiz = 'review-quiz-answer',
      reviewClassActiveQuiz = 'review-quiz-answer-active',
      reviewsQuizCollection;

    if (evt.target.classList.contains(reviewClassQuiz)) {
      reviewsQuizCollection = evt.currentTarget.querySelectorAll('.' + reviewClassQuiz);
      reviewsQuizCollection.forEach(function(quiz) {
        if (quiz === evt.target) {
          quiz.classList.add(reviewClassActiveQuiz);
        } else {
          quiz.classList.remove(reviewClassActiveQuiz);
        }
      });
    }
  };
};

Review.prototype.draw = function() {
  var _elem = this.element.cloneNode(true);
  var _self = this;

  _elem.querySelector('.review-rating').classList.add('review-rating-' + this.ratingEntity[this.data.rating]);
  _elem.querySelector('.review-text').textContent = this.data.description;

  var
    avatarElem = _elem.querySelector('.review-author'),
    avatar = new Image(),
    avatarLoadTimeout;

  avatar.addEventListener('load', function(evt) {
    clearTimeout(avatarLoadTimeout);
    avatarElem.width = avatarElem.height = 124;
    avatarElem.src = evt.target.src;
    avatarElem.alt = avatarElem.title = _self.data.author.name;
  });

  avatar.addEventListener('error', function() {
    _elem.classList.add(_self.classImgLoadError);
  });

  avatar.src = this.data.author.picture;


  avatarLoadTimeout = setTimeout(function() {
    avatar.src = '';
    _elem.classList.add(_self.classImgLoadError);
  }, _self.loadTimeout);

  this.element = _elem;
  this.addQuizListener();
};

Review.prototype.addQuizListener = function() {
  var quizBox = this.element.querySelector('.review-quiz');

  quizBox.addEventListener('click', this._onToggleCurrentReview);
};

Review.prototype.removeQuizListener = function() {
  var quizBox = this.element.querySelector('.review-quiz');
  quizBox.removeEventListener('click', this._onToggleCurrentReview);
};

Review.prototype.destroyReview = function() {
  this.removeQuizListener();
  this.element.parentNode.removeChild(this.element);
  this.element = null;
  this.data = null;
};

module.exports = Review;
