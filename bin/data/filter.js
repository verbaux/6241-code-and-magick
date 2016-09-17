'use strict';

module.exports = function(list, filterID) {
  var
    recentDate = new Date() - 1000 * 3600 * 24 * 3, // недавно - это последние три дня
    filteredList = list;

  switch (filterID) {
    case 'reviews-recent':
      filteredList = filteredList.filter(function(review) {
        return review.created >= recentDate;
      });

      filteredList.sort(function(a, b) {
        return b.created - a.created;
      });
      break;

    case 'reviews-good':
      filteredList = filteredList.filter(function(item) {
        return item.rating >= 3;
      });

      filteredList.sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;

    case 'reviews-bad':
      filteredList = filteredList.filter(function(item) {
        return item.rating < 3;
      });

      filteredList.sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;

    case 'reviews-popular':
      filteredList.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }

  return filteredList;
};
