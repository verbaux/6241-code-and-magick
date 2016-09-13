'use strict';

var Gallery = function(urlPicturesArray) {
  this.pictures = urlPicturesArray;
  this.activePicture = null;

  this.galleryContainer = document.querySelector('.overlay-gallery');
  this.galleryPictureBox = this.galleryContainer.querySelector('.overlay-gallery-preview');
  this.currentPictureNumber = this.galleryContainer.querySelector('.preview-number-current');
  this.picturesCounter = this.galleryContainer.querySelector('.preview-number-total');
  this.controlLeft = this.galleryContainer.querySelector('.overlay-gallery-control-left');
  this.controlRight = this.galleryContainer.querySelector('.overlay-gallery-control-right');
  this.controlClose = this.galleryContainer.querySelector('.overlay-gallery-close');

  var _self = this;

  this._onClickControlClose = function() {
    _self.hide();
  };

  this._onClickControlLeft = function() {
    if (_self.activePicture === 0) {
      return;
    }
    _self.activePicture -= 1;
    _self.setActivePicture(_self.activePicture);
  };

  this._onClickControlRight = function() {
    if (_self.activePicture === _self.pictures.length - 1) {
      return;
    }
    _self.activePicture += 1;
    _self.setActivePicture(_self.activePicture);
  };
};

Gallery.prototype.show = function(currentPictureNumber) {
  this.controlClose.addEventListener('click', this._onClickControlClose);
  this.controlLeft.addEventListener('click', this._onClickControlLeft);
  this.controlRight.addEventListener('click', this._onClickControlRight);

  this.picturesCounter.innerHTML = this.pictures.length;
  this.galleryContainer.classList.remove('invisible');

  this.setActivePicture(currentPictureNumber);
};

Gallery.prototype.hide = function() {
  this.controlClose.removeEventListener('click', this._onClickControlClose);
  this.controlLeft.removeEventListener('click', this._onClickControlLeft);
  this.controlRight.removeEventListener('click', this._onClickControlRight);

  this.galleryContainer.classList.add('invisible');
};

Gallery.prototype.setActivePicture = function(currentPictureNumber) {
  this.activePicture = currentPictureNumber;

  if (this.activePictureElem) {
    this.galleryPictureBox.removeChild(this.activePictureElem);
  }

  this.activePictureElem = new Image();
  this.activePictureElem.src = this.pictures[this.activePicture];
  this.currentPictureNumber.innerHTML = this.activePicture + 1;

  this.galleryPictureBox.appendChild(this.activePictureElem);
};

module.exports = Gallery;
