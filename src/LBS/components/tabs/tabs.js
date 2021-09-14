function Tabs ($module) {
  this.$module = $module
}

/**
 * Initialise tabs
 *
 * Check for the presence of cards - if any are
 * missing then there's nothing to do so return early.
 */
Tabs.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (this.$module.classList.contains('lbs-card--clickable')) {
    this.handleClickable()
  }
  if (this.$module.querySelector('.js__is-hidden')) {
    this.showAllItems()
  }
  // this.setHeight()
}

Tabs.prototype.handleClickable = function () {
  if (this.$module.querySelector('a') !== null) {
    this.$module.addEventListener('click', () => {
      this.$module.querySelector('a').click()
    })
  }
}

export default Tabs
