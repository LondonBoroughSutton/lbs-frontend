import { nodeListForEach, ShowMore } from './common'
import Card, { Cards } from './components/card/card'
import Header from './components/header/header'
import PageFeedback from './components/page-feedback/page-feedback'
import PageGroupNavigation from './components/page-group-navigation/page-group-navigation'
import Search from './components/search/search'
import Tabs from './components/tabs/tabs'

function initAll (options) {
  // Set the options to an empty object by default if no options are passed.
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  const scope = typeof options.scope !== 'undefined' ? options.scope : document

  // const $headers = scope.querySelectorAll('.lbs-header')
  // nodeListForEach($headers, function ($header) {
  //   new Header($header).init()
  // })

  const $headers = scope.querySelectorAll('[data-module="super-navigation-mega-menu"]')
  nodeListForEach($headers, function ($header) {
    // console.log('Initted')
    new Header($header).init()
  })

  const $tabs = scope.querySelectorAll('.lbs-tabs')
  nodeListForEach($tabs, function ($tabGroup) {
    new Tabs($tabGroup).init()
  })

  const $cards = scope.querySelectorAll('.lbs-card')
  nodeListForEach($cards, function ($card) {
    new Card($card).init()
  })
  // new Card().setHeight()
  const $cardContainers = scope.querySelectorAll('.lbs-card__wrapper')
  nodeListForEach($cardContainers, function ($cardContainer) {
    new Cards($cardContainer).init()
  })

  const $pageFeedbackItems = scope.querySelectorAll('.lbs-page-feedback')
  nodeListForEach($pageFeedbackItems, function ($pageFeedback) {
    new PageFeedback($pageFeedback).init()
  })

  const $pageGroupNavigation = scope.querySelectorAll('.lbs-page-group__navigation')
  nodeListForEach($pageGroupNavigation, function ($pageGroupNavigationItem) {
    new PageGroupNavigation($pageGroupNavigationItem).init()
  })

  // let $showMoreWrappers = scope.querySelectorAll('[data-show-more]')
  // nodeListForEach($showMoreWrappers, function ($showMoreWrapper) {
  //   new ShowMore($showMoreWrapper).init()
  // })
}

export {
  initAll,
  Card,
  Cards,
  Header,
  PageFeedback,
  PageGroupNavigation,
  Search,
  ShowMore,
  Tabs
}
