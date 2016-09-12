'use strict';

module.exports = function() {
  return (function() {
    var browserCookies = require('browser-cookies');

    var DEFAULT_MARK_ENTITY = 3,
      COOKIES_TIME_STARTING_POINT = new Date(1906, 11, 9);

    var
      formContainer = document.querySelector('.overlay-container'),
      formCloseButton = document.querySelector('.review-form-close'),
      reviewForm = document.querySelector('.review-form'), // форма
      reviewMarkCollection = reviewForm['review-mark'], // радиобатон оценка
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
     * @param flagInputAttr
     * @param target
     * @param attr
     * @private
     */
    var _toggleFieldAttribute = function(flagInputAttr, target, attr) {
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

    /**
     * Проверяем, на каком элементе сработало событие
     * @param e
     * @private
     */
    var _checkFromEventTarget = function(e) {
      if (e.target.name === 'review-mark') {
        _checkReviewMark();
      }
    };

    /**
     * рассчитываем количество дней жизни куков
     * @returns {number}
     * @private
     */
    var _calcCookiesExpireDate = function() {
      var currentDate = new Date(),
        daysCounter = 0,
        pointStartDate = COOKIES_TIME_STARTING_POINT;

      if (currentDate <= pointStartDate) {
        pointStartDate.setFullYear((currentDate.getFullYear() - 1));
      } else {
        pointStartDate.setFullYear(currentDate.getFullYear());
      }

      daysCounter = Math.floor((currentDate - pointStartDate) / (1000 * 3600 * 24)); // милисекунды переводим в дни

      return Math.abs(daysCounter);
    };

    /**
     * устанавливаем куки при сабмите формы
     * @private
     */
    var _submitReviewForm = function() {
      var expiresDays = _calcCookiesExpireDate();

      browserCookies.set('review-mark', reviewMarkCollection.value, { expires: expiresDays });
      browserCookies.set('review-name', reviewName.value, { expires: expiresDays });
    };

    /**
     * вешаем обработчик события input на текстовые поля
     */
    reviewName.addEventListener('input', _isFieldsValid);
    reviewText.addEventListener('input', _isFieldsValid);

    /**
     * вешаем обработчик события change на reviewForm
     */
    reviewForm.addEventListener('change', _checkFromEventTarget);

    /**
     * вешаем обработчик события submit на reviewForm
     */
    reviewForm.addEventListener('submit', _submitReviewForm);

    /**
     * забираем из куков значения для оценки и имени, если их нет, устанавливаем значения по умолчанию
     * @private
     */
    var _getReviewDefaultValue = function() {
      var defaultReviewData = {
        mark: browserCookies.get('review-mark') || DEFAULT_MARK_ENTITY,
        name: browserCookies.get('review-name') || ''
      };

      _setReviewDefaultValue(defaultReviewData);
    };

    /**
     * устанавливаем полям начальные значения, а также запускаем валидацию
     * @param defaultData
     * @private
     */
    var _setReviewDefaultValue = function(defaultData) {
      reviewMarkCollection.value = +defaultData.mark;
      reviewName.value = defaultData.name;

      _checkReviewMark();
    };

    _getReviewDefaultValue();

    return form;
  })();
};
