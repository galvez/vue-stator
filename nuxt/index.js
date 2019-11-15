import path from 'path'

export default function NuxtStatorModule (options) {
  options = {
    ...options,
    ...this.options.stator
  }

  this.nuxtOptions.dir.stator = options.baseDir || 'store'
  const disableStore = 'disableVuex' in options ? options.disableVuex : true

  // Disable default Vuex store (options.features only exists in Nuxt v2.10+)
  if (this.options.features && disableStore) {
    this.options.features.store = false
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'vue-stator.js'
  })

  let statorModules
  this.nuxt.hook('builder:prepared', async (builder) => {
    // this is copied from nuxt/builder/builder.js:resolveStore
    statorModules = (await builder.resolveRelative(this.nuxtOptions.dir.stator))
      .sort(({ src: p1 }, { src: p2 }) => {
        // modules are sorted from low to high priority (for overwriting properties)
        let res = p1.split('/').length - p2.split('/').length
        if (res === 0 && p1.includes('/index.')) {
          res = -1
        } else if (res === 0 && p2.includes('/index.')) {
          res = 1
        }
        return res
      })
  })

  this.nuxt.hook('build:templates', ({ templateVars }) => {
    templateVars.statorModules = statorModules
  })
}
