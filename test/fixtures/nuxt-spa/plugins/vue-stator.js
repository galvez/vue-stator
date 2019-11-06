import Vue from 'vue'
import { plugin as VueStator } from 'vue-stator'
import * as options from '~/store'

// Note: the `vue-stator/nuxt` module supports SPA mode.
// Usage of Vue.use() here is purely didactic
Vue.use(VueStator, options)
