(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('LBSFrontend', factory) :
	(global.LBSFrontend = factory());
}(this, (function () { 'use strict';

function Card ($module) {
  this.$module = $module;
}

/**
 * Initialise header
 *
 * Check for the presence of cards - if any are
 * missing then there's nothing to do so return early.
 */
Card.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (this.$module.classList.contains('lbs-card--clickable')) {
    this.handleClickable();
  }
  if (this.$module.querySelector('.js__is-hidden')) {
    this.showAllItems();
  }
  // this.setHeight()
};

Card.prototype.handleClickable = function () {
  if (this.$module.querySelector('a') !== null) {
    this.$module.addEventListener('click', () => {
      this.$module.querySelector('a').click();
    });
  }
};

Card.prototype.showAllItems = function () {
  // todo - consider moving focus to previously hidden items on toggle
  const module = this.$module;
  const itemCount = this.$module.querySelectorAll('.js__is-hidden').length;
  const showMoreHtml = document.createElement('a');
  showMoreHtml.innerText = 'Show more items (' + itemCount + ')';
  showMoreHtml.setAttribute('class', 'show-more-link');
  showMoreHtml.setAttribute('href', '#');
  showMoreHtml.addEventListener('click', function (e) {
    module.querySelector('ul').classList.add('show-hidden');
    module.removeChild(this);
    e.preventDefault();
  });
  this.$module.append(showMoreHtml);
};

Card.prototype.setHeight = function () {
  // todo - consider adding parameter to ignore certain items (opt in)
  let tallestCard = 0;
  document.querySelectorAll('.lbs-card').forEach(card => {
    if (card.clientHeight > tallestCard) {
      const cs = getComputedStyle(card);
      tallestCard = card.clientHeight - (parseFloat(cs.paddingBottom));
    }
  });
  document.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach(x => {
    x.style.minHeight = tallestCard + 'px';
  });
};

return Card;

})));