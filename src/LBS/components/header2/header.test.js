const puppeteer = require('puppeteer')
const iPhone = puppeteer.devices['iPhone 6']

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

      describe('on mobile devices', () => {

        describe('the search function', () => {
          // it('clicking search button should give self \'open\' class', async () => {
          //   await page.emulate(iPhone)
          //   await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })
          //
          //   const initialState = await page.evaluate(() => document.body.querySelector('button[aria-controls="super-search-menu"]').classList.contains('gem-c-layout-super-navigation-header__open-button'))
          //   await page.click('button[aria-controls="super-search-menu"]')
          //   const newState = await page.evaluate(() => document.body.querySelector('button[aria-controls="super-search-menu"]').classList.contains('gem-c-layout-super-navigation-header__open-button'))
          //   expect(initialState).toBe(false)
          //   expect(newState).toBe(true)
          // })

          // it('clicking search button should give \'lbs-header__search\' \'active\' class', async () => {
          //   await page.emulate(iPhone)
          //   await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })
          //
          //   const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__search').classList.contains('active'))
          //   await page.click('#lbs-header__mobile__search-btn')
          //   const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__search').classList.contains('active'))
          //   expect(initialState).toBe(false)
          //   expect(newState).toBe(true)
          // })

        })

        describe('the mobile nav function', () => {
          it('clicking mobile nav button should give self \'active\' class', async () => {
            await page.emulate(iPhone)
            await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

            const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__mobile__menu-btn').classList.contains('active'))
            await page.click('#lbs-header__mobile__menu-btn')
            const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__mobile__menu-btn').classList.contains('active'))
            expect(initialState).toBe(false)
            expect(newState).toBe(true)
          })

          it('clicking mobile nav button should give \'lbs-header__navigation_container\' \'active\' class', async () => {
            await page.emulate(iPhone)
            await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

            const initialState = await page.evaluate(() => document.body.querySelector('#lbs-header__navigation_container').classList.contains('active'))
            await page.click('#lbs-header__mobile__menu-btn')
            const newState = await page.evaluate(() => document.body.querySelector('#lbs-header__navigation_container').classList.contains('active'))
            expect(initialState).toBe(false)
            expect(newState).toBe(true)
          })

          it('clicking search button should move focus to search input', async () => {
            await page.emulate(iPhone)
            await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

            const initialState = await page.evaluateHandle(() => document.activeElement)
            await page.click('#lbs-header__mobile__search-btn')
            const newState = await page.evaluateHandle(() => document.activeElement)
            expect(initialState._remoteObject.className).toBe('HTMLBodyElement')
            expect(newState._remoteObject.className).toBe('HTMLInputElement')
          })
        })

      })

      describe('on desktop devices', () => {

        // describe('the search function', () => {
        //   it('clicking search button should give self \'open\' class', async () => {
        //     await page.emulate(iPhone)
        //     await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })
        //
        //     const initialState = await page.evaluate(() => document.body.querySelector('button[aria-controls="super-search-menu"]').classList.contains('gem-c-layout-super-navigation-header__open-button'))
        //     await page.click('button[aria-controls="super-search-menu"]')
        //     const newState = await page.evaluate(() => document.body.querySelector('button[aria-controls="super-search-menu"]').classList.contains('gem-c-layout-super-navigation-header__open-button'))
        //     expect(initialState).toBe(false)
        //     expect(newState).toBe(true)
        //   })

        })

      describe('on all devices', () => {

        describe('the search function', () => {
          it('clicking search button should give self \'open\' class', async () => {
            await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

            const initialState = await page.evaluate(() => document.body.querySelector('button[aria-controls="super-search-menu"]').classList.contains('gem-c-layout-super-navigation-header__open-button'))
            await page.click('button[aria-controls="super-search-menu"]')
            const newState = await page.evaluate(() => document.body.querySelector('button[aria-controls="super-search-menu"]').classList.contains('gem-c-layout-super-navigation-header__open-button'))
            expect(initialState).toBe(false)
            expect(newState).toBe(true)
          })

          it('clicking search button should move focus to search input', async () => {
            await page.emulate(iPhone)
            await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

            const initialState = await page.evaluateHandle(() => document.activeElement)
            await page.click('button[aria-controls="super-search-menu"]')
            const newState = await page.evaluateHandle(() => document.activeElement)
            expect(initialState._remoteObject.className).toBe('HTMLBodyElement')
            expect(newState._remoteObject.className).toBe('HTMLInputElement')
          })
        })

        describe('the navigation function', () => {

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

      describe('the menu items', () => {
        it('clicking menu link should change the window location (mobile)', async () => {
          await page.emulate(iPhone)
          await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

          const initialState = await page.evaluate(() => window.location.href)
          await page.click('.gem-c-layout-super-navigation-header__navigation-item-link')
          const newState = await page.evaluate(() => window.location.href)
          expect(initialState).not.toEqual(newState)
        })

        it('clicking menu link should change the window location (desktop)', async () => {
          await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

          const initialState = await page.evaluate(() => window.location.href)
          await page.click('.gem-c-layout-super-navigation-header__navigation-item-link')
          const newState = await page.evaluate(() => window.location.href)
          expect(initialState).not.toEqual(newState)
        })
      })

      describe('the search function', () => {
        it('clicking search link should change the window location (mobile)', async () => {
          await page.emulate(iPhone)
          await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

          const initialState = await page.evaluate(() => window.location.href)
          await page.click('.gem-c-layout-super-navigation-header__search-item-link')
          const newState = await page.evaluate(() => window.location.href)
          expect(initialState).not.toEqual(newState)
        })

        it('clicking search link should change the window location (desktop)', async () => {
          await page.goto(baseUrl + '/components/header/preview', { waitUntil: 'load' })

          const initialState = await page.evaluate(() => window.location.href)
          await page.click('.gem-c-layout-super-navigation-header__search-item-link')
          const newState = await page.evaluate(() => window.location.href)
          expect(initialState).not.toEqual(newState)
        })
      })
    })
  })
})
