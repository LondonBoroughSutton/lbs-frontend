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

function initAll (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  var $headers = scope.querySelectorAll('.lbs-header');
  nodeListForEach($headers, function ($header) {
    new Header($header).init();
  });
}

exports.initAll = initAll;
exports.Header = Header;
exports.Search = Search;

})));
