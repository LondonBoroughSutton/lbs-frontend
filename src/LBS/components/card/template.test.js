/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('card')

describe('Card', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('card', examples.default)
      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('has correct nesting order', () => {
      const $ = render('card', examples.default)
      const $component = $('.lbs-card > h2')
      expect($component.length).toBeTruthy()
    })

    it('matches snapshot', () => {
      const $ = render('card', examples.default)
      expect(htmlWithClassName($, '.lbs-card')).toMatchSnapshot()
    })
  })

  describe('link in header example', () => {
    it('has a link in the header', () => {
      const $ = render('card', examples['card with link in header'])
      const $component = $('.lbs-card > h2 a')
      expect($component.length).toBeTruthy()
    })
  })

  describe('alt background version', () => {
    it('has expected class', () => {
      const $ = render('card', examples['card with background colour'])
      const $component = $('.lbs-card--alt')
      expect($component.length).toBeTruthy()
    })
  })

  describe('navigation list examples', () => {
    it('passes accessibility tests', async () => {
      const $ = render('card', examples['card with links'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('contains an unordered list', () => {
      const $ = render('card', examples['card with links'])

      const $component = $('.lbs-card ul')
      expect($component.length).toBeTruthy()
    })

    it('contains only 3 list items', () => {
      const $ = render('card', examples['card with links'])
      const $component = $('.lbs-card ul li')
      expect($component.length).toEqual(3)
    })

    it('matches snapshot', () => {
      const $ = render('card', examples['card with links'])
      expect($).toMatchSnapshot()
    })
  })

  describe('navigation list examples', () => {
    it('passes accessibility tests', async () => {
      const $ = render('card', examples['card with increased limit of links and `show more` feature'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('contains an unordered list', () => {
      const $ = render('card', examples['card with increased limit of links and `show more` feature'])
      const $component = $('.lbs-card ul')
      expect($component.length).toBeTruthy()
    })

    it('contains only 3 list items without the `js__is-hidden` class', () => {
      const $ = render('card', examples['card with increased limit of links and `show more` feature'])
      const $component = $('.lbs-card ul li:not(.js__is-hidden)')
      expect($component.length).toEqual(3)
    })

    it('matches snapshot', () => {
      const $ = render('card', examples['card with links'])
      expect($).toMatchSnapshot()
    })
  })
})
