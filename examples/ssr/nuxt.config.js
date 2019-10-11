import { resolve } from 'path'
import VueStatorNuxt from '../../nuxt'

export default {
  buildModules: [VueStatorNuxt],
  build: {
    transpile: ['vue-stator'],
    extend (config) {
      config.resolve.alias['vue-stator'] = resolve(__dirname, '..', '..')
    }
  }
}
