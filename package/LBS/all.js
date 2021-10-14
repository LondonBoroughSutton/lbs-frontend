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
function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

const settings = {
  minWidth: '40.0625em'
};

// Common function to only show a subset of items and insert CTA to show them

function ShowMore ($module) {
  this.$module = $module;
}

ShowMore.prototype.init = function () {
  this.hideItems();
  if (this.$module.getAttribute('data-show-more')) {
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
};

ShowMore.prototype.hideItems = function () {
  const count = parseInt(this.$module.getAttribute('data-show-count')) || 6; // Roadmap item - add data item to dictate how many items to show
  this.$module.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach((x, index) => {
    if (index >= count) {
      x.parentNode.classList.add('js__is-hidden');
    }
  });
};

ShowMore.prototype.addCallToAction = function () {
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
  new ShowMore(this.$module).init();
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
};

Cards.prototype.setupCardWrapper = function () {
  console.log('Card setup');
};

Cards.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.minWidth + ')');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Cards.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setHeight();
    new ShowMore(this.$module).init();
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
      tallestCard = card.offsetHeight - (parseFloat(cs.paddingBottom));
    }
  });
  document.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach(x => {
    x.style.minHeight = tallestCard + 'px';
  });
};

function Header ($module) {
  this.$module = $module;
  this.$searchButton = $module && $module.querySelector('#lbs-header__mobile__search-btn');
  this.$menuButton = $module && $module.querySelector('#lbs-header__mobile__menu-btn');
  this.$menu = this.$menuButton && $module.querySelector(
    '#' + this.$menuButton.getAttribute('aria-controls')
  );
  this.$search = this.$searchButton && $module.querySelector(
    '#' + this.$searchButton.getAttribute('aria-controls')
  );
}

/**
 * Initialise header
 *
 * Check for the presence of the header, menu and menu button – if any are
 * missing then there's nothing to do so return early.
 */
Header.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (this.$menuButton) {
    this.syncState(this.$menuButton, this.$menu.classList.contains('active'));
    this.$menuButton.addEventListener('click', this.handleMenuButtonClick.bind(this));
  }
  if (this.$searchButton) {
    this.syncState(this.$searchButton, this.$search.classList.contains('active'));
    this.$searchButton.addEventListener('click', this.handleSearchButtonClick.bind(this));
  }

  // The following implementation is from https://www.w3.org/WAI/tutorials/menus/flyout/#flyoutnavmousefixed - understood to be accessible and current best practice
  const menuItems = document.querySelectorAll('li[data-has-submenu]');
  Array.prototype.forEach.call(menuItems, function (el, i) {
    el.querySelector('a').addEventListener('click', function (event) {
      if (this.parentNode.getAttribute('data-has-submenu') === 'true' && this.parentNode.getAttribute('data-submenu-open') !== 'true') {
        this.parentNode.setAttribute('data-submenu-open', true);
        this.setAttribute('aria-expanded', 'true');
      } else {
        this.parentNode.setAttribute('data-submenu-open', false);
        this.setAttribute('aria-expanded', 'false');
      }
      event.preventDefault();
      return false
    });
    let checkIfMenuIsOpen = null;
    const links = el.querySelectorAll('a');
    Array.prototype.forEach.call(links, function (el, i) {
      el.addEventListener('focus', function () {
        if (checkIfMenuIsOpen) {
          clearTimeout(checkIfMenuIsOpen);
          checkIfMenuIsOpen = null;
        }
      });
      el.addEventListener('blur', function (event) {
        checkIfMenuIsOpen = setTimeout(function () {
          const opennav = document.querySelector("li[data-submenu-open='true']");
          if (opennav) {
            opennav.setAttribute('data-submenu-open', false);
            opennav.querySelector('a').setAttribute('aria-expanded', 'false');
          }
        }, 10);
      });
    });
  });
};

/**
 * Sync menu state
 *
 * Sync the menu button class and the accessible state of the menu and the menu
 * button with the visible state of the menu
 *
 * @param {object} button The button sync is being applied to (search or menu)
 * @param {boolean} isVisible Whether the menu is currently visible
 */
Header.prototype.syncState = function (button, isVisible) {
  // console.log(button)
  button.classList.toggle('active', isVisible);
  button.setAttribute('aria-expanded', isVisible);
};

/**
 * Handle menu button click
 *
 * When the menu button is clicked, change the visibility of the menu and then
 * sync the accessibility state and menu button state
 */
Header.prototype.handleMenuButtonClick = function () {
  const isVisible = this.$menu.classList.toggle('active');
  this.syncState(this.$menuButton, isVisible);
  if (this.$search.classList.contains('active')) {
    this.syncState(this.$searchButton, this.$search.classList.toggle('active'));
  }
};

/**
 * Handle search button click
 *
 * When the search button is clicked, change the visibility of the search form and then
 * sync the accessibility state and search button state
 */
Header.prototype.handleSearchButtonClick = function () {
  const isVisible = this.$search.classList.toggle('active');
  this.syncState(this.$searchButton, isVisible);
  this.$module.querySelector('#lbs-search__box').focus();
  if (this.$menu.classList.contains('active')) {
    this.syncState(this.$menuButton, this.$menu.classList.toggle('active'));
  }
};

function Search ($module) {
  this.$module = $module;
}

function Tabs ($module) {
  this.$module = $module;
  this.$tabs = $module.querySelectorAll('.lbs-tabs__tab');
  this.$panels = $module.querySelectorAll('.lbs-tabs__content__item');
  this.activePanelClass = 'lbs-tabs__content__item--active';
  this.activeTabClass = 'lbs-tabs__list-item--selected';
}

/**
 * Initialise tabs
 *
 * Check for the presence of tabs - if any are
 * missing then there's nothing to do so return early.
 */
// Tabs.prototype.init = function () {
//   if (!this.$module) {
//     return
//   }
//   // Add media query and bind event listener for change?
//   this.setupTabs()
//   this.setupAccordion()
// }

Tabs.prototype.init = function () {
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  } else {
    this.setupTabs();
  }
};

Tabs.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.minWidth + ')');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Tabs.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.teardownAccordion();
    this.setupTabs();
  } else {
    this.teardownTabs();
    this.setupAccordion();
  }
};

Tabs.prototype.setupTabs = function () {
  const $module = this.$module;
  const $tabs = this.$tabs;
  const $tabList = $module.querySelector('.lbs-tabs__list');
  const $tabListItems = $module.querySelectorAll('.lbs-tabs__list-item');
  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }
  $tabList.setAttribute('role', 'tablist');

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab) {
    // Set HTML attributes
    this.setAttributes($tab);

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this);

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true);
  }.bind(this));
};

Tabs.prototype.setupAccordion = function () {
  const $panels = this.$panels;
  if (!$panels) {
    return
  }

  nodeListForEach($panels, function ($panel) {
    // Set HTML attributes
    this.setAccordionAttributes($panel);

    // Save bounded functions to use when removing event listeners during teardown
    $panel.boundTabClick = this.onAccordionClick.bind(this);

    // Handle events
    $panel.addEventListener('click', $panel.boundTabClick, true);
  }.bind(this));
};

Tabs.prototype.teardownTabs = function () {
  const $module = this.$module;
  const $tabs = this.$tabs;
  const $tabList = $module.querySelector('.lbs-tabs__list');
  const $tabListItems = $module.querySelectorAll('.lbs-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.removeAttribute('role');

  nodeListForEach($tabListItems, function ($item) {
    $item.removeAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab) {
    // Remove events
    $tab.removeEventListener('click', $tab.boundTabClick, true);

    // Unset HTML attributes
    this.unsetAttributes($tab);
  }.bind(this));
};

Tabs.prototype.teardownAccordion = function () {
  const $panels = this.$panels;
  if (!$panels) {
    return
  }
  if (!$panels) {
    return
  }
  nodeListForEach($panels, function ($panel) {
    // Remove events
    $panel.removeEventListener('click', $panel.boundTabClick, true);

    // Unset HTML attributes
    this.unsetAccordionAttributes($panel);
  }.bind(this));
};

Tabs.prototype.setAttributes = function ($tab) {
  // set tab attributes
  const panelId = $tab.getAttribute('data-lbs-tab-id');
  $tab.setAttribute('id', 'tab_' + panelId);
  $tab.setAttribute('role', 'tab');
  $tab.setAttribute('aria-controls', 'panel_tab_' + panelId);
  $tab.setAttribute('aria-selected', 'false');

  // set panel attributes
  const $panel = this.getPanel($tab);
  $panel.setAttribute('id', 'panel_' + $tab.id);
  $panel.setAttribute('role', 'tabpanel');
  $panel.setAttribute('aria-labelledby', $tab.id);
};

Tabs.prototype.setAccordionAttributes = function ($panel) {
  // set tab attributes
  $panel.querySelector('.lbs-tabs__content__item__container').setAttribute('aria-expanded', false);
  $panel.querySelector('.lbs-tabs__content__item__title').setAttribute('aria-role', 'button');
};

Tabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id');
  $tab.removeAttribute('role');
  $tab.removeAttribute('aria-controls');
  $tab.removeAttribute('aria-selected');
  $tab.removeAttribute('tabindex');

  // unset panel attributes
  const $panel = this.getPanel($tab);
  $panel.removeAttribute('role');
  $panel.removeAttribute('aria-labelledby');
};

Tabs.prototype.unsetAccordionAttributes = function ($panel) {
  $panel.querySelector('.lbs-tabs__content__item__container').removeAttribute('aria-expanded');
  $panel.querySelector('.lbs-tabs__content__item__title').removeAttribute('aria-role');
};

Tabs.prototype.hideTab = function ($tab) {
  const theTarget = this.$module.querySelector('.lbs-tabs__list-item a[data-lbs-tab-id="' + $tab.getAttribute('data-lbs-tab-id') + '"]');
  this.unhighlightTab(theTarget);
  this.hidePanel($tab);
};

Tabs.prototype.showTab = function ($tab) {
  const theTarget = this.$module.querySelector('.lbs-tabs__list-item a[data-lbs-tab-id="' + $tab.getAttribute('data-lbs-tab-id') + '"]');
  this.highlightTab(theTarget);
  this.showPanel($tab);
};

Tabs.prototype.onTabClick = function (e) {
  if (!e.target.classList.contains('lbs-tabs__tab')) {
    // Allow events on child DOM elements to bubble up to tab parent
    return false
  }
  e.preventDefault();
  const $newTab = e.target;
  const $currentTab = this.getCurrentTab();
  this.hideTab($currentTab);
  this.showTab($newTab);
};

Tabs.prototype.onAccordionClick = function (e) {
  e.preventDefault();
  const $newPanel = e.target.parentNode;
  const $currentPanel = this.getCurrentPanel();
  this.hideAccordionPanel($currentPanel);
  this.showAccordionPanel($newPanel);
};

Tabs.prototype.getCurrentTab = function () {
  return this.$module.querySelector('.' + this.activeTabClass + ' .lbs-tabs__tab')
};

Tabs.prototype.getCurrentPanel = function () {
  return this.$module.querySelector('.' + this.activePanelClass)
};

Tabs.prototype.getPanel = function ($tab) {
  return this.$module.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="' + $tab.getAttribute('data-lbs-tab-id') + '"]')
};

Tabs.prototype.showPanel = function ($tab) {
  const $panel = this.getPanel($tab);
  $panel.classList.add(this.activePanelClass);
};

Tabs.prototype.hidePanel = function ($tab) {
  const $panel = this.getPanel($tab);
  $panel.classList.remove(this.activePanelClass);
};

Tabs.prototype.showAccordionPanel = function ($panel) {
  $panel.setAttribute('aria-expanded', true);
  $panel.classList.add(this.activePanelClass);
};

Tabs.prototype.hideAccordionPanel = function ($panel) {
  $panel.setAttribute('aria-expanded', false);
  $panel.classList.remove(this.activePanelClass);
};

Tabs.prototype.unhighlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'false');
  $tab.parentNode.classList.remove(this.activeTabClass);
};

Tabs.prototype.highlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'true');
  $tab.parentNode.classList.add(this.activeTabClass);
  $tab.blur();
};

function initAll (options) {
  // Set the options to an empty object by default if no options are passed.
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  const scope = typeof options.scope !== 'undefined' ? options.scope : document;

  const $headers = scope.querySelectorAll('.lbs-header');
  nodeListForEach($headers, function ($header) {
    new Header($header).init();
  });

  const $tabs = scope.querySelectorAll('.lbs-tabs');
  nodeListForEach($tabs, function ($tabGroup) {
    new Tabs($tabGroup).init();
  });

  const $cards = scope.querySelectorAll('.lbs-card');
  nodeListForEach($cards, function ($card) {
    new Card($card).init();
  });
  // new Card().setHeight()
  const $cardContainers = scope.querySelectorAll('.lbs-card__wrapper');
  nodeListForEach($cardContainers, function ($cardContainer) {
    new Cards($cardContainer).init();
  });

  // let $showMoreWrappers = scope.querySelectorAll('[data-show-more]')
  // nodeListForEach($showMoreWrappers, function ($showMoreWrapper) {
  //   new ShowMore($showMoreWrapper).init()
  // })
}

exports.initAll = initAll;
exports.Card = Card;
exports.Header = Header;
exports.Search = Search;
exports.ShowMore = ShowMore;
exports.Tabs = Tabs;

})));
