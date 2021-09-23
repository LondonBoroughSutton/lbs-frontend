/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('page-group-navigation')

// const WORD_BOUNDARY = '\\b'
// const WHITESPACE = '\\s'

describe('Page Group List', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-group-navigation', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    // it('renders with expected child elements', () => {
    //   const $ = render('page-group-navigation', examples.default)
    //
    //   const title = $('.lbs-page-group-navigation .lbs-page-group-navigation__title')
    //   const body = $('.lbs-page-group-navigation ol')
    //   expect(title.length).toBeTruthy()
    //   expect(body.length).toBeTruthy()
    // })
    //
    // it('renders default heading', () => {
    //   const $ = render('page-group-navigation', examples.default)
    //
    //   const title = $('.lbs-page-group-navigation .lbs-page-group-navigation__title')
    //   expect(title.text()).toEqual('In this section:')
    // })
    //
    // it('renders one `current` item', () => {
    //   const $ = render('page-group-navigation', examples.default)
    //
    //   const current = $('.lbs-page-group-navigation .lbs-page-group-navigation__item--active')
    //   expect(current.length).toEqual(1)
    // })
    //
    // it('renders one `current` item without a link', () => {
    //   const $ = render('page-group-navigation', examples.default)
    //
    //   const current = $('.lbs-page-group-navigation .lbs-page-group-navigation__item--active a')
    //   expect(current.length).toEqual(0)
    // })
    //
    // it('renders two links', () => {
    //   const $ = render('page-group-navigation', examples.default)
    //
    //   const current = $('.lbs-page-group-navigation a')
    //   expect(current.length).toEqual(2)
    // })
  })
})
