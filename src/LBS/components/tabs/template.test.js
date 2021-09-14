/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('tabs')

describe('Tabs', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('tabs', examples.default)
      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    // it('has correct nesting order', () => {
    //   const $ = render('tabs', examples.default)
    //   const $component = $('.lbs-card > h2')
    //   expect($component.length).toBeTruthy()
    // })
    //
    // it('matches snapshot', () => {
    //   const $ = render('tabs', examples.default)
    //   expect(htmlWithClassName($, '.lbs-card')).toMatchSnapshot()
    // })
  })

  // describe('link in header example', () => {
  //   it('has a link in the header', () => {
  //     const $ = render('tabs', examples['card with link in header'])
  //     const $component = $('.lbs-card > h2 a')
  //     expect($component.length).toBeTruthy()
  //   })
  // })

  // describe('alt background version', () => {
  //   it('has expected class', () => {
  //     const $ = render('tabs', examples['card with background colour'])
  //     const $component = $('.lbs-card--alt')
  //     expect($component.length).toBeTruthy()
  //   })
  // })

  // describe('navigation list examples', () => {
  //   it('passes accessibility tests', async () => {
  //     const $ = render('tabs', examples['card with links'])
  //
  //     const results = await axe($.html())
  //     expect(results).toHaveNoViolations()
  //   })
  //
  //   it('contains an unordered list', () => {
  //     const $ = render('tabs', examples['card with links'])
  //
  //     const $component = $('.lbs-card ul')
  //     expect($component.length).toBeTruthy()
  //   })
  //
  //   it('contains only 3 list items', () => {
  //     const $ = render('tabs', examples['card with links'])
  //     const $component = $('.lbs-card ul li')
  //     expect($component.length).toEqual(3)
  //   })
  //
  //   it('matches snapshot', () => {
  //     const $ = render('tabs', examples['card with links'])
  //     expect($).toMatchSnapshot()
  //   })
  // })

  // describe('popular items', () => {
  //   it('passes accessibility tests', async () => {
  //     const $ = render('tabs', examples['popular item'])
  //
  //     const results = await axe($.html())
  //     expect(results).toHaveNoViolations()
  //   })
  //
  //   it('renders as an anchor element', () => {
  //     const $ = render('tabs', examples['popular item'])
  //     const $component = $('.lbs-card')
  //     expect($component[0].name).toBe('a')
  //   })
  //
  //   it('contains expected classes', () => {
  //     const $ = render('tabs', examples['popular item'])
  //     const $component = $('.lbs-card')
  //     expect($component[0].attribs.class).toContain('lbs-card--popular-item')
  //     expect($component[0].attribs.class).toContain('lbs-card--clickable')
  //   })
  //
  //   it('matches snapshot', () => {
  //     const $ = render('tabs', examples['popular item'])
  //     expect($).toMatchSnapshot()
  //   })
  // })

  // describe('navigation list examples', () => {
  //   it('passes accessibility tests', async () => {
  //     const $ = render('tabs', examples['card with increased limit of links and `show more` feature'])
  //
  //     const results = await axe($.html())
  //     expect(results).toHaveNoViolations()
  //   })
  //
  //   it('contains an unordered list', () => {
  //     const $ = render('tabs', examples['card with increased limit of links and `show more` feature'])
  //     const $component = $('.lbs-card ul')
  //     expect($component.length).toBeTruthy()
  //   })
  //
  //   it('contains only 3 list items without the `js__is-hidden` class', () => {
  //     const $ = render('tabs', examples['card with increased limit of links and `show more` feature'])
  //     const $component = $('.lbs-card ul li:not(.js__is-hidden)')
  //     expect($component.length).toEqual(3)
  //   })
  //
  //   it('matches snapshot', () => {
  //     const $ = render('tabs', examples['card with links'])
  //     expect($).toMatchSnapshot()
  //   })
  // })
})
