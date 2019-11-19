import fs from 'fs'
import path from 'path'
import env from 'node-env-file'
import { createBrowser } from 'tib'
import { browserString, useBrowserstackLocal } from './constants'

export function startBrowser ({ folder, port, globalName = 'nuxt', extendPage = {} } = {}) {
  if (useBrowserstackLocal) {
    const envFile = path.resolve(__dirname, '..', '..', '.env-browserstack')

    if (fs.existsSync(envFile)) {
      env(envFile)
    }
  }

  globalName = `$${globalName}`

  return createBrowser(browserString, {
    quiet: true,
    staticServer: {
      folder,
      port
    },
    extendPage (page) {
      return {
        async navigate (path) {
          /* eslint-disable no-console */
          await page.runAsyncScript((path, globalName) => {
            if (!window[globalName]) {
              console.error('window.'.concat(globalName, ' does not exists'))
            }

            return new Promise((resolve) => {
              // timeout after 10s
              const timeout = setTimeout(function () {
                console.error('browser: nuxt navigation timed out')
                window[globalName].$emit('routeChanged')
              }, 10000)

              window[globalName].$once('routeChanged', () => {
                clearTimeout(timeout)
                setTimeout(resolve, 250)
              })
              window[globalName].$router.push(path)
            })
          }, path, globalName)
          /* eslint-ensable no-console */
        },
        routeData () {
          return page.runScript(() => ({
            path: window.$nuxt.$route.path,
            query: window.$nuxt.$route.query
          }))
        },
        stator (prop) {
          /* eslint-disable no-console */
          return page.runScript((prop, globalName) => {
            const stator = window[globalName].$stator
            if (prop) {
              return stator ? stator[prop] : undefined
            }
            return stator
          }, prop, globalName)
        },
        ...extendPage
      }
    }
  })
}
