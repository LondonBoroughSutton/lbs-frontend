function PageFeedback ($module) {
  this.$module = $module
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
  console.log('Page Feedback')
}

export default PageFeedback
