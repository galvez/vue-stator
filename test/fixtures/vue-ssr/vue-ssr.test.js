import { buildVueFixture } from 'test-utils/build'
import { renderPage } from './server'

buildVueFixture({
  dir: __dirname,
  entry: 'browser.js',
  urls: ['/', '/about'],
  renderPage
})
