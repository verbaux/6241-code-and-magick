'use strict';

var loadAvatar = function(src, onSuccess, onError, timeout) {
  var
    avatar = new Image(),
    avatarLoadTimeout;

  avatar.addEventListener('load', function() {
    clearTimeout(avatarLoadTimeout);
    onSuccess(avatar);
  });
  avatarLoadTimeout = setTimeout(onError, timeout);

  avatar.src = src;
};

module.exports = loadAvatar;
