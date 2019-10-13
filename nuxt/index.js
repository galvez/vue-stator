
import fs from 'fs'
import { join, resolve, parse } from 'path'
import { promisify } from 'util'

const readDir = promisify(fs.readdir)

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
  const modulePaths = await readDir(baseDir)

  const modules = await Promise.all(modulePaths
    .filter(path => !(['actions.js', 'state.js', 'getters.js', 'index.js'].includes(path)))
    .map(async (path) => {
      const { name: namespace } = parse(path)

      if (path.endsWith('.js')) {
        return {
          namespace,
          actions: path
        }
      }

      let statorModule
      for (const type of ['actions', 'getters']) {
        if (await exists(join(baseDir, path, `${type}.js`))) {
          statorModule = statorModule || { namespace }
          statorModule[type] = join(path, `${type}.js`)
        }
      }

      return statorModule
    }))

  return modules.filter(Boolean)
}

export default async function NuxtStatorModule (options) {
  options = {
    ...options,
    ...this.options.stator
  }

  const baseDirName = options.baseDir || 'store'
  const baseDir = join(this.options.srcDir, baseDirName)

  // Disable default Vuex store
  this.options.features.store = false
  this.options.build.transpile.push('vue-stator')

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'vue-stator.js',
    options: {
      isSPA: this.options.mode === 'spa',
      baseDir: baseDirName,
      localStorage: options.localStorage,
      sessionStorage: options.sessionStorage,
      statorModules: await loadStatorModules(baseDir),
      hasGlobalActions: await exists(join(baseDir, 'actions.js')),
      hasGlobalGetters: await exists(join(baseDir, 'getters.js'))
    }
  })
}
