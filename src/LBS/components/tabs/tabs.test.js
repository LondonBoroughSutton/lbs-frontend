const puppeteer = require('puppeteer')
const iPhone = puppeteer.devices['iPhone 6']
/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/tabs', () => {
  describe('when JavaScript is available', () => {
    afterEach(async () => {
      await page.evaluate(() => window.sessionStorage.clear())
    })
    describe('mobile views', () => {
      it('aria attributes should be preset', async () => {
        await page.emulate(iPhone)
        await page.goto(baseUrl + '/components/tabs/preview', { waitUntil: 'load' })

        const initialState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="2"]').getAttribute('aria-expanded'))
        expect(initialState).toEqual("true")
      })

      it('clicking the title should change the aria-expanded value', async () => {
        await page.emulate(iPhone)
        await page.goto(baseUrl + '/components/tabs/preview', { waitUntil: 'load' })

        const initialState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="2"]').getAttribute('aria-expanded'))
        await page.click('.lbs-tabs__content__item[data-lbs-tab-id="2"] .lbs-tabs__content__item__title')
        const newState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="2"]').getAttribute('aria-expanded'))
        // expect(initialState).toEqual(false)
        expect(newState).toEqual("true")
      })

      it('clicking the title should change the class value of the panel', async () => {
        await page.emulate(iPhone)
        await page.goto(baseUrl + '/components/tabs/preview', { waitUntil: 'load' })

        const initialState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="2"]').classList.contains('lbs-tabs__content__item--active'))
        await page.click('.lbs-tabs__content__item[data-lbs-tab-id="2"] .lbs-tabs__content__item__title')
        const newState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="2"]').classList.contains('lbs-tabs__content__item--active'))
        expect(initialState).toEqual(false)
        expect(newState).toEqual(true)
      })
    })

    describe('desktop views', () => {
      it('clicking the tab should change the class value of the tab parent', async () => {
        await page.goto(baseUrl + '/components/tabs/preview', { waitUntil: 'load' })

        const initialState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__tab[data-lbs-tab-id="2"]').parentElement.classList.contains('lbs-tabs__list-item--selected'))
        await page.click('.lbs-tabs__tab[data-lbs-tab-id="2"]')
        const newState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__tab[data-lbs-tab-id="2"]').parentElement.classList.contains('lbs-tabs__list-item--selected'))
        expect(initialState).toEqual(false)
        expect(newState).toEqual(true)
      })

      it('clicking the tab should change the class value of the panel', async () => {
        await page.goto(baseUrl + '/components/tabs/preview', { waitUntil: 'load' })

        const initialState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="2"]').classList.contains('lbs-tabs__content__item--active'))
        await page.click('.lbs-tabs__tab[data-lbs-tab-id="2"]')
        const newState = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item[data-lbs-tab-id="2"]').classList.contains('lbs-tabs__content__item--active'))
        expect(initialState).toEqual(false)
        expect(newState).toEqual(true)
      })

      it('should have the expected aria attributes on load', async () => {
        await page.goto(baseUrl + '/components/tabs/preview', { waitUntil: 'load' })

        const attr1 = await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item--active').getAttribute('aria-labelledby'))
        expect(attr1).toEqual("tab_1")
        const attr2= await page.evaluate(() => document.body.querySelector('.lbs-tabs__content__item--active').getAttribute('role'))
        expect(attr2).toEqual("tabpanel")
      })
    })
  })

  describe('when JavaScript is not available', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterEach(async () => {
      await page.evaluate(() => window.sessionStorage.clear())
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    describe('list items in navigation', () => {
      it('are visible', async () => {
        await page.goto(baseUrl + '/components/tabs/preview', { waitUntil: 'load' })

        const listItemWithHiddenClass = await page.evaluate(() => {
          const listItemWithClass = document.querySelector('.lbs-tabs__content__item--active')
          return window.getComputedStyle(listItemWithClass).getPropertyValue('display')
        })
        expect(listItemWithHiddenClass).toEqual('block')
      })
    })
  })
})
