function Card ($module) {
  this.$module = $module
}

/**
 * Initialise header
 *
 * Check for the presence of cards - if any are
 * missing then there's nothing to do so return early.
 */
Card.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (this.$module.classList.contains('lbs-card--clickable')) {
    this.handleClickable()
  }
  if (this.$module.querySelector('.js__is-hidden')) {
    this.showAllItems()
  }
}

Card.prototype.handleClickable = function () {
    if (this.$module.querySelector('a') !== null) {
      this.$module.addEventListener('click', () => {
        this.$module.querySelector('a').click();
      });
    }
}

Card.prototype.showAllItems = function () {
  const module = this.$module
  const itemCount = this.$module.querySelectorAll('.js__is-hidden').length
  // const showMoreHtml = '<a href="">Show more items (' + itemCount + ')</a>'
  const showMoreHtml = document.createElement("a")
  showMoreHtml.innerText = 'Show more items (' + itemCount + ')'
  showMoreHtml.addEventListener('click', function(e) {
    module.querySelector('ul').classList.add('show-hidden')
    e.preventDefault()
  })
  console.log(showMoreHtml)
  // this.$module.insertAdjacentHTML('beforeend', showMoreHtml);
  this.$module.append(showMoreHtml);
}

export default Card
