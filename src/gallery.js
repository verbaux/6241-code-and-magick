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

  this.onClickControlClose = this.onClickControlClose.bind(this);
  this.onClickControlLeft = this.onClickControlLeft.bind(this);
  this.onClickControlRight = this.onClickControlRight.bind(this);
};

Gallery.prototype.onClickControlLeft = function() {
  if (this.activePicture === 0) {
    return;
  }
  this.activePicture -= 1;
  this.setActivePicture(this.activePicture);
};

Gallery.prototype.onClickControlRight = function() {
  if (this.activePicture === this.pictures.length - 1) {
    return;
  }
  this.activePicture += 1;
  this.setActivePicture(this.activePicture);
};

Gallery.prototype.show = function(currentPictureNumber) {
  this.controlClose.addEventListener('click', this.onClickControlClose);
  this.controlLeft.addEventListener('click', this.onClickControlLeft);
  this.controlRight.addEventListener('click', this.onClickControlRight);

  this.picturesCounter.innerHTML = this.pictures.length;
  this.galleryContainer.classList.remove('invisible');

  this.setActivePicture(currentPictureNumber);
};

Gallery.prototype.hide = function() {
  this.controlClose.removeEventListener('click', this.onClickControlClose);
  this.controlLeft.removeEventListener('click', this.onClickControlLeft);
  this.controlRight.removeEventListener('click', this.onClickControlRight);

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

Gallery.prototype.onClickControlClose = function() {
  this.hide();
};

module.exports = Gallery;
