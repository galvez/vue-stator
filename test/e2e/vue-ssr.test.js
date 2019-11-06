import path from 'path'
import { getPort, startBrowser } from 'test-utils'

describe('basic', () => {
  let browser
  let page
  let nuxt
  const logSpies = {}

  beforeAll(async () => {
    const host = 'localhost'
    const port = await getPort()

    browser = await startBrowser({
      globalName: 'vue',
      folder: path.resolve(__dirname, '../fixtures', 'vue-ssr', 'dist'),
      port
    })

    // Override browsers getUrl
    browser.getUrl = path => `http://${host}:${port}${path}`

    // pass through browser errors, only works with chrome/puppeteer
    browser.setLogLevel(['log', 'info', 'warn', 'error'])

    const browserName = browser.constructor.name
    browser.supportsLogging = browserName.includes('Puppeteer') || browserName.includes('Chrome')
    if (browser.supportsLogging) {
      logSpies.log = jest.spyOn(console, 'log')
      logSpies.warn = jest.spyOn(console, 'warn')
      logSpies.error = jest.spyOn(console, 'error')
    }
  })

  beforeEach(() => jest.resetAllMocks())

  afterAll(async () => {
    await nuxt.close()
    await browser.close()
  })

  async function testHome (nav) {
    if (browser.supportsLogging) {
      expect(logSpies.warn).not.toHaveBeenCalled()
      expect(logSpies.error).not.toHaveBeenCalled()
    }

    expect(await page.getText('.state')).toBe(nav ? '456' : '123')
    expect(await page.getText('.getter')).toBe('Jonas Galvez')
  }

  async function testAbout (nav) {
    if (browser.supportsLogging) {
      expect(logSpies.warn).not.toHaveBeenCalled()
      expect(logSpies.error).not.toHaveBeenCalled()
    }

    expect(await page.getText('.state')).toBe('456')
    expect(await page.getText('.getter')).toBe(nav ? 'Jonas Galvez' : 'John Doe')
  }

  test('open container', async () => {
    const url = browser.getUrl('/')
    page = await browser.page(url)

    await testHome()
  })

  test('nav /about', async () => {
    await page.navigate('/about')

    await testAbout(true)
  })

  test('open /about', async () => {
    const url = browser.getUrl('/about')
    page = await browser.page(url)

    await testAbout()
  })

  test('nav /', async () => {
    await page.navigate('/')

    await testHome(true)
  })
})
