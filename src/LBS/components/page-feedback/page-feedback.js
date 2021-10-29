function PageFeedback ($module) {
  this.$module = $module
  this.jshiddenClass = 'js_is-hidden'
  this.jsShowClass = 'js_show'
  this.prompt = 'lbs-page-feedback__prompt'
  this.feedbackForm = 'lbs-page-feedback__form'
  this.formToggleButton = 'lbs-page-feedback__form'
}

/**
 * Initialise PageFeedback
 *
 * Check for the presence of page feedback form
 */

PageFeedback.prototype.init = function () {
  if (!this.$module) {
    return
  }
  this.setInitialAriaAttributes()
  this.$module.querySelector('[aria-controls=' + this.feedbackForm + ']').addEventListener('click', function (t) {
    t.preventDefault()
    this.toggleForm(t.target)
  }.bind(this))
}

PageFeedback.prototype.setInitialAriaAttributes = function () {
  document.getElementById(this.feedbackForm).setAttribute('aria-hidden', true)
}

PageFeedback.prototype.updateAriaAttributes = function (t) {
  t.setAttribute('aria-expanded', !0)
  document.querySelector('#' + t.getAttribute('aria-controls')).setAttribute('aria-hidden', !1)
}

PageFeedback.prototype.toggleForm = function (t) {
  this.$module.querySelector('.lbs-page-feedback__form').classList.toggle(this.jsShowClass)
  this.$module.querySelector('.lbs-page-feedback__prompt').classList.toggle(this.jshiddenClass)
  this.updateAriaAttributes(t)
}

export default PageFeedback
