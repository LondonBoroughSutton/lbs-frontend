(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('LBSFrontend', factory) :
	(global.LBSFrontend = factory());
}(this, (function () { 'use strict';

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

return Tabs;

})));
