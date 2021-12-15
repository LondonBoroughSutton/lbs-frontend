import { nodeListForEach, settings } from '../../common'

// New bits

function Header ($module) {
  this.$module = $module,
    this.$navigationToggle = this.$module.querySelector('#super-navigation-menu-toggle'),
    this.$navigationMenu = this.$module.querySelector('#super-navigation-menu'),
    this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle'),
    this.$searchMenu = this.$module.querySelector('#super-search-menu'),
    this.$buttons = this.$module.querySelectorAll('button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]'),
    this.$menuButtons = this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-item'),
    this.hiddenButtons = this.$module.querySelectorAll('button[hidden]'),
    this.menuOpen = false,
    this.searchOpen = false,
    this.lastWindowSize = null
}

Header.prototype.init = function () {
  if (!this.$module) {
    return
  }
  this.$module.classList.add('js-module-initialised')
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks()
  } else {
    this.setupMenu()
  }
}

Header.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.desktop + ')')
  this.mql.addListener(this.checkMode.bind(this))
  this.checkMode()
}

Header.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.teardownMobileMenu()
    this.setupDesktopMenu()
  } else {
    this.teardownDesktopMenu()
    this.setupMobileMenu()
  }
}

Header.prototype.setupMobileMenu = function () {
  this.setAttributes('mobile')
  this.$navigationToggle.boundMenuClick = this.handleMenuButtonClick.bind(this)
  this.$searchToggle.boundSearchClick = this.handleSearchButtonClick.bind(this)
  this.$navigationToggle.addEventListener('click', this.$navigationToggle.boundMenuClick, true)
  this.$searchToggle.addEventListener('click', this.$searchToggle.boundSearchClick, true)
}

Header.prototype.teardownMobileMenu = function () {
  this.unsetAttributes('mobile')
  this.$navigationToggle.removeEventListener('click', this.$navigationToggle.boundMenuClick, true)
  this.$searchToggle.removeEventListener('click', this.$searchToggle.boundSearchClick, true)
}

Header.prototype.setupDesktopMenu = function () {
  this.setAttributes('desktop')
  this.$searchToggle.boundSearchClick = this.handleSearchButtonClick.bind(this)
  this.$searchToggle.addEventListener('click', this.$searchToggle.boundSearchClick, true)
}

Header.prototype.teardownDesktopMenu = function () {
  this.unsetAttributes('desktop')
  this.$navigationToggle.removeEventListener('click', this.$navigationToggle.boundMenuClick, true)
  this.$searchToggle.removeEventListener('click', this.$searchToggle.boundSearchClick, true)
}

Header.prototype.menuItemClick = function (e) {
  const theTarget = document.getElementById(e.target.getAttribute('aria-controls'))
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-dropdown-menu:not(#' + e.target.getAttribute('aria-controls') + ')').forEach(i => i.setAttribute('hidden', true))
  theTarget.toggleAttribute('hidden')
  if (this.mql.matches === true) {
    this.$module.style.marginBottom = theTarget.offsetHeight + 'px'
  }
  this.closeSearch(this.$searchToggle, this.$searchMenu)
}

Header.prototype.setAttributes = function ($type) {
  if ($type === 'mobile') {
    this.$navigationToggle.removeAttribute('hidden')
    this.$navigationMenu.setAttribute('hidden', true)
  }
  this.$searchMenu.setAttribute('hidden', true)
  this.$searchToggle.setAttribute('aria-expanded', false)
  this.$searchToggle.setAttribute('aria-label', 'Show search menu')
  this.$module.querySelector('.gem-c-layout-super-navigation-header__search-item-link').setAttribute('hidden', true)
  this.$module.querySelector('.gem-c-layout-super-navigation-header__search-and-popular').removeAttribute('hidden')
  this.$searchToggle.removeAttribute('hidden')
  nodeListForEach(this.$menuButtons, function ($button) {
    $button.querySelector('.gem-c-layout-super-navigation-header__navigation-item-link').setAttribute('hidden', true)
    $button.querySelector('.gem-c-layout-super-navigation-header__navigation-second-toggle-button').removeAttribute('hidden')
    // Save bounded functions to use when removing event listeners during teardown
    $button.boundMenuItemClick = this.menuItemClick.bind(this)
    // Handle events
    $button.addEventListener('click', $button.boundMenuItemClick, true)
  }.bind(this))
}

Header.prototype.unsetAttributes = function ($type) {
  if ($type === 'mobile') {
    this.$navigationToggle.setAttribute('hidden', true)
    this.$searchToggle.setAttribute('hidden', true)
    this.$navigationMenu.removeAttribute('hidden')
    this.$searchMenu.removeAttribute('hidden')
  }
  this.$module.style.marginBottom = '0px'
  this.searchOpen = false
  this.menuOpen = false
  this.closeDesktopMenus()
  this.$searchToggle.classList.remove('gem-c-layout-super-navigation-header__open-button')
  nodeListForEach(this.$menuButtons, function ($button) {
    $button.removeEventListener('click', $button.boundMenuItemClick, true)
  }.bind(this))
}

Header.prototype.handleMenuButtonClick = function () {
  if (this.menuOpen === true) {
    this.closeMenu(this.$navigationToggle, this.$navigationMenu)
  } else {
    this.openMenu(this.$navigationToggle, this.$navigationMenu)
  }
}

Header.prototype.handleSearchButtonClick = function () {
  if (this.searchOpen === true) {
    this.closeSearch(this.$searchToggle, this.$searchMenu)
    if (this.mql.matches === true) {
      this.$module.style.marginBottom = '0'
    }
  } else {
    this.openSearch(this.$searchToggle, this.$searchMenu)
    if (this.mql.matches === true) {
      this.$module.style.marginBottom = this.$searchMenu.offsetHeight + 'px'
    }
  }
}

Header.prototype.openMenu = function ($button, $target) {
  this.menuOpen = true
  $button.classList.add('gem-c-layout-super-navigation-header__open-button')
  $button.setAttribute('aria-expanded', !0)
  $button.setAttribute('aria-label', 'Hide navigation menu')
  $button.classList.add('gem-c-layout-super-navigation-header__open-button')
  $target.removeAttribute('hidden')
  this.closeSearch(this.$searchToggle, this.$searchMenu)
}

Header.prototype.closeMenu = function ($button, $target) {
  this.menuOpen = false
  this.$module.style.marginBottom = '0px'
  $button.classList.remove('gem-c-layout-super-navigation-header__open-button')
  $button.setAttribute('aria-expanded', !1)
  $button.setAttribute('aria-label', 'Show navigation menu')
  $button.classList.remove('gem-c-layout-super-navigation-header__open-button')
  $target.setAttribute('hidden', !0)
}

Header.prototype.closeDesktopMenus = function () {
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-dropdown-menu').forEach(x => x.setAttribute('hidden', true))
}

Header.prototype.openSearch = function ($button, $target) {
  this.searchOpen = true
  $button.setAttribute('aria-expanded', !0)
  $button.setAttribute('aria-label', 'Hide navigation menu')
  $button.classList.add('gem-c-layout-super-navigation-header__open-button')
  $target.removeAttribute('hidden')
  document.getElementById('lbs-search__box').focus()
  if (this.mql.matches !== true) {
    this.closeMenu(this.$navigationToggle, this.$navigationMenu)
  } else {
    this.closeDesktopMenus()
  }
}

Header.prototype.closeSearch = function ($button, $target) {
  this.searchOpen = false
  $button.setAttribute('aria-expanded', !1)
  $button.setAttribute('aria-label', 'Show navigation menu')
  $button.classList.remove('gem-c-layout-super-navigation-header__open-button')
  $target.setAttribute('hidden', !0)
}

export default Header
