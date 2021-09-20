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
