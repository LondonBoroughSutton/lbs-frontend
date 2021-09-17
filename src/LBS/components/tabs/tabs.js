import { nodeListForEach } from '../../common'

function Tabs ($module) {
  this.$module = $module
  this.$tabs = $module.querySelectorAll('.lbs-tabs__tab')
  this.activePanelClass = 'lbs-tabs__content__item--active'
  this.activeTabClass = 'lbs-tabs__list-item--selected'
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

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation')
  })

  nodeListForEach($tabs, function ($tab) {
    // Set HTML attributes
    this.setAttributes($tab)

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this)
    // $tab.boundTabKeydown = this.onTabKeydown.bind(this)

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true)
    // $tab.addEventListener('keydown', $tab.boundTabKeydown, true)

    // Remove old active panels
    // this.hideTab($tab)
  }.bind(this))

}

// Tabs.prototype.handleClickable = function () {
//   if (this.$module.querySelector('a') !== null) {
//     this.$module.addEventListener('click', () => {
//       this.$module.querySelector('a').click()
//     })
//   }
// }

Tabs.prototype.setAttributes = function ($tab) {
  // console.log($tab)
  // set tab attributes
  let panelId = 1
  $tab.setAttribute('id', 'tab_' + panelId)
  $tab.setAttribute('role', 'tab')
  $tab.setAttribute('aria-controls', panelId)
  $tab.setAttribute('aria-selected', 'false')
  // $tab.setAttribute('tabindex', '-1')

  // set panel attributes
  console.log($tab)
  let $panel = this.getPanel($tab)
  // console.log($panel)
  $panel.setAttribute('role', 'tabpanel')
  $panel.setAttribute('aria-labelledby', $tab.id)
  // $panel.classList.add(this.activePanelClass)
}

Tabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id')
  $tab.removeAttribute('role')
  $tab.removeAttribute('aria-controls')
  $tab.removeAttribute('aria-selected')
  $tab.removeAttribute('tabindex')

  // unset panel attributes
  console.log($tab)
  let $panel = this.getPanel($tab)
  $panel.removeAttribute('role')
  $panel.removeAttribute('aria-labelledby')
  // $panel.classList.remove(this.activePanelClass)
}

Tabs.prototype.hideTab = function ($tab) {
  const theTarget = this.$module.querySelector('.lbs-tabs__list-item a[data-lbs-tab-id="' + $tab.getAttribute('data-lbs-tab-id') + '"]')
  // console.log(theTarget)
  this.unhighlightTab(theTarget)
  this.hidePanel($tab)
}

Tabs.prototype.showTab = function ($tab) {
  const theTarget = this.$module.querySelector('.lbs-tabs__list-item a[data-lbs-tab-id="' + $tab.getAttribute('data-lbs-tab-id') + '"]')
  this.highlightTab(theTarget)
  this.showPanel($tab)
}

Tabs.prototype.onTabClick = function (e) {
  if (!e.target.classList.contains('lbs-tabs__tab')) {
    // Allow events on child DOM elements to bubble up to tab parent
    return false
  }
  e.preventDefault()
  let $newTab = e.target
  let $currentTab = this.getCurrentTab()
  console.log('C: ' + $currentTab)
  console.log('N: ' + $newTab)
  this.hideTab($currentTab)
  this.showTab($newTab)
  // this.createHistoryEntry($newTab)
}

Tabs.prototype.getCurrentTab = function () {
  console.log('CF')
  return this.$module.querySelector('.' + this.activeTabClass + ' .lbs-tabs__tab')
}

Tabs.prototype.getPanel = function ($tab) {
  console.log('GetPanel: ' + $tab)
  const $panel = this.$module.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="' + $tab.getAttribute('data-lbs-tab-id') + '"]')
  console.log($panel)
  return $panel
}

Tabs.prototype.showPanel = function ($tab) {
  console.log('ShowPanel: ' + $tab)
  let $panel = this.getPanel($tab)
  $panel.classList.add(this.activePanelClass)
}

Tabs.prototype.hidePanel = function ($tab) {
  console.log('HidePanel: ' +   $tab)
  let $panel = this.getPanel($tab)
  $panel.classList.remove(this.activePanelClass)
}

Tabs.prototype.unhighlightTab = function ($tab) {
  // console.log($tab)
  $tab.setAttribute('aria-selected', 'false')
  $tab.parentNode.classList.remove(this.activeTabClass)
}

Tabs.prototype.highlightTab = function ($tab) {
  console.log('HT: ' + $tab)
  $tab.setAttribute('aria-selected', 'true')
  $tab.parentNode.classList.add(this.activeTabClass)
  $tab.blur()
  // $tab.setAttribute('tabindex', '0')
}

export default Tabs
