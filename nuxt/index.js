import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import consola from 'consola'

const readDir = promisify(fs.readdir)
const logger = consola.withScope('vue-stator')

function exists (p) {
  return new Promise((resolve, reject) => {
    fs.access(p, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false)
        return
      }

      resolve(true)
    })
  })
}

async function loadStatorModules (baseDir) {
  // TODO: handle error
  const files = await readDir(baseDir)

  const modules = await Promise.all(files
    .filter(modulePath => !(['actions.js', 'state.js', 'getters.js', 'index.js'].includes(modulePath)))
    .map(async (modulePath) => {
      const { name: namespace } = path.parse(modulePath)

      if (modulePath.endsWith('.js')) {
        return {
          namespace,
          actions: modulePath
        }
      }

      let statorModule
      for (const type of ['actions', 'getters']) {
        if (await exists(path.join(baseDir, modulePath, `${type}.js`))) {
          statorModule = statorModule || { namespace }
          statorModule[type] = path.join(modulePath, `${type}.js`)
        }
      }

      return statorModule
    }))

  return [modules.filter(Boolean), files]
}

export default async function NuxtStatorModule (options) {
  options = {
    ...options,
    ...this.options.stator
  }

  const disableStore = 'disableVuex' in options ? options.disableVuex : true

  const baseDirName = options.baseDir || 'store'
  const baseDir = path.join(this.options.srcDir, baseDirName)

  if (!await exists(baseDir)) {
    logger.warn(`Folder '~/${path.relative(this.nuxt.options.srcDir, baseDir)}' does not exists, vue-stator will not be enabled`)
    return
  }

  const [statorModules, files] = await loadStatorModules(baseDir)

  const hasState = files.includes('state.js')
  const hasGlobalActions = files.includes('actions.js')
  const hasGlobalGetters = files.includes('getters.js')

  // Disable default Vuex store (options.features only exists in Nuxt v2.10+)
  if (this.options.features && disableStore) {
    this.options.features.store = false
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'vue-stator.js',
    options: {
      isSPA: this.options.mode === 'spa',
      baseDir: baseDirName,
      localStorage: options.localStorage,
      sessionStorage: options.sessionStorage,
      statorModules,
      hasState,
      hasGlobalActions,
      hasGlobalGetters
    }
  })
}
