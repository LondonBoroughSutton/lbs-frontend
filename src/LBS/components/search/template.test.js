/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('search')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Search', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('search', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('input renders with id', () => {
      const $ = render('search', examples.default)

      const $component = $('.lbs-search__input')
      expect($component.attr('id')).toEqual('lbs-search__box')
    })

    it('input renders with name', () => {
      const $ = render('search', examples.default)

      const $component = $('.lbs-search__input')
      expect($component.attr('name')).toEqual('search')
    })

    it('input renders with placeholder="Search" by default', () => {
      const $ = render('search', examples.default)

      const $component = $('.lbs-search__input')
      expect($component.attr('placeholder')).toEqual('Search')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('search', examples.default)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('when it includes a placeholder', () => {
    it('renders the placeholder', () => {
      const $ = render('search', examples['with placeholder'])

      const $component = $('.lbs-search__input')
      expect($component.attr('placeholder')).toEqual('Search for advice, information and services')    })
  })

  // describe('with dependant components', () => {
  //   it('have correct nesting order', () => {
  //     const $ = render('search', examples.default)
  //
  //     const $component = $('.govuk-form-group > .govuk-input')
  //     expect($component.length).toBeTruthy()
  //   })
  //
  //   it('renders with label', () => {
  //     const $ = render('search', examples.default)
  //
  //     expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
  //   })
  //
  //   it('renders label with "for" attribute reffering the input "id"', () => {
  //     const $ = render('search', examples.default)
  //
  //     const $label = $('.govuk-label')
  //     expect($label.attr('for')).toEqual('input-example')
  //   })
  // })

  // describe('when it includes an autocomplete attribute', () => {
  //   it('renders the autocomplete attribute', () => {
  //     const $ = render('search', examples['with autocomplete attribute'])
  //
  //     const $component = $('.govuk-input')
  //     expect($component.attr('autocomplete')).toEqual('postal-code')
  //   })
  // })

})
