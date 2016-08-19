'use strict';

window.form = (function() {
  var formContainer = document.querySelector('.overlay-container'),
    formCloseButton = document.querySelector('.review-form-close'),
    reviewForm = document.querySelector('.review-form'), // форма
    reviewMarkCollection = reviewForm['review-mark'], // радиобатон оценка
    reviewTextFields = reviewForm.querySelectorAll('.review-form-field'), // все текстовые поля
    reviewName = reviewForm['review-name'], // поле Имя
    reviewText = reviewForm['review-text'], // поле Отзыв
    reviewSubmit = reviewForm.querySelector('.review-submit'), // кнопка Добавить
    reviewLeftFields = reviewForm.querySelector('.review-fields'), // контейнер блок "Осталось заполнить"
    reviewLeftName = reviewForm.querySelector('.review-fields-name'), // осталось заполнить имя
    reviewLeftText = reviewForm.querySelector('.review-fields-text'), // осталось заполнить отзыв
    isFormValid = false, // валидна ли форма
    isReviewTextRequired = false, // обязательно ли поле Отзыв
    classInvisible = 'invisible';

  var form = {
    onClose: null,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  /**
   * переключаем аттрибут
   * @param glagInputAttr
   * @param target
   * @param attr
   * @private
   */
  var _toggleFieldAttribute = function(glagInputAttr, target, attr) {
    if (glagInputAttr && !target.hasAttribute(attr)) {
      target.setAttribute(attr, '');
    } else if (!glagInputAttr && target.hasAttribute(attr)) {
      target.removeAttribute(attr);
    }
  };

  /**
   * переключаем видимость элемента "Осталось заполнить"
   * @param flagFieldVisibility
   * @param target
   * @private
   */
  var _toggleVisibility = function(flagFieldVisibility, target) {
    if (flagFieldVisibility && !target.classList.contains(classInvisible)) {
      target.classList.add(classInvisible);
    } else if (!flagFieldVisibility && target.classList.contains(classInvisible)) {
      target.classList.remove(classInvisible);
    }
  };

  /**
   * показываем либо скрываем поля блока "Осталось заполнить"
   * @private
   */
  var _toggleReviewsFields = function() {
    var reviewLeftTextHasToBeShown = !isReviewTextRequired ||
      (isReviewTextRequired && reviewText.validity.valid);
    _toggleVisibility(reviewLeftTextHasToBeShown, reviewLeftText);

    var isReviewNameValid = (reviewName.validity.valid);
    _toggleVisibility(isReviewNameValid, reviewLeftName);

    _toggleVisibility(isFormValid, reviewLeftFields);
  };

  /**
   * проверка, валидны ли поля
   * @private
   */
  var _isFieldsValid = function() {
    isFormValid = (!isReviewTextRequired || reviewText.validity.valid) &&
      reviewName.validity.valid;

    _toggleReviewsFields();
    _toggleFieldAttribute(!isFormValid, reviewSubmit, 'disabled');
  };

  /**
   * проверка, нужно ли сделать поле Отзывы обязательным
   * @private
   */
  var _checkReviewMark = function() {
    isReviewTextRequired = +reviewMarkCollection.value < 3;

    _toggleFieldAttribute(isReviewTextRequired, reviewText, 'required');
    _toggleReviewsFields();
    _isFieldsValid();
  };

  var _checkFromEventTarget = function(e) {
    if (e.target.name === 'review-mark') {
      _checkReviewMark();
    }
  };

  /**
   * вешаем обработчик события input на текстовые поля
   */
  reviewTextFields.forEach(function(item) {
    item.addEventListener('input', _isFieldsValid);
  });

  /**
   * вешаем обработчик события change на reviewForm
   */
  reviewForm.addEventListener('change', _checkFromEventTarget);

  return form;
})();
