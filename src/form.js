'use strict';

var
  COOKIES_TIME_STARTING_POINT = new Date(1906, 11, 9),
  DEFAULT_MARK_ENTITY = 3;


var ReviewForm = function() {
  this.browserCookies = require('browser-cookies');

  this.formContainer = document.querySelector('.overlay-container');
  this.formCloseButton = document.querySelector('.review-form-close');
  this.reviewForm = document.querySelector('.review-form'); // форма
  this.reviewMarkCollection = this.reviewForm['review-mark']; // радиобатон оценка
  this.reviewName = this.reviewForm['review-name']; // поле Имя
  this.reviewText = this.reviewForm['review-text']; // поле Отзыв
  this.reviewSubmit = this.reviewForm.querySelector('.review-submit'); // кнопка Добавить
  this.reviewLeftFields = this.reviewForm.querySelector('.review-fields'); // контейнер блок "Осталось заполнить"
  this.reviewLeftName = this.reviewForm.querySelector('.review-fields-name'); // осталось заполнить имя
  this.reviewLeftText = this.reviewForm.querySelector('.review-fields-text'); // осталось заполнить отзыв
  this.isFormValid = false; // валидна ли форма
  this.isReviewTextRequired = false; // обязательно ли поле Отзыв
  this.classInvisible = 'invisible';

  this.onClose = null;

  this._isFieldsValid = this._isFieldsValid.bind(this);
  this._checkFromEventTarget = this._checkFromEventTarget.bind(this);
  this._submitReviewForm = this._submitReviewForm.bind(this);
  this.close = this.close.bind(this);
};

/**
 * @param {Function} cb
 */
ReviewForm.prototype.open = function(cb) {
  this._getReviewDefaultValue();
  this.formContainer.classList.remove('invisible');
  this._isFieldsValid();
  this._addListenters();
  cb();
};

ReviewForm.prototype.close = function() {
  this._removeListeners();
  this.formContainer.classList.add('invisible');

  if (typeof this.onClose === 'function') {
    this.onClose();
  }
};

/**
 * переключаем аттрибут
 * @param flagInputAttr
 * @param target
 * @param attr
 * @private
 */
ReviewForm.prototype._toggleFieldAttribute = function(flagInputAttr, target, attr) {
  if (flagInputAttr && !target.hasAttribute(attr)) {
    target.setAttribute(attr, '');
  } else if (!flagInputAttr && target.hasAttribute(attr)) {
    target.removeAttribute(attr);
  }
};

/**
 * переключаем видимость элемента "Осталось заполнить"
 * @param flagFieldVisibility
 * @param target
 * @private
 */
ReviewForm.prototype._toggleVisibility = function(flagFieldVisibility, target) {
  var temp = this.classInvisible;

  if (flagFieldVisibility && !target.classList.contains(temp)) {
    target.classList.add(temp);
  } else if (!flagFieldVisibility && target.classList.contains(temp)) {
    target.classList.remove(temp);
  }
};

/**
 * показываем либо скрываем поля блока "Осталось заполнить"
 * @private
 */
ReviewForm.prototype._toggleReviewsFields = function() {
  var reviewLeftTextHasToBeShown = !this.isReviewTextRequired ||
    (this.isReviewTextRequired && this.reviewText.validity.valid);
  this._toggleVisibility(reviewLeftTextHasToBeShown, this.reviewLeftText);

  var isReviewNameValid = (this.reviewName.validity.valid);
  this._toggleVisibility(isReviewNameValid, this.reviewLeftName);

  this._toggleVisibility(this.isFormValid, this.reviewLeftFields);
};

/**
 * проверка, валидны ли поля
 * @private
 */
ReviewForm.prototype._isFieldsValid = function() {
  this.isFormValid = (!this.isReviewTextRequired || this.reviewText.validity.valid) &&
    this.reviewName.validity.valid;

  this._toggleReviewsFields();
  this._toggleFieldAttribute(!this.isFormValid, this.reviewSubmit, 'disabled');
};

/**
 * проверка, нужно ли сделать поле Отзывы обязательным
 * @private
 */
ReviewForm.prototype._checkReviewMark = function() {
  this.isReviewTextRequired = +this.reviewMarkCollection.value < 3;

  this._toggleFieldAttribute(this.isReviewTextRequired, this.reviewText, 'required');
  this._toggleReviewsFields();
  this._isFieldsValid();
};

/**
 * Проверяем, на каком элементе сработало событие
 * @param e
 * @private
 */
ReviewForm.prototype._checkFromEventTarget = function(e) {
  if (e.target.name === 'review-mark') {
    this._checkReviewMark();
  }
};

/**
 * рассчитываем количество дней жизни куков
 * @returns {number}
 * @private
 */
ReviewForm.prototype._calcCookiesExpireDate = function() {
  var currentDate = new Date(),
    pointStartDate = COOKIES_TIME_STARTING_POINT;

  if (currentDate <= pointStartDate) {
    pointStartDate.setFullYear((currentDate.getFullYear() - 1));
  } else {
    pointStartDate.setFullYear(currentDate.getFullYear());
  }

  return Math.abs(Math.floor((currentDate - pointStartDate) / (1000 * 3600 * 24))); // милисекунды переводим в дни
};

/**
 * устанавливаем куки при сабмите формы
 * @private
 */
ReviewForm.prototype._submitReviewForm = function() {
  var expiresDays = this._calcCookiesExpireDate();

  this.browserCookies.set('review-mark', this.reviewMarkCollection.value, { expires: expiresDays });
  this.browserCookies.set('review-name', this.reviewName.value, { expires: expiresDays });
};

/**
 * забираем из куков значения для оценки и имени, если их нет, устанавливаем значения по умолчанию
 * @private
 */
ReviewForm.prototype._getReviewDefaultValue = function() {
  var defaultReviewData = {
    mark: this.browserCookies.get('review-mark') || DEFAULT_MARK_ENTITY,
    name: this.browserCookies.get('review-name') || ''
  };

  this._setReviewDefaultValue(defaultReviewData);
};

/**
 * устанавливаем полям начальные значения, а также запускаем валидацию
 * @param defaultData
 * @private
 */
ReviewForm.prototype._setReviewDefaultValue = function(defaultData) {
  this.reviewMarkCollection.value = +defaultData.mark;
  this.reviewName.value = defaultData.name;

  this._checkReviewMark();
};

ReviewForm.prototype._addListenters = function() {
  this.reviewName.addEventListener('input', this._isFieldsValid);
  this.reviewText.addEventListener('input', this._isFieldsValid);
  this.reviewForm.addEventListener('change', this._checkFromEventTarget);
  this.reviewForm.addEventListener('submit', this._submitReviewForm);
  this.formCloseButton.addEventListener('click', this.close);
};

ReviewForm.prototype._removeListeners = function() {
  this.reviewName.removeEventListener('input', this._isFieldsValid);
  this.reviewText.removeEventListener('input', this._isFieldsValid);
  this.reviewForm.removeEventListener('change', this._checkFromEventTarget);
  this.reviewForm.removeEventListener('submit', this._submitReviewForm);
};

ReviewForm.prototype.close = function() {
  this._removeListeners();
  this.formContainer.classList.add('invisible');
  if (typeof this.onClose === 'function') {
    this.onClose();
  }
};

module.exports = ReviewForm;
