
import { existsSync, readdirSync } from 'fs'
import { join, resolve, parse } from 'path'

function loadStatorModules (baseDir) {
  return readdirSync(baseDir)
    .filter(p => !(['actions.js', 'getters.js', 'index.js'].includes(p)))
    .map((p) => {
      if (p.endsWith('.js')) {
        return { namespace: parse(p).name, actions: p }
      }
      const statorModule = {
        namespace: parse(p).name
      }
      if (existsSync(join(baseDir, p, 'actions.js'))) {
        statorModule.actions = join(p, 'actions.js')
      }
      if (existsSync(join(baseDir, p, 'getters.js'))) {
        statorModule.getters = join(p, 'getters.js')
      }
      return statorModule
    })
}

export default function (options = {}) {
  options = Object.assign(options, this.options.stator || {})
  const baseDirName = options.baseDir || 'store'
  const baseDir = join(this.options.srcDir, baseDirName)
  // Disable default Vuex store
  this.options.features.store = false
  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: join(baseDirName, 'vue-stator/plugin.js'),
    options: {
      baseDir: baseDirName,
      localStorage: options.localStorage,
      sessionStorage: options.sessionStorage,
      statorModules: loadStatorModules(baseDir),
      hasGlobalActions: existsSync(join(baseDir, 'actions.js')),
      hasGlobalGetters: existsSync(join(baseDir, 'getters.js'))
    }
  })
}
