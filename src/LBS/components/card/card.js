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
}

Card.prototype.handleClickable = function () {
    if (this.$module.querySelector('a') !== null) {
      this.$module.addEventListener('click', () => {
        this.$module.querySelector('a').click();
      });
    }
}

export default Card
