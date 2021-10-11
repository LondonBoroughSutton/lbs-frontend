import { nodeListForEach, ShowMore } from './common'
import Card from './components/card/card'
import Header from './components/header/header'
import Search from './components/search/search'
import Tabs from './components/tabs/tabs'

function initAll (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document

  var $headers = scope.querySelectorAll('.lbs-header')
  nodeListForEach($headers, function ($header) {
    new Header($header).init()
  })

  var $tabs = scope.querySelectorAll('.lbs-tabs')
  nodeListForEach($tabs, function ($tabGroup) {
    new Tabs($tabGroup).init()
  })

  var $cards = scope.querySelectorAll('.lbs-card')
  nodeListForEach($cards, function ($card) {
    new Card($card).init()
  })
  new Card().setHeight()

  var $showMoreWrappers = scope.querySelectorAll('[data-show-more]')
  nodeListForEach($showMoreWrappers, function ($showMoreWrapper) {
    new ShowMore($showMoreWrapper)
  })

}

export {
  initAll,
  Card,
  Header,
  Search,
  Tabs
}
