'use strict';

module.exports = function(reviewElement, data) {
  var
    IMAGE_LOAD_TIMEOUT = '1000',
    classImgLoadError = 'review-load-failure',
    ratingEntity = {
      '1': '',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five'
    }; // модификатор класса рейтинга

  var elem = reviewElement.cloneNode(true);

  elem.querySelector('.review-rating').classList.add('review-rating-' + ratingEntity[data.rating]);
  elem.querySelector('.review-text').textContent = data.description;

  var
    avatarElem = elem.querySelector('.review-author'),
    avatar = new Image(),
    avatarLoadTimeout;

  avatar.alt = avatar.title = data.author.name;

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
