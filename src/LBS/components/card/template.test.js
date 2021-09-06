/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('card')

// const WORD_BOUNDARY = '\\b'
// const WHITESPACE = '\\s'

describe('Card', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('card', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('input renders with id', () => {
      const $ = render('card', examples.default)

      const $component = $('.lbs-card__input')
      expect($component.attr('id')).toEqual('lbs-card__box')
    })

    it('input renders with name', () => {
      const $ = render('card', examples.default)

      const $component = $('.lbs-card__input')
      expect($component.attr('name')).toEqual('card')
    })

    it('input renders with placeholder="Search" by default', () => {
      const $ = render('card', examples.default)

      const $component = $('.lbs-card__input')
      expect($component.attr('placeholder')).toEqual('Search')
    })

    it('renders with a form', () => {
      const $ = render('card', examples.default)

      const $formGroup = $('form')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('when it includes a placeholder', () => {
    it('renders the placeholder', () => {
      const $ = render('card', examples['with placeholder'])

      const $component = $('.lbs-card__input')
      expect($component.attr('placeholder')).toEqual('Search for advice, information and services')
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('card', examples.default)

      const $component = $('.lbs-card > .lbs-card__input')
      expect($component.length).toBeTruthy()
    })

    it('renders with form', () => {
      const $ = render('card', examples.default)

      expect(htmlWithClassName($, '.lbs-card')).toMatchSnapshot()
    })

    it('renders with label', () => {
      const $ = render('card', examples.default)

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders with button', () => {
      const $ = render('card', examples.default)

      expect(htmlWithClassName($, '.lbs-card__btn')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the input "id"', () => {
      const $ = render('card', examples.default)

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('lbs-card__box')
    })
  })

  // describe('when it includes an autocomplete attribute', () => {
  //   it('renders the autocomplete attribute', () => {
  //     const $ = render('card', examples['with autocomplete attribute'])
  //
  //     const $component = $('.govuk-input')
  //     expect($component.attr('autocomplete')).toEqual('postal-code')
  //   })
  // })
})
