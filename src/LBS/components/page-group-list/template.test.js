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
  })
})
