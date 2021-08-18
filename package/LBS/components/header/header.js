(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('LBSFrontend', factory) :
	(global.LBSFrontend = factory());
}(this, (function () { 'use strict';

function Header($module) {
    this.$module = $module;
    this.$searchButton = $module && $module.querySelector('#lbs-header__mobile__search-btn');
    this.$menuButton = $module && $module.querySelector('#lbs-header__mobile__menu-btn');
    // console.log(this.$searchButton)
    // console.log(this.$menuButton)
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
        console.log(this.$search);
        this.syncState(this.$searchButton, this.$search.classList.contains('active'));
        this.$searchButton.addEventListener('click', this.handleSearchButtonClick.bind(this));
    }

    // The following implementation is from https://www.w3.org/WAI/tutorials/menus/flyout/#flyoutnavmousefixed - understood to be accessible and current best practice
    let menuItems = document.querySelectorAll('li[data-has-submenu]');
    Array.prototype.forEach.call(menuItems, function (el, i) {
        el.querySelector('a').addEventListener("click", function (event) {
            if (this.parentNode.getAttribute('data-has-submenu') === "true" && this.parentNode.getAttribute('data-submenu-open') !== "true") {
                this.parentNode.setAttribute("data-submenu-open", true);
                this.setAttribute('aria-expanded', "true");
            } else {
                this.parentNode.setAttribute("data-submenu-open", false);
                this.setAttribute('aria-expanded', "false");
            }
            event.preventDefault();
            return false;
        });
        let checkIfMenuIsOpen = null;
        let links = el.querySelectorAll('a');
        Array.prototype.forEach.call(links, function (el, i) {
            el.addEventListener("focus", function () {
                if (checkIfMenuIsOpen) {
                    clearTimeout(checkIfMenuIsOpen);
                    checkIfMenuIsOpen = null;
                }
            });
            el.addEventListener("blur", function (event) {
                checkIfMenuIsOpen = setTimeout(function () {
                    let opennav = document.querySelector("li[data-submenu-open='true']");
                    if (opennav) {
                        opennav.setAttribute("data-submenu-open", false);
                        opennav.querySelector('a').setAttribute('aria-expanded', "false");
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
    let isVisible = this.$menu.classList.toggle('active');
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
    let isVisible = this.$search.classList.toggle('active');
    this.syncState(this.$searchButton, isVisible);
    this.$module.querySelector('#lbs-search__box').focus();
    if (this.$menu.classList.contains('active')) {
        this.syncState(this.$menuButton, this.$menu.classList.toggle('active'));
    }
};

return Header;

})));
