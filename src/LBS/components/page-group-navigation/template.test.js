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

    it('renders with expected child elements', () => {
      const $ = render('page-group-navigation', examples.default)

      const container = $('.lbs-page-group__navigation .lbs-page-group__navigation__list')
      const body = $('.lbs-page-group__navigation__list-item')
      expect(container.length).toBeTruthy()
      expect(body.length).toEqual(2)
    })

    it('renders with expected child elements inside nav item', () => {
      const $ = render('page-group-navigation', examples.default)

      const item1 = $('.lbs-page-group__navigation__list-item--previous .lbs-page-group__navigation__list-item__icon')
      const item2 = $('.lbs-page-group__navigation__list-item--previous .lbs-page-group__navigation__list-item__link-direction')
      const item3 = $('.lbs-page-group__navigation__list-item--previous .lbs-page-group__navigation__list-item__text')
      expect(item1.length).toBeTruthy()
      expect(item2.length).toBeTruthy()
      expect(item3.length).toBeTruthy()
    })
  })
})
