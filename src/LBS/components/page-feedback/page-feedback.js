function PageFeedback ($module) {
  this.$module = $module
  this.jshiddenClass = 'js_is-hidden'
  this.jsShowClass = 'js_show'
  this.prompt = 'lbs-page-feedback__prompt'
  this.formController = this.$module.querySelector('[aria-controls=' + this.feedbackForm + ']')
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
    this.addHideButton()
  }.bind(this))
}

PageFeedback.prototype.setInitialAriaAttributes = function () {
  document.getElementById(this.feedbackForm).setAttribute('aria-hidden', true)
}

PageFeedback.prototype.updateAriaAttributes = function (t) {
    if (t.getAttribute('aria-expanded') === 1) {
      t.setAttribute('aria-expanded', !0)
      document.querySelector('#' + t.getAttribute('aria-controls')).setAttribute('aria-hidden', !1)
    } else {
      t.setAttribute('aria-expanded', !1)
      document.querySelector('#' + t.getAttribute('aria-controls')).setAttribute('aria-hidden', !0)
    }
}

PageFeedback.prototype.toggleForm = function (t) {
  this.$module.querySelector('.lbs-page-feedback__form').classList.toggle(this.jsShowClass)
  this.$module.querySelector('.lbs-page-feedback__prompt').classList.toggle(this.jshiddenClass)
  this.updateAriaAttributes(t)
}

PageFeedback.prototype.addHideButton = function (t) {
  const closeForm = document.createElement('a')
  const module = this.$module
  const that = this
  closeForm.innerText = 'Close'
  closeForm.setAttribute('class', 'lbs-button--secondary lbs-button govuk-button')
  closeForm.setAttribute('id', 'lbs-feedback__form--hide-button')
  closeForm.setAttribute('href', '#')
  closeForm.setAttribute('aria-controls', this.feedbackForm)
  closeForm.setAttribute('role', 'button')
  closeForm.addEventListener('click', function (e) {
    e.preventDefault()
    module.querySelector('#lbs-feedback__form--hide-button').remove()
    that.toggleForm(e.target)
  })
  this.$module.querySelector('form').prepend(closeForm)
}

export default PageFeedback
