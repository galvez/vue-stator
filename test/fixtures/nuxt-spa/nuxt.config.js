import { vueStatorPath } from '../../utils/constants'

export default {
  mode: 'spa',

  // Note: the `vue-stator/nuxt` module supports SPA mode.
  // Usage of Vue.use() here (in plugins/vue-stator) is purely didactic
  plugins: ['~/plugins/vue-stator'],

  // For library testing only:
  build: {
    extend (config) {
      config.resolve.alias['vue-stator'] = vueStatorPath
    }
  }
}
