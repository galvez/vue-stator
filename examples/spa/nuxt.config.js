import { resolve } from 'path'

export default {
  mode: 'spa',
  plugins: ['~/plugins/vue-stator'],
  // For library testing only:
  build: {
    transpile: ['vue-stator'],
    extend (config) {
      config.resolve.alias['vue-stator'] = resolve(__dirname, '..', '..')
    }
  }
}


// Note: the `vue-stator/nuxt` module supports SPA mode.
// Usage of Vue.use() here (in plugins/vue-stator) is purely didactic
