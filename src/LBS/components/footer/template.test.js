/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('footer')

// const WORD_BOUNDARY = '\\b'
// const WHITESPACE = '\\s'

describe('Footer', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('footer', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })
  })
})
