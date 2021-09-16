function Tabs ($module) {
  this.$module = $module
  this.$tabs = $module.querySelectorAll('.lbs-tabs__tab')
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

  console.log('Hello')
  this.setup()

  // this.setHeight()
}

Tabs.prototype.setup = function () {
  let $module = this.$module
  let $tabs = this.$tabs
  let $tabList = $module.querySelector('.lbs-tabs__list')
  let $tabListItems = $module.querySelectorAll('.lbs-tabs__list-item')
  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }
  $tabList.setAttribute('role', 'tablist')

}

Tabs.prototype.handleClickable = function () {
  if (this.$module.querySelector('a') !== null) {
    this.$module.addEventListener('click', () => {
      this.$module.querySelector('a').click()
    })
  }
}

export default Tabs
