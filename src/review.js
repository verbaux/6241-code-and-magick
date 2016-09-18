'use strict';

var Review = function(data, reviewElement) {
  this.data = data;
  this.element = reviewElement;
  this.loadAvatar = require('./load-avatar');

  this.loadTimeout = '1000';
  this.classImgLoadError = 'review-load-failure';
  this.ratingEntity = {
    '1': '',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five'
  };

  this.onLoadAvatarSuccess = this.onLoadAvatarSuccess.bind(this);
  this.onLoadAvatarError = this.onLoadAvatarError.bind(this);
};

Review.prototype.toggleCurrentReview = function(evt) {
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

Review.prototype.onLoadAvatarSuccess = function(image) {
  var img = this.element.querySelector('.review-author');
  img.src = image.src;
  img.width = img.height = 124;
  img.title = this.data.author.name;
  img.alt = this.data.author.name;
};

Review.prototype.onLoadAvatarError = function() {
  this.element.classList.add(this.classImgLoadError);
};

Review.prototype.draw = function() {
  var _elem = this.element.cloneNode(true);
  var ratingEntity = this.data.rating;

  if (ratingEntity > 0) {
    _elem.querySelector('.review-rating').classList.add('review-rating-' + this.ratingEntity[ratingEntity]);
  }
  _elem.querySelector('.review-text').textContent = this.data.description;

  this.loadAvatar(this.data.author.picture, this.onLoadAvatarSuccess, this.onLoadAvatarError, this.loadTimeout);

  this.element = _elem;
  this.addQuizListener();
};

Review.prototype.addQuizListener = function() {
  var quizBox = this.element.querySelector('.review-quiz');

  quizBox.addEventListener('click', this.toggleCurrentReview);
};

Review.prototype.removeQuizListener = function() {
  var quizBox = this.element.querySelector('.review-quiz');
  quizBox.removeEventListener('click', this.toggleCurrentReview);
};

Review.prototype.destroyReview = function() {
  this.removeQuizListener();
  this.element.parentNode.removeChild(this.element);
  this.element = null;
  this.data = null;
};

module.exports = Review;
