import { settings } from '../../common'

// New bits

function Header ($module) {
  this.$module = $module,
    this.$navigationToggle = this.$module.querySelector('#super-navigation-menu-toggle'),
    this.$navigationMenu = this.$module.querySelector('#super-navigation-menu'),
    this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle'),
    this.$searchMenu = this.$module.querySelector('#super-search-menu'),
    this.$buttons = this.$module.querySelectorAll('button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]'),
    this.hiddenButtons = this.$module.querySelectorAll('button[hidden]'),
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
  this.mql = window.matchMedia('(min-width: ' + settings.minWidth + ')')
  this.mql.addListener(this.checkMode.bind(this))
  this.checkMode()
}

Header.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.teardownMenu()
  } else {
    this.setupMenu()
  }
}

Header.prototype.setupMenu = function () {
  console.log('Set up')
  this.setAttributes()
  this.$navigationToggle.boundMenuClick = this.handleMenuButtonClick.bind(this)
  this.$navigationToggle.addEventListener('click', this.$navigationToggle.boundMenuClick, true)
}

Header.prototype.teardownMenu = function () {
  console.log('Tear down')
  this.$module.querySelector('.gem-c-layout-super-navigation-header__navigation-top-toggle-button').setAttribute('hidden', true)
}

Header.prototype.setAttributes = function () {
  this.$module.querySelector('.gem-c-layout-super-navigation-header__navigation-top-toggle-button').removeAttribute('hidden')
}

Header.prototype.handleMenuButtonClick = function () {
  console.log('Clicked')
  // this.$module.querySelector('.gem-c-layout-super-navigation-header__navigation-top-toggle-button').removeAttribute('hidden')
}

Header.prototype.openMenu = function ($button, $target) {
  $button.setAttribute('aria-expanded', !0)
  $button.classList.add('gem-c-layout-super-navigation-header__open-button')
  $target.removeAttribute('hidden')
  // n(e, 'hide')
}

//
// var i = {
//     breakpoint: {
//       desktop: 769
//     },
//     label: {
//       hide: 'data-text-for-hide',
//       show: 'data-text-for-show'
//     }
//   },
//   n = function (e, t) {
//     var n = e.getAttribute(i.label[t])
//     n && e.setAttribute('aria-label', n)
//   },
//   u = function (e, t) {
//     e.setAttribute('aria-expanded', !1), e.classList.remove('gem-c-layout-super-navigation-header__open-button'), t.setAttribute('hidden', 'hidden'), n(e, 'show')
//   },
//   o = function (e, t) {
//     e.setAttribute('aria-expanded', !0), e.classList.add('gem-c-layout-super-navigation-header__open-button'), t.removeAttribute('hidden'), n(e, 'hide')
//   },
//   l = function (e, t) {
//     var n = 'true' === e.getAttribute('aria-expanded'),
//       i = e.getAttribute('data-tracking-key')
//     n ? u(e, t) : o(e, t), window.GOVUK.analytics && window.GOVUK.analytics.trackEvent && i && window.GOVUK.analytics.trackEvent('headerClicked', i + (n ? 'Closed' : 'Opened'), {
//       label: 'none'
//     })
//   },
//   d = function (e, t) {
//     return e.tagName.toLowerCase() === t.toLowerCase() ? e : d(e.parentNode, t)
//   },
//   r = function (e, t) {
//     if (null === e) return null
//     if (1 === e.nodeType && e.tagName.toLowerCase() === t.toLowerCase()) return e
//     var n = e.previousElementSibling || e.previousSibling
//     return r(n, t)
//   },
//   a = function (e) {
//     return 0 < e.querySelectorAll('button[aria-expanded="true"]').length
//   },
//   s = function () {
//     return document.documentElement.clientWidth >= i.breakpoint.desktop ? 'desktop' : 'mobile'
//   }
// t.prototype.windowSize = s, t.prototype.updateStates = function () {
//   if ('mobile' === this.windowSize() && 'mobile' !== this.lastWindowSize && (this.$navigationToggle.removeAttribute('hidden'), a(this.$navigationMenu) || u(this.$navigationToggle, this.$navigationMenu), this.$module.style.marginBottom = '0'), 'desktop' === this.windowSize() && 'desktop' !== this.lastWindowSize && (this.$navigationToggle.setAttribute('hidden', 'hidden'), this.$navigationMenu.removeAttribute('hidden')), 'desktop' === s()) {
//     var e = this.$module.querySelector('[aria-expanded="true"][data-toggle-desktop-group="top"]'),
//       t = e ? this.$module.querySelector('#' + e.getAttribute('aria-controls')) : null,
//       n = t ? t.offsetHeight : 0
//     this.$module.style.marginBottom = n + 'px'
//   }
//   this.lastWindowSize = this.windowSize()
// }, t.prototype.buttonHandler = function (e) {
//   for (var t = d(e.target, 'button'), n = this.$module.querySelector('#' + t.getAttribute('aria-controls')), i = 'data-toggle-' + this.windowSize() + '-group', o = t.getAttribute(i), r = this.$module.querySelectorAll('[' + i + '="' + o + '"]'), a = 0; a < r.length; a++) {
//     var s = r[a]
//     if (s !== t) {
//       var c = this.$module.querySelector('#' + s.getAttribute('aria-controls'))
//       u(s, c)
//     }
//   }
//   l(t, n), 'desktop' === this.windowSize() && (this.$module.style.marginBottom = n.offsetHeight + 'px')
// }, t.prototype.init = function () {
//   for (var e = 0; e < this.$buttons.length; e++) {
//     this.$buttons[e].addEventListener('click', this.buttonHandler.bind(this), !0)
//   }
//   for (var t = 0; t < this.hiddenButtons.length; t++) {
//     var n = this.hiddenButtons[t]
//     n.removeAttribute('hidden')
//     var i = r(n, 'a')
//     i && i.setAttribute('hidden', 'hidden')
//   }
//   this.$module.querySelector('.gem-c-layout-super-navigation-header__search-item-link').setAttribute('hidden', 'hidden'), u(this.$searchToggle, this.$searchMenu), this.updateStates(), this.lastWindowSize = this.windowSize(), window.addEventListener('resize', this.updateStates.bind(this), {
//     passive: !0
//   }), this.$module.classList.add('js-module-initialised')
// }

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
  button.classList.toggle('active', isVisible)
  button.setAttribute('aria-expanded', isVisible)
}

/**
 * Handle menu button click
 *
 * When the menu button is clicked, change the visibility of the menu and then
 * sync the accessibility state and menu button state
 */
// Header.prototype.handleMenuButtonClick = function () {
//   const isVisible = this.$menu.classList.toggle('active')
//   this.syncState(this.$menuButton, isVisible)
//   if (this.$search.classList.contains('active')) {
//     this.syncState(this.$searchButton, this.$search.classList.toggle('active'))
//   }
// }

/**
 * Handle search button click
 *
 * When the search button is clicked, change the visibility of the search form and then
 * sync the accessibility state and search button state
 */
Header.prototype.handleSearchButtonClick = function () {
  const isVisible = this.$search.classList.toggle('active')
  this.syncState(this.$searchButton, isVisible)
  this.$module.querySelector('#lbs-search__box').focus()
  if (this.$menu.classList.contains('active')) {
    this.syncState(this.$menuButton, this.$menu.classList.toggle('active'))
  }
}

export default Header
