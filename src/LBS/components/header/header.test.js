const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];

/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/header', () => {
  describe('/components/header/preview', () => {
    describe('when JavaScript is available', () => {
      afterEach(async () => {
        await page.evaluate(() => window.sessionStorage.clear())
      })
      describe('the search function', () => {
        it('clicking search button should give self \'active\' class', async () => {
          await page.emulate(iPhone);
          await page.goto(baseUrl + '/components/header/preview', {waitUntil: 'load'})

          const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__mobile__search-btn').classList.contains('active'))
          await page.click('#lbs-header__mobile__search-btn')
          const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__mobile__search-btn').classList.contains('active'))
          expect(initialState).toBe(false)
          expect(newState).toBe(true)
        })

        it('clicking search button should give \'lbs-header__search\' \'active\' class', async () => {
          await page.emulate(iPhone);
          await page.goto(baseUrl + '/components/header/preview', {waitUntil: 'load'})

          const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__search').classList.contains('active'))
          await page.click('#lbs-header__mobile__search-btn')
          const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__search').classList.contains('active'))
          expect(initialState).toBe(false)
          expect(newState).toBe(true)
        })

        it('clicking search button should move focus to search input', async () => {
          await page.emulate(iPhone);
          await page.goto(baseUrl + '/components/header/preview', {waitUntil: 'load'})

          const initialState = await page.evaluateHandle(() => document.activeElement)
          await page.click('#lbs-header__mobile__search-btn')
          const newState = await page.evaluateHandle(() => document.activeElement)
          expect(initialState._remoteObject.className).toBe('HTMLBodyElement')
          expect(newState._remoteObject.className).toBe('HTMLInputElement')
        })
      })

      describe('the mobile nav function', () => {
        it('clicking mobile nav button should give self \'active\' class', async () => {
          await page.emulate(iPhone);
          await page.goto(baseUrl + '/components/header/preview', {waitUntil: 'load'})

          const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__mobile__menu-btn').classList.contains('active'))
          await page.click('#lbs-header__mobile__menu-btn')
          const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__mobile__menu-btn').classList.contains('active'))
          expect(initialState).toBe(false)
          expect(newState).toBe(true)
        })

        it('clicking mobile nav button should give \'lbs-header__navigation_container\' \'active\' class', async () => {
          await page.emulate(iPhone);
          await page.goto(baseUrl + '/components/header/preview', {waitUntil: 'load'})

          const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__navigation_container').classList.contains('active'))
          await page.click('#lbs-header__mobile__menu-btn')
          const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__navigation_container').classList.contains('active'))
          expect(initialState).toBe(false)
          expect(newState).toBe(true)
        })

        it('clicking search button should move focus to search input', async () => {
          await page.emulate(iPhone);
          await page.goto(baseUrl + '/components/header/preview', {waitUntil: 'load'})

          const initialState = await page.evaluateHandle(() => document.activeElement)
          await page.click('#lbs-header__mobile__search-btn')
          const newState = await page.evaluateHandle(() => document.activeElement)
          expect(initialState._remoteObject.className).toBe('HTMLBodyElement')
          expect(newState._remoteObject.className).toBe('HTMLInputElement')
        })
      })

      describe('the main navigation menu', () => {
        it('interacting with a on level 1 nav item alters aria-expanded value', async () => {
          await page.emulate(puppeteer.devices['iPad landscape']);
          await page.goto(baseUrl + '/components/header/preview', {waitUntil: 'load'})

          const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__navigation a:first-of-type').getAttribute('aria-expanded'))
          await page.click('.lbs-header__navigation__item--level1')
          const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__navigation a:first-of-type').getAttribute('aria-expanded'))
          expect(initialState).toBe('false')
          expect(newState).toBe('true')
        })
      })
    })
  })
})
