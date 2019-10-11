
import { existsSync } from 'fs'
import { join, resolve } from 'path'

export default function (options = {}) {
  options = Object.assign(options, this.options.stator || {})
  const baseDirName = options.baseDir || 'store'
  const baseDir = join(this.options.srcDir, baseDirName)
  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: join(baseDirName, 'vue-stator/plugin.js'),
    options: {
      baseDir,
      localStorage: options.localStorage,
      sessionStorage: options.sessionStorage,
      hasGlobalActions: existsSync(join(baseDir, 'actions.js')),
      hasGlobalGetters: existsSync(join(baseDir, 'getters.js'))
    }
  })
}
