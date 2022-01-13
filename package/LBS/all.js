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
  minWidth: '40.0625em',
  desktop: '48.0625em'
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
      this.addAriaAttributes();
    }
  }
};

ShowMore.prototype.hideItems = function (count) {
  this.$module.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach((x, index) => {
    if (index >= count && parseInt(count) !== 0) {
      x.parentNode.classList.add('js__is-hidden');
    }
  });
};

ShowMore.prototype.classToAdd = function () {
  if (this.$module.getAttribute('data-show-more-type')) {
    if (this.$module.getAttribute('data-show-more-position')) {
      this.addClassToCallToAction(this.$module.getAttribute('data-show-more-type'), this.$module.getAttribute('data-show-more-position'));
    } else {
      this.addClassToCallToAction(this.$module.getAttribute('data-show-more-type'));
    }
  }
};

ShowMore.prototype.addCallToAction = function () {
  const module = this.$module;
  const that = this;
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
    that.addShowLessCallToAction();
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
  this.classToAdd();
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

ShowMore.prototype.addShowLessCallToAction = function () {
  const module = this.$module;
  const that = this;
  const showLessHtml = document.createElement('a');
  showLessHtml.innerText = 'Show less items';
  showLessHtml.setAttribute('class', 'show-more-link');
  showLessHtml.setAttribute('href', '#');
  showLessHtml.setAttribute('aria-controls', module.id);
  showLessHtml.setAttribute('role', 'button');
  showLessHtml.addEventListener('click', function (e) {
    e.preventDefault();
    module.classList.remove('show-hidden');
    that.hideItems();
    that.addCallToAction();
    try {
      module.removeChild(this);
    } catch (err) {
      module.parentNode.removeChild(this);
    }
    module.setAttribute('aria-expanded', false);
  });
  if (this.$module.getAttribute('data-show-more-position') === 'after') {
    module.insertAdjacentElement('afterend', showLessHtml);
  } else {
    module.append(showLessHtml);
  }
  this.classToAdd();
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
  if (this.$module.getAttribute('data-show-more')) {
    new ShowMore(this.$module).init();
  }
};

Cards.prototype.setupCardWrapper = function () {

};

Cards.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.minWidth + ')');
  this.mql.addListener(this.checkMode.bind(this));
  const that = this;
  this.checkMode();
  window.onresize = function () {
    that.checkMode();
  };
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
  this.$module.querySelectorAll('.lbs-card').forEach(card => {
    card.style.minHeight = '0';
    if (card.clientHeight > tallestCard) {
      const cs = window.getComputedStyle(card);
      tallestCard = card.clientHeight - (parseFloat(cs.paddingBottom));
    }
  });
  this.$module.querySelectorAll('.lbs-card').forEach(x => {
    if (x.classList.contains('lbs-card--popular-item')) {
      const cs = window.getComputedStyle(x);
      x.style.minHeight = tallestCard - (parseFloat(cs.paddingBottom)) + 'px';
    } else {
      x.style.minHeight = tallestCard + 'px';
    }
  });
};

// New bits

function Header ($module) {
  this.$module = $module;
  this.$navigationToggle = this.$module.querySelector('#super-navigation-menu-toggle');
  this.$navigationMenu = this.$module.querySelector('#super-navigation-menu');
  this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle');
  this.$searchMenu = this.$module.querySelector('#super-search-menu');
  this.$buttons = this.$module.querySelectorAll('button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]');
  this.$menuButtons = this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-item');
  this.$phaseBanner = document.querySelector('.lbs-row--phase-banner');
  this.$header = document.querySelector('.lbs-header');
  // this.$menuButtons = this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-second-toggle-button')
  this.hiddenButtons = this.$module.querySelectorAll('button[hidden]');
  this.menuOpen = false;
  this.searchOpen = false;
  this.lastWindowSize = null;
}

Header.prototype.init = function () {
  if (!this.$module) {
    return
  }
  this.$module.classList.add('js-module-initialised');
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  }
};

Header.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.desktop + ')');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Header.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.teardownMobileMenu();
    this.setupDesktopMenu();
  } else {
    this.teardownDesktopMenu();
    this.setupMobileMenu();
  }
};

Header.prototype.setupMobileMenu = function () {
  this.setAttributes('mobile');
  if (this.$navigationMenu != null) {
    this.$navigationToggle.boundMenuClick = this.handleMenuButtonClick.bind(this);
    this.$navigationToggle.addEventListener('click', this.$navigationToggle.boundMenuClick, true);
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.boundSearchClick = this.handleSearchButtonClick.bind(this);
    this.$searchToggle.addEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.teardownMobileMenu = function () {
  this.unsetAttributes('mobile');
  if (this.$navigationMenu != null) {
    this.$navigationToggle.removeEventListener('click', this.$navigationToggle.boundMenuClick, true);
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.removeEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.setupDesktopMenu = function () {
  this.setAttributes('desktop');
  if (this.$searchMenu != null) {
    this.$searchToggle.boundSearchClick = this.handleSearchButtonClick.bind(this);
    this.$searchToggle.addEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.teardownDesktopMenu = function () {
  this.unsetAttributes('desktop');
  if (this.$navigationMenu != null) {
    this.$navigationToggle.removeEventListener('click', this.$navigationToggle.boundMenuClick, true);
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.removeEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.menuItemClick = function (e) {
  const theTargetID = e.target.getAttribute('aria-controls');
  e.target.classList.toggle('gem-c-layout-super-navigation-header__open-button');
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-second-toggle-button:not([aria-controls=' + theTargetID + '])').forEach(i => i.classList.remove('gem-c-layout-super-navigation-header__open-button'));
  const theTarget = document.getElementById(theTargetID);
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-dropdown-menu:not(#' + theTargetID + ')').forEach(i => i.setAttribute('hidden', true));
  document.getElementById(theTargetID).getAttribute('hidden') != null ? document.getElementById(theTargetID).removeAttribute('hidden') : document.getElementById(theTargetID).setAttribute('hidden', 'true');
  if (this.mql.matches === true) {
    this.$module.style.marginBottom = theTarget.offsetHeight + 'px';
  }
  if (this.$searchMenu != null) {
    this.closeSearch(this.$searchToggle, this.$searchMenu);
  }
};

Header.prototype.setAttributes = function ($type) {
  if ($type === 'mobile') {
    if (this.$navigationMenu != null) {
      this.$navigationToggle.removeAttribute('hidden');
      this.$navigationToggle.setAttribute('aria-expanded', false);
      this.$navigationMenu.setAttribute('hidden', true);
    }
  }
  if (this.$searchMenu != null) {
    this.$searchMenu.setAttribute('hidden', true);
    this.$searchToggle.setAttribute('aria-expanded', false);
    this.$searchToggle.setAttribute('aria-label', 'Show search menu');
    this.$module.querySelector('.gem-c-layout-super-navigation-header__search-item-link').setAttribute('hidden', true);
    this.$module.querySelector('.gem-c-layout-super-navigation-header__search-and-popular').removeAttribute('hidden');
    this.$searchToggle.removeAttribute('hidden');
  }
  nodeListForEach(this.$menuButtons, function ($button) {
    $button.querySelector('.gem-c-layout-super-navigation-header__navigation-item-link').setAttribute('hidden', true);
    $button.querySelector('.gem-c-layout-super-navigation-header__navigation-second-toggle-button').removeAttribute('hidden');
    // Save bounded functions to use when removing event listeners during teardown
    $button.boundMenuItemClick = this.menuItemClick.bind(this);
    // Handle events
    $button.querySelector('button').addEventListener('click', $button.boundMenuItemClick, true);
  }.bind(this));
};

Header.prototype.unsetAttributes = function ($type) {
  if ($type === 'mobile') {
    if (this.$navigationMenu != null) {
      this.$navigationToggle.setAttribute('hidden', true);
      this.$navigationMenu.removeAttribute('hidden');
    }
    if (this.$searchMenu != null) {
      this.$searchToggle.setAttribute('hidden', true);
      this.$searchMenu.removeAttribute('hidden');
    }
  }
  this.$module.style.marginBottom = '0px';
  this.searchOpen = false;
  this.menuOpen = false;
  if (this.$navigationMenu != null) {
    this.closeDesktopMenus();
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
  }
  nodeListForEach(this.$menuButtons, function ($button) {
    $button.querySelector('button').removeEventListener('click', $button.boundMenuItemClick, true);
  });
};

Header.prototype.handleMenuButtonClick = function () {
  if (this.menuOpen === true) {
    this.closeMenu(this.$navigationToggle, this.$navigationMenu);
  } else {
    this.openMenu(this.$navigationToggle, this.$navigationMenu);
  }
};

Header.prototype.handleSearchButtonClick = function () {
  if (this.searchOpen === true) {
    this.closeSearch(this.$searchToggle, this.$searchMenu);
    if (this.mql.matches === true) {
      this.$module.style.marginBottom = '0';
      // this.$searchMenu.style.top = '0'
    }
  } else {
    this.openSearch(this.$searchToggle, this.$searchMenu);
    if (this.mql.matches === true) {
      this.$module.style.marginBottom = this.$searchMenu.offsetHeight + 'px';
      // this.$searchMenu.style.top = this.$navigationMenu.offsetHeight + 'px'
      if (this.$phaseBanner) {
        this.$searchMenu.style.bottom = this.$phaseBanner.offsetHeight + 'px';
      }
    }
  }
};

Header.prototype.openMenu = function ($button, $target) {
  this.menuOpen = true;
  $button.classList.add('gem-c-layout-super-navigation-header__open-button');
  $button.setAttribute('aria-expanded', !0);
  $button.setAttribute('aria-label', 'Hide navigation menu');
  $button.classList.add('gem-c-layout-super-navigation-header__open-button');
  $target.removeAttribute('hidden');
  if (this.$searchMenu != null) {
    this.closeSearch(this.$searchToggle, this.$searchMenu);
  }
};

Header.prototype.closeMenu = function ($button, $target) {
  this.menuOpen = false;
  this.$module.style.marginBottom = '0px';
  if (this.$navigationMenu != null) {
    $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
    $button.setAttribute('aria-expanded', !1);
    $button.setAttribute('aria-label', 'Show navigation menu');
    $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
    $target.setAttribute('hidden', !0);
  }
};

Header.prototype.closeDesktopMenus = function () {
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-dropdown-menu').forEach(x => x.setAttribute('hidden', true));
};

Header.prototype.openSearch = function ($button, $target) {
  this.searchOpen = true;
  $button.setAttribute('aria-expanded', !0);
  $button.setAttribute('aria-label', 'Hide navigation menu');
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__open-button').forEach(x => x.classList.remove('gem-c-layout-super-navigation-header__open-button'));
  $button.classList.add('gem-c-layout-super-navigation-header__open-button');
  $target.removeAttribute('hidden');
  document.getElementById('lbs-search__box').focus();
  if (this.mql.matches !== true) {
    this.closeMenu(this.$navigationToggle, this.$navigationMenu);
  } else {
    this.closeDesktopMenus();
  }
};

Header.prototype.closeSearch = function ($button, $target) {
  this.searchOpen = false;
  $button.setAttribute('aria-expanded', !1);
  $button.setAttribute('aria-label', 'Show navigation menu');
  $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
  $target.setAttribute('hidden', !0);
};

function PageFeedback ($module) {
  this.$module = $module;
  this.jshiddenClass = 'js_is-hidden';
  this.jsShowClass = 'js_show';
  this.prompt = 'lbs-page-feedback__prompt';
  this.formController = this.$module.querySelector('[aria-controls=' + this.feedbackForm + ']');
  this.feedbackForm = 'lbs-page-feedback__form';
  this.formToggleButton = 'lbs-page-feedback__form';
}

/**
 * Initialise PageFeedback
 *
 * Check for the presence of page feedback form
 */

PageFeedback.prototype.init = function () {
  if (!this.$module) {
    return
  }
  this.setInitialAriaAttributes();
  this.$module.querySelector('[aria-controls=' + this.feedbackForm + ']').addEventListener('click', function (t) {
    t.preventDefault();
    this.toggleForm(t.target);
    this.addHideButton();
  }.bind(this));
};

PageFeedback.prototype.setInitialAriaAttributes = function () {
  document.getElementById(this.feedbackForm).setAttribute('aria-hidden', true);
};

PageFeedback.prototype.updateAriaAttributes = function (t) {
  if (t.getAttribute('aria-expanded') === 1) {
    t.setAttribute('aria-expanded', !0);
    document.querySelector('#' + t.getAttribute('aria-controls')).setAttribute('aria-hidden', !1);
  } else {
    t.setAttribute('aria-expanded', !1);
    document.querySelector('#' + t.getAttribute('aria-controls')).setAttribute('aria-hidden', !0);
  }
};

PageFeedback.prototype.toggleForm = function (t) {
  this.$module.querySelector('.lbs-page-feedback__form').classList.toggle(this.jsShowClass);
  this.$module.querySelector('.lbs-page-feedback__prompt').classList.toggle(this.jshiddenClass);
  this.updateAriaAttributes(t);
};

PageFeedback.prototype.addHideButton = function (t) {
  const closeForm = document.createElement('a');
  const module = this.$module;
  const that = this;
  closeForm.innerText = 'Close';
  closeForm.setAttribute('class', 'lbs-button--secondary lbs-button govuk-button');
  closeForm.setAttribute('id', 'lbs-feedback__form--hide-button');
  closeForm.setAttribute('href', '#');
  closeForm.setAttribute('aria-controls', this.feedbackForm);
  closeForm.setAttribute('role', 'button');
  closeForm.addEventListener('click', function (e) {
    e.preventDefault();
    module.querySelector('#lbs-feedback__form--hide-button').remove();
    that.toggleForm(e.target);
  });
  this.$module.querySelector('form').prepend(closeForm);
};

function PageGroupNavigation ($module) {
  this.$module = $module;
}

PageGroupNavigation.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (this.$module.querySelectorAll('li').length === 1) {
    this.handleSingleItem();
  }
};

PageGroupNavigation.prototype.handleSingleItem = function () {
  const theItem = this.$module.querySelector('li');
  if (theItem.classList.contains('lbs-page-group__navigation__list-item--next')) {
    this.$module.querySelector('ul').classList.add('lbs-page-group__navigation__list--single-item');
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
    $panel.querySelector('.lbs-tabs__content__item__title').addEventListener('click', $panel.boundTabClick, true);
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

  // const $headers = scope.querySelectorAll('.lbs-header')
  // nodeListForEach($headers, function ($header) {
  //   new Header($header).init()
  // })

  const $headers = scope.querySelectorAll('[data-module="super-navigation-mega-menu"]');
  nodeListForEach($headers, function ($header) {
    // console.log('Initted')
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

  const $pageFeedbackItems = scope.querySelectorAll('.lbs-page-feedback');
  nodeListForEach($pageFeedbackItems, function ($pageFeedback) {
    new PageFeedback($pageFeedback).init();
  });

  const $pageGroupNavigation = scope.querySelectorAll('.lbs-page-group__navigation');
  nodeListForEach($pageGroupNavigation, function ($pageGroupNavigationItem) {
    new PageGroupNavigation($pageGroupNavigationItem).init();
  });

  // let $showMoreWrappers = scope.querySelectorAll('[data-show-more]')
  // nodeListForEach($showMoreWrappers, function ($showMoreWrapper) {
  //   new ShowMore($showMoreWrapper).init()
  // })
}

exports.initAll = initAll;
exports.Card = Card;
exports.Cards = Cards;
exports.Header = Header;
exports.PageFeedback = PageFeedback;
exports.PageGroupNavigation = PageGroupNavigation;
exports.Search = Search;
exports.ShowMore = ShowMore;
exports.Tabs = Tabs;

})));
