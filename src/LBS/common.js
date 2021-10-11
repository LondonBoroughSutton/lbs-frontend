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

// export const showMore = (targetWrapper, targetItems, count) => {
//   console.log('Hello')
// }

// Common function to only show a subset of items and insert CTA to show them

export function ShowMore ($module) {
  this.$module = $module
  // const count = parseInt($module.getAttribute('data-show-count')) || 6 // Roadmap item - add data item to dictate how many items to show

  this.addCallToAction()
  if (this.$module.getAttribute('data-show-more-type')) {
    this.addClassToCallToAction(this.$module.getAttribute('data-show-more-type'))
  }
}

ShowMore.prototype.addCallToAction = function () {
  const module = this.$module
  const itemCount = this.$module.querySelectorAll('.js__is-hidden').length
  const showMoreHtml = document.createElement('a')
  showMoreHtml.innerText = 'Show more items (' + itemCount + ')'
  showMoreHtml.setAttribute('class', 'show-more-link')
  showMoreHtml.setAttribute('href', '#')
  showMoreHtml.addEventListener('click', function (e) {
    module.classList.add('show-hidden')
    module.removeChild(this)
    e.preventDefault()
  })
  console.log('S: ' + showMoreHtml)
  module.append(showMoreHtml)
}

ShowMore.prototype.addClassToCallToAction = function (classes) {
  console.log('Enter')
  const module = this.$module

  DOMTokenList.prototype.addMany = function(classes) {
    var array = classes.split(' ');
    for (var i = 0, length = array.length; i < length; i++) {
      this.add(array[i]);
    }
  }
  console.log(module.querySelector('.show-more-link'))
  module.querySelector('.show-more-link').classList.addMany(classes)
  console.log(module.querySelector('.show-more-link'))
}
