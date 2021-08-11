import { nodeListForEach } from './common'
// import Header from './components/header/header'
import Tabs from './components/tabs/tabs'
import Example from './components/example/example'

function initAll (options) {
    // Set the options to an empty object by default if no options are passed.
    options = typeof options !== 'undefined' ? options : {}

    // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
    // Defaults to the entire document if nothing is set.
    var scope = typeof options.scope !== 'undefined' ? options.scope : document

    var $tabs = scope.querySelectorAll('[data-module="govuk-tabs"]')
    nodeListForEach($tabs, function ($tabs) {
        new Tabs($tabs).init()
    })
}

export {
    initAll,
    Tabs
}
