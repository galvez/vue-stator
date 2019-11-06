import path from 'path'

export const nuxtModulePath = path.resolve(__dirname, '../../nuxt')

export const vueStatorPath = path.resolve(__dirname, '../../src')

export const browserString = process.env.BROWSER_STRING || 'puppeteer/core/staticserver'

export const useBrowserstackLocal = browserString.includes('browserstack') && browserString.includes('local')
