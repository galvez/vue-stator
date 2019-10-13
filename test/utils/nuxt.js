import path from 'path'
import { defaultsDeep } from 'lodash'

export { Nuxt, Builder, BundleBuilder, Generator } from 'nuxt'
export * from '@nuxt/utils'

export async function loadFixture (fixture, overrides) {
  const rootDir = path.isAbsolute(fixture) ? fixture : path.resolve(__dirname, '..', 'fixtures', fixture)
  let config = {}

  try {
    config = await import(`${rootDir}/nuxt.config`)
    config = config.default || config
  } catch (e) {
    // Ignore MODULE_NOT_FOUND
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
  }

  if (typeof config === 'function') {
    config = await config()
  }

  config.rootDir = rootDir
  config.dev = false
  config.test = true

  // disable terser to speed-up fixture builds
  if (config.build) {
    if (!config.build.terser) {
      config.build.terser = false
    }
  } else {
    config.build = { terser: false }
  }

  /* config.buildModules = config.buildModules || []
  const moduleName = VueStatorModule.name

  let hasVueStatorModule = false
  if (config.buildModules) {
    hasVueStatorModule = config.buildModules.some((m) => {
      return (typeof m === 'function' && m.name === moduleName) || (Array.isArray(m) && m[0].name === moduleName)
    })
  }

  if (!hasVueStatorModule) {
    config.buildModules.push(VueStatorModule)
  } */

  return defaultsDeep({}, overrides, config)
}
