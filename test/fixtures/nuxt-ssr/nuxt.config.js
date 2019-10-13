import { nuxtModulePath, vueStatorPath } from '../../utils/constants'

export default {
  buildModules: [nuxtModulePath],
  build: {
    extend (config) {
      config.resolve.alias['vue-stator'] = vueStatorPath
    }
  }
}
