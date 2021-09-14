/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('page-group-list')

// const WORD_BOUNDARY = '\\b'
// const WHITESPACE = '\\s'

describe('Page Group List', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-group-list', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with expected child elements', () => {
      const $ = render('page-group-list', examples.default)

      const title = $('.lbs-page-group-list .lbs-page-group-list__title')
      const body = $('.lbs-page-group-list ol')
      expect(title.length).toBeTruthy()
      expect(body.length).toBeTruthy()
    })

    it('renders default heading', () => {
      const $ = render('page-group-list', examples.default)

      const title = $('.lbs-page-group-list .lbs-page-group-list__title')
      expect(title.text()).toEqual('In this section:')
    })

    it('renders one `current` item', () => {
      const $ = render('page-group-list', examples.default)

      const current = $('.lbs-page-group-list .lbs-page-group-list__item--active')
      expect(current.length).toEqual(1)
    })

    it('renders one `current` item without a link', () => {
      const $ = render('page-group-list', examples.default)

      const current = $('.lbs-page-group-list .lbs-page-group-list__item--active a')
      expect(current.length).toEqual(0)
    })

    it('renders two links', () => {
      const $ = render('page-group-list', examples.default)

      const current = $('.lbs-page-group-list a')
      expect(current.length).toEqual(2)
    })
  })
})
