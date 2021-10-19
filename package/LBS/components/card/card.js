(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('LBSFrontend', ['exports'], factory) :
	(factory((global.LBSFrontend = {})));
}(this, (function (exports) { 'use strict';

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */

const settings = {
  minWidth: '40.0625em'
};

// Common function to only show a subset of items and insert CTA to show them

function ShowMore ($module) {
  this.$module = $module;
}

ShowMore.prototype.init = function () {
  const count = this.$module.getAttribute('data-show-count') || 6; // Roadmap item - add data item to dictate how many items to show
  this.hideItems(count);
  if (this.$module.getAttribute('data-show-more') && count !== '0') {
    if (this.$module.querySelector('.js__is-hidden')) {
      this.addCallToAction();
      if (this.$module.getAttribute('data-show-more-type')) {
        if (this.$module.getAttribute('data-show-more-position')) {
          this.addClassToCallToAction(this.$module.getAttribute('data-show-more-type'), this.$module.getAttribute('data-show-more-position'));
        } else {
          this.addClassToCallToAction(this.$module.getAttribute('data-show-more-type'));
        }
      }
      this.addAriaAttributes();
    }
  }
};

ShowMore.prototype.hideItems = function (count) {
  this.$module.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach((x, index) => {
    if (index >= count && count != 0) {
      x.parentNode.classList.add('js__is-hidden');
    }
  });
};

ShowMore.prototype.addCallToAction = function () {
  console.log('hit');
  const module = this.$module;
  const itemCount = this.$module.querySelectorAll('.js__is-hidden').length;
  const showMoreHtml = document.createElement('a');
  showMoreHtml.innerText = 'Show more items (' + itemCount + ')';
  showMoreHtml.setAttribute('class', 'show-more-link');
  showMoreHtml.setAttribute('href', '#');
  showMoreHtml.setAttribute('aria-controls', module.id);
  showMoreHtml.setAttribute('role', 'button');
  showMoreHtml.addEventListener('click', function (e) {
    e.preventDefault();
    module.classList.add('show-hidden');
    try {
      module.removeChild(this);
    } catch (err) {
      module.parentNode.removeChild(this);
    }
    module.setAttribute('aria-expanded', true);
    module.querySelector('.js__is-hidden a').focus();
  });
  if (this.$module.getAttribute('data-show-more-position') === 'after') {
    module.insertAdjacentElement('afterend', showMoreHtml);
  } else {
    module.append(showMoreHtml);
  }
};

ShowMore.prototype.addClassToCallToAction = function (classes, position) {
  const module = this.$module;

  DOMTokenList.prototype.addMany = function (classes) {
    const array = classes.split(' ');
    for (let i = 0, length = array.length; i < length; i++) {
      this.add(array[i]);
    }
  };
  if (position === 'after') {
    module.nextElementSibling.classList.addMany(classes);
  } else {
    module.querySelector('.show-more-link').classList.addMany(classes);
  }
};

ShowMore.prototype.addAriaAttributes = function () {
  const module = this.$module;
  module.setAttribute('aria-expanded', false);
};

function Card ($module) {
  this.$module = $module;
}

// All cards in collection
function Cards ($module) {
  this.$module = $module;
}

/**
 * Initialise Card
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

/**
 * Initialise Cards
 *
 * Check for the presence of card wrappers - if any are
 * present, perform common actions such as setting common heights
 */

Cards.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  } else {
    this.setupCardWrapper();
  }
  new ShowMore(this.$module).init();
};

Cards.prototype.setupCardWrapper = function () {

};

Cards.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.minWidth + ')');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Cards.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setHeight();
    this.setupCardWrapper();
  } else {
    this.teardownCards();
  }
};

Cards.prototype.teardownCards = function () {
  document.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach(x => {
    x.removeAttribute('style');
  });
};

Cards.prototype.setHeight = function () {
  // todo - consider adding parameter to ignore certain items (opt in)
  let tallestCard = 0;
  document.querySelectorAll('.lbs-card').forEach(card => {
    if (card.clientHeight > tallestCard) {
      const cs = window.getComputedStyle(card);
      tallestCard = card.clientHeight - (parseFloat(cs.paddingBottom));
    }
  });
  document.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach(x => {
    x.style.minHeight = tallestCard + 'px';
  });
};

exports.Cards = Cards;
exports.default = Card;

})));
