/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('header')

// const WORD_BOUNDARY = '\\b'
// const WHITESPACE = '\\s'

describe('Header', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('header', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('input renders with banner role', () => {
      const $ = render('header', examples.default)

      const $component = $('.lbs-header')
      expect($component.attr('role')).toEqual('banner')
    })

    it('contains logo', () => {
      const $ = render('header', examples.default)

      const $component = $('.lbs-header .lbs-header__logo svg')
      expect($component.length).toBeTruthy()
    })

    it('contains Sutton.gov.uk for assistive technologies', () => {
      const $ = render('header', examples.default)

      const $component = $('.lbs-header .lbs-header__logo span')
      expect($component.text()).toContain('Sutton.gov.uk')
    })
  })

  describe('when it is instructed to omit items', () => {
    it('renders without the search', () => {
      const $ = render('header', examples['with no search'])

      const $component = $('.lbs-header #lbs-header__search')
      expect($component.length).not.toBeTruthy()
      expect(htmlWithClassName($, '.lbs-header')).toMatchSnapshot()
    })

    it('renders without the search but with the nav', () => {
      const $ = render('header', examples['with no search'])

      const $component = $('.lbs-header #lbs-header__search')
      expect($component.length).not.toBeTruthy()
      const $component2 = $('.lbs-header #lbs-header__navigation_container')
      expect($component2.length).toBeTruthy()
      expect(htmlWithClassName($, '.lbs-header')).toMatchSnapshot()
    })
  })

  it('renders without the nav', () => {
    const $ = render('header', examples['with no navigation'])

    const $component = $('.lbs-header > #lbs-header__navigation_container')
    expect($component.length).not.toBeTruthy()
    expect(htmlWithClassName($, '.lbs-header')).toMatchSnapshot()
  })

  it('renders without the nav but with the search', () => {
    const $ = render('header', examples['with no navigation'])

    const $component = $('.lbs-header #lbs-header__search')
    expect($component.length).toBeTruthy()
    const $component2 = $('.lbs-header > #lbs-header__navigation_container')
    expect($component2.length).not.toBeTruthy()
    expect(htmlWithClassName($, '.lbs-header')).toMatchSnapshot()
  })

  it('renders without the nav and without the search', () => {
    const $ = render('header', examples['with no navigation or search'])

    const $component = $('.lbs-header #lbs-header__search')
    expect($component.length).not.toBeTruthy()
    const $component2 = $('.lbs-header #lbs-header__navigation_container')
    expect($component2.length).not.toBeTruthy()
    expect(htmlWithClassName($, '.lbs-header')).toMatchSnapshot()
  })

  // Todo - add tests to cover JS interaction on mobile e.g. focus shifts to input on click and nav opens on click
})
