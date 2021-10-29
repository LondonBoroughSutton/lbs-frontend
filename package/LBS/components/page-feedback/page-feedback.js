(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('LBSFrontend', factory) :
	(global.LBSFrontend = factory());
}(this, (function () { 'use strict';

function PageFeedback ($module) {
  this.$module = $module;
  this.jshiddenClass = 'js_is-hidden';
  this.jsShowClass = 'js_show';
  this.prompt = 'lbs-page-feedback__prompt';
  this.feedbackForm = 'lbs-page-feedback__form';
  this.formToggleButton = 'lbs-page-feedback__form';
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
  console.log('Page Feedback');
  console.log(this.formToggleButton);
  this.setInitialAriaAttributes();
  this.$module.querySelector('[aria-controls="lbs-page-feedback"]').addEventListener("click", function(t) {
    console.log('Clicked');
    t.preventDefault();
    let e = t.target;
    this.toggleForm();
  }.bind(this));
};

PageFeedback.prototype.setInitialAriaAttributes = function() {
  console.log('set values');
  document.getElementById(this.feedbackForm).setAttribute('aria-hidden', true);
};

PageFeedback.prototype.updateAriaAttributes = function(t) {
  console.log('updateAriaAttributes');
  // t.setAttribute("aria-expanded", !0);
  // var e = t.getAttribute("aria-controls");
  // document.querySelector("#" + e).setAttribute("aria-hidden", !1)
};

PageFeedback.prototype.toggleForm = function() {
  console.log('toggle form');
  this.$module.querySelector('.lbs-page-feedback__form').classList.toggle(this.jsShowClass);
  this.$module.querySelector('.lbs-page-feedback__prompt').classList.toggle(this.jshiddenClass);
  // this.feedbackForm.classList.toggle(this.jshiddenClass)
  this.updateAriaAttributes();
};

return PageFeedback;

})));
