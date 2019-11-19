import { nuxtModulePath, vueStatorPath } from '../../utils/constants'

export default {
  plugins: ['~/plugins/my-injection'],
  buildModules: [{
    src: nuxtModulePath,
    options: {
      inject: ['axios', 'firstInjection']
    }
  }],
  build: {
    extend (config) {
      config.resolve.alias['vue-stator'] = vueStatorPath
    }
  }
}
