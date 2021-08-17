import { nodeListForEach } from './common'
import Example from './components/example/example'
import Header from './components/header/header'
import Tabs from './components/tabs/tabs'
import Search from './components/search/search'

function initAll (options) {
    // Set the options to an empty object by default if no options are passed.
    options = typeof options !== 'undefined' ? options : {}

    // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
    // Defaults to the entire document if nothing is set.
    var scope = typeof options.scope !== 'undefined' ? options.scope : document

    // var $tabs = scope.querySelectorAll('[data-module="govuk-tabs"]')
    // nodeListForEach($tabs, function ($tabs) {
    //     new Tabs($tabs).init()
    // })

    var $example = scope.querySelectorAll('.lbs_example')
    nodeListForEach($example, function ($example) {
        new Example($example) // Don't need to init
    })

    var $headers = scope.querySelectorAll('.lbs-header')
    nodeListForEach($headers, function ($header) {
        new Header($header)
        let menu = false
        if (document.getElementById('lbs-header__navigation')) {

        }
    })
}

export {
    initAll,
    Example,
    Header,
    Search
}
