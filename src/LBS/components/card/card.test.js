/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/card', () => {
  describe('when JavaScript is available', () => {
    afterEach(async () => {
      await page.evaluate(() => window.sessionStorage.clear())
    })
    describe('the clickable function', () => {
      it('clicking anywhere on the card should change document.location', async () => {
        await page.goto(baseUrl + '/components/card/clickable-card/preview', { waitUntil: 'load' })

        const initialState = await page.evaluate(() => document.location)
        await page.click('.lbs-card')
        const newState = await page.evaluate(() => document.location)
        expect(initialState).not.toEqual(newState)
      })
    })

    describe('the `show more` function', () => {
      it('the `show more` cta exists on the page', async () => {
        await page.goto(baseUrl + '/components/card/card-with-increased-limit-of-links-and-%60show-more%60-feature/preview', { waitUntil: 'load' })
        const hasCta = await page.evaluateHandle(() => document.querySelector('.show-more-link'))
        expect(hasCta._remoteObject.description).toEqual('a.show-more-link')
      })

      it('clicking `show more` button should give \'ul\' \'active\' class', async () => {
        await page.goto(baseUrl + '/components/card/card-with-increased-limit-of-links-and-%60show-more%60-feature/preview', { waitUntil: 'load' })

        const initialState = await page.evaluate(() => document.body.querySelector('.lbs-card ul').classList.contains('show-hidden'))
        await page.click('.show-more-link')
        const newState = await page.evaluate(() => document.body.querySelector('.lbs-card ul').classList.contains('show-hidden'))
        expect(initialState).toBe(false)
        expect(newState).toBe(true)
      })
    })

    describe('list items in navigation', () => {
      it('are hidden by default', async () => {
        await page.goto(baseUrl + '/components/card/card-with-increased-limit-of-links-and-%60show-more%60-feature/preview', { waitUntil: 'load' })

        const listItemWithHiddenClass = await page.evaluate(() => {
          const listItemWithClass = document.querySelector('.lbs-card .js__is-hidden')
          return window.getComputedStyle(listItemWithClass).getPropertyValue('display')
        })
        expect(listItemWithHiddenClass).toEqual('none')
      })

      it('are visible after `show more` CTA is clicked', async () => {
        await page.goto(baseUrl + '/components/card/card-with-increased-limit-of-links-and-%60show-more%60-feature/preview', { waitUntil: 'load' })
        await page.click('.show-more-link')

        const listItemWithHiddenClass = await page.evaluate(() => {
          const listItemWithClass = document.querySelector('.lbs-card .js__is-hidden')
          return window.getComputedStyle(listItemWithClass).getPropertyValue('display')
        })
        expect(listItemWithHiddenClass).toEqual('list-item')
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
        await page.goto(baseUrl + '/components/card/card-with-increased-limit-of-links-and-%60show-more%60-feature/preview', { waitUntil: 'load' })

        const listItemWithHiddenClass = await page.evaluate(() => {
          const listItemWithClass = document.querySelector('.lbs-card .js__is-hidden')
          return window.getComputedStyle(listItemWithClass).getPropertyValue('display')
        })
        expect(listItemWithHiddenClass).toEqual('list-item')
      })
    })
  })
})
