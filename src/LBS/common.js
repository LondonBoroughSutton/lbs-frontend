/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
export function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
export function generateUniqueID () {
  var d = new Date().getTime()
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export const settings = {
  minWidth: '40.0625em',
  desktop: '48.0625em'
}

// Common function to only show a subset of items and insert CTA to show them

export function ShowMore ($module) {
  this.$module = $module
}

ShowMore.prototype.init = function () {
  const count = this.$module.getAttribute('data-show-count') || 6 // Roadmap item - add data item to dictate how many items to show
  this.hideItems(count)
  if (this.$module.getAttribute('data-show-more') && count !== '0') {
    if (this.$module.querySelector('.js__is-hidden')) {
      this.addCallToAction()
      this.addAriaAttributes()
    }
  }
}

ShowMore.prototype.hideItems = function (count) {
  this.$module.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach((x, index) => {
    if (index >= count && parseInt(count) !== 0) {
      x.parentNode.classList.add('js__is-hidden')
    }
  })
}

ShowMore.prototype.classToAdd = function () {
  if (this.$module.getAttribute('data-show-more-type')) {
    if (this.$module.getAttribute('data-show-more-position')) {
      this.addClassToCallToAction(this.$module.getAttribute('data-show-more-type'), this.$module.getAttribute('data-show-more-position'))
    } else {
      this.addClassToCallToAction(this.$module.getAttribute('data-show-more-type'))
    }
  }
}

ShowMore.prototype.addCallToAction = function () {
  const module = this.$module
  const that = this
  const itemCount = this.$module.querySelectorAll('.js__is-hidden').length
  const showMoreHtml = document.createElement('a')
  showMoreHtml.innerText = 'Show more items (' + itemCount + ')'
  showMoreHtml.setAttribute('class', 'show-more-link')
  showMoreHtml.setAttribute('href', '#')
  showMoreHtml.setAttribute('aria-controls', module.id)
  showMoreHtml.setAttribute('role', 'button')
  showMoreHtml.addEventListener('click', function (e) {
    e.preventDefault()
    module.classList.add('show-hidden')
    that.addShowLessCallToAction()
    try {
      module.removeChild(this)
    } catch (err) {
      module.parentNode.removeChild(this)
    }
    module.setAttribute('aria-expanded', true)
    module.querySelector('.js__is-hidden a').focus()
  })
  if (this.$module.getAttribute('data-show-more-position') === 'after') {
    module.insertAdjacentElement('afterend', showMoreHtml)
  } else {
    module.append(showMoreHtml)
  }
  this.classToAdd()
}

ShowMore.prototype.addClassToCallToAction = function (classes, position) {
  const module = this.$module

  DOMTokenList.prototype.addMany = function (classes) {
    const array = classes.split(' ')
    for (let i = 0, length = array.length; i < length; i++) {
      this.add(array[i])
    }
  }
  if (position === 'after') {
    module.nextElementSibling.classList.addMany(classes)
  } else {
    module.querySelector('.show-more-link').classList.addMany(classes)
  }
}

ShowMore.prototype.addShowLessCallToAction = function () {
  const module = this.$module
  const that = this
  const showLessHtml = document.createElement('a')
  showLessHtml.innerText = 'Show less items'
  showLessHtml.setAttribute('class', 'show-more-link')
  showLessHtml.setAttribute('href', '#')
  showLessHtml.setAttribute('aria-controls', module.id)
  showLessHtml.setAttribute('role', 'button')
  showLessHtml.addEventListener('click', function (e) {
    e.preventDefault()
    module.classList.remove('show-hidden')
    that.hideItems()
    that.addCallToAction()
    try {
      module.removeChild(this)
    } catch (err) {
      module.parentNode.removeChild(this)
    }
    module.setAttribute('aria-expanded', false)
  })
  if (this.$module.getAttribute('data-show-more-position') === 'after') {
    module.insertAdjacentElement('afterend', showLessHtml)
  } else {
    module.append(showLessHtml)
  }
  this.classToAdd()
}

ShowMore.prototype.addAriaAttributes = function () {
  const module = this.$module
  module.setAttribute('aria-expanded', false)
}
