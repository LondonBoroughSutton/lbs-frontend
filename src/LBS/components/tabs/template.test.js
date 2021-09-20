/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('tabs')

describe('Tabs', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('tabs', examples.default)
      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders the first tab selected', () => {
      const $ = render('tabs', examples.default)

      const $tab = $('.lbs-tabs__tab').parent()
      expect($tab.hasClass('lbs-tabs__list-item--selected')).toBeTruthy()
    })

    it('other tabs are not selected', () => {
      const $ = render('tabs', examples.default)

      expect($('.lbs-tabs__list-item:nth-child(2)').hasClass('lbs-tabs__list-item--selected')).not.toBeTruthy()
      expect($('.lbs-tabs__list-item:nth-child(3)').hasClass('lbs-tabs__list-item--selected')).not.toBeTruthy()
    })

    it('hides all but the first panel', () => {
      const $ = render('tabs', examples.default)

      expect($('.lbs-tabs__content__item:nth-child(1)').hasClass('lbs-tabs__content__item--active')).toBeTruthy()
      expect($('.lbs-tabs__content__item:nth-child(2)').hasClass('lbs-tabs__content__item--active')).not.toBeTruthy()
      expect($('.lbs-tabs__content__item:nth-child(3)').hasClass('lbs-tabs__content__item--active')).not.toBeTruthy()
    })
  })
  describe('items', () => {
    it('doesn\'t render a list if items is not defined', () => {
      const $ = render('tabs', examples['no items'])

      const $component = $('.lbs-tabs')
      expect($component.find('.lbs-tabs__list').length).toEqual(0)
    })
  })

  it('doesn\'t render a list if items is empty', () => {
    const $ = render('tabs', examples['empty items'])

    const $component = $('.lbs-tabs')
    expect($component.find('.lbs-tabs__list').length).toEqual(0)
  })

  it('render the label', () => {
    const $ = render('tabs', examples.default)

    const $component = $('.lbs-tabs')

    const $firstTab = $component.find('.lbs-tabs__list-item:first-child .lbs-tabs__tab')
    expect($firstTab.text().trim()).toEqual('Item 1')
  })

  it('render title', () => {
    const $ = render('tabs', examples.html)

    const $component = $('.lbs-tabs__content')

    const $firstPanel = $component.find('.lbs-tabs__content__item__title')
    expect($firstPanel.html().trim()).toEqual('Item 1')
  })

  it('render title in a H2 tag by default', () => {
    const $ = render('tabs', examples.html)

    const $component = $('.lbs-tabs__content')

    const $firstPanel = $component.find('.lbs-tabs__content__item__title')
    expect($firstPanel.get(0).tagName).toEqual('h2')
  })


  it('render title in a specified tag if instructed', () => {
    const $ = render('tabs', examples['with H3 headings'])

    const $component = $('.lbs-tabs__content')

    const $firstPanel = $component.find('.lbs-tabs__content__item__title')
    expect($firstPanel.get(0).tagName).toEqual('h3')
  })

  it('render html when passed to content', () => {
    const $ = render('tabs', examples.html)

    const $component = $('.lbs-tabs__content')

    const $firstPanel = $component.find('.lbs-tabs__content__item__container')
    expect($firstPanel.html().trim()).toEqual('<p>This is a <strong>test</strong></p>')
  })
})
