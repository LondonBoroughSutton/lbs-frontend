/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/page-feedback', () => {
  describe('when JavaScript is available', () => {
    afterEach(async () => {
      await page.evaluate(() => window.sessionStorage.clear())
    })
    describe('the click `show form` function', () => {
      it('clicking the button should remove the button visually', async () => {
        await page.goto(baseUrl + '/components/page-feedback/preview', { waitUntil: 'load' })
        const initialState = await page.evaluate(() => document.querySelector('.lbs-page-feedback__prompt').classList.contains('js_is-hidden'))
        await page.click('button[aria-controls="lbs-page-feedback__form"]')
        const newState = await page.evaluate(() => document.querySelector('.lbs-page-feedback__prompt').classList.contains('js_is-hidden'))
        expect(initialState).toBe(false)
        expect(newState).toBe(true)
      })
      it('clicking the button should add a `hide` CTA', async () => {
        await page.goto(baseUrl + '/components/page-feedback/preview', { waitUntil: 'load' })
        const initialState = await page.evaluate(() => document.querySelector('#lbs-page-feedback__form .lbs-button--secondary') == null)
        await page.click('button[aria-controls="lbs-page-feedback__form"]')
        const newState = await page.evaluate(() => document.querySelector('#lbs-page-feedback__form .lbs-button--secondary') == null)
        expect(initialState).toBe(true)
        expect(newState).toBe(false)
      })
    })
  })
})
